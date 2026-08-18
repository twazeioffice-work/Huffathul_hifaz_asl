# Location: apps/production-sre/terraform/main.tf

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.10.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. VPC NETWORK DECLARATION
resource "google_compute_network" "vpc_network" {
  name                    = "suffat-prod-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name                     = "suffat-prod-subnet"
  ip_cidr_range            = "10.0.0.0/20"
  region                   = var.region
  network                  = google_compute_network.vpc_network.id
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "gke-pods"
    ip_cidr_range = "10.4.0.0/14"
  }
  secondary_ip_range {
    range_name    = "gke-services"
    ip_cidr_range = "10.8.0.0/20"
  }
}

# 2. REGIONAL HA CLOUD SQL (PostgreSQL 16 Engine)
resource "google_sql_database_instance" "postgres_db" {
  name             = "suffat-prod-db-instance"
  database_version = "POSTGRES_16"
  region           = var.region
  settings {
    tier              = "db-custom-8-32768" # 8 vCPUs, 32 GB RAM
    availability_type = "REGIONAL"          # Enables High Availability Mirroring
    disk_size         = 100                 # GB
    disk_type         = "PD_SSD"
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc_network.id
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true # WAL Continuous Archiving for PITR
      start_time                     = "02:00"
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }
    database_flags {
      name  = "log_disconnections"
      value = "on"
    }
  }
}

# 3. REGIONAL GKE PRIVATE CLUSTER
resource "google_container_cluster" "gke_cluster" {
  name     = "suffat-prod-gke"
  location = var.region # Deploy across multi-zone regional node-pools

  network    = google_compute_network.vpc_network.id
  subnetwork = google_compute_subnetwork.subnet.id

  remove_default_node_pool = true
  initial_node_count       = 1

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  ip_allocation_policy {
    cluster_secondary_range_name  = "gke-pods"
    services_secondary_range_name = "gke-services"
  }
}

resource "google_container_node_pool" "node_pool" {
  name       = "suffat-prod-node-pool"
  location   = var.region
  cluster    = google_container_cluster.gke_cluster.name
  node_count = 2

  autoscaling {
    min_node_count = 2
    max_node_count = 10
  }

  node_config {
    preemptible  = false
    machine_type = "e2-standard-4"

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    sandbox_config {
      sandbox_type = "gvisor" # Secure container isolation configuration
    }
  }
}
