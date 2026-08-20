import pytest
import os

def test_k8s_network_policy_default_deny():
    """
    Validation Gate: Ensures the Kubernetes namespace drops ALL unapproved traffic.
    """
    policy_path = "apps/production-sre/kubernetes/network-policy.yaml"
    
    assert os.path.exists(policy_path), "Network policy file is missing."
    
    with open(policy_path, "r") as f:
        content = f.read()
        
    assert "name: default-deny-all" in content
    assert "podSelector: {}" in content
    assert "Ingress" in content
    assert "Egress" in content

def test_terraform_shielded_nodes():
    """
    Validation Gate: Ensures GKE Node Pools use Shielded Instances.
    """
    tf_path = "apps/production-sre/terraform/main.tf"
    
    assert os.path.exists(tf_path), "Terraform configuration is missing."
    
    with open(tf_path, "r") as f:
        content = f.read()
        
    assert "shielded_instance_config" in content
    assert "enable_secure_boot = true" in content
