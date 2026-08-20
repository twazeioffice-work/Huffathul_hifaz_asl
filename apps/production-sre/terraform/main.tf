provider "google" {
  project = "suffat-production-01"
  region  = "asia-south1"
}

resource "google_container_cluster" "primary_gke" {
  name     = "suffat-erp-gke-cluster"
  location = "asia-south1-c"

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  # Network boundary protection
  network_policy {
    enabled = true
    provider = "CALICO"
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "suffat-erp-node-pool"
  location   = "asia-south1-c"
  cluster    = google_container_cluster.primary_gke.name
  node_count = 3

  node_config {
    machine_type = "e2-standard-4"
    disk_size_gb = 50
    disk_type    = "pd-ssd"
    
    # SRE Best Practice: Shielded nodes and least privilege IAM
    shielded_instance_config {
      enable_secure_boot = true
    }
  }
}
