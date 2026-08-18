# GCP VM Deployment & Ecosystem Bootstrapping Runbook

**Target Instance:** `testbedofficeboy`
**Zone:** `asia-south1-c`
**OS:** Ubuntu 22.04.5 LTS (Minimal Pro)
**Architecture:** x86_64

This runbook contains the exact execution steps to bootstrap the minimal Ubuntu instance, install the required orchestration dependencies, and pull the Suffat-ul Huffaz monorepo for live hosting.

## Phase 1: VM Priming & Security Updates

Because your system is minimized and currently flags `*** System restart required ***`, we must update the kernel and install standard networking utilities.

Run the following commands in your SSH terminal:

```bash
# 1. Update package lists and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# 2. Install essential build tools, curl, and git
sudo apt install -y build-essential curl git wget unzip software-properties-common apt-transport-https ca-certificates gnupg

# 3. Reboot the server to apply the pending kernel update
sudo reboot
```

*(Wait 60 seconds and SSH back into the instance)*

---

## Phase 2: Installing the Enterprise Toolchain (Docker, Node, PNPM, Python)

Once reconnected, run this monolithic block to install Docker, Node.js v20, `pnpm`, and the Python backend tools needed by the Swarm and FastAPI servers:

```bash
# 1. Install Docker & Docker Compose
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. Add current user to Docker group (avoids needing sudo for docker)
sudo usermod -aG docker $USER
newgrp docker

# 3. Install Node.js (LTS v20) & PNPM
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
sudo corepack prepare pnpm@latest --activate

# 4. Install Python 3 & Pip (For FastAPI / Swarm MCP)
sudo apt install -y python3-pip python3-venv
```

---

## Phase 3: Cloning the Ecosystem & Initializing

Now we pull the exact architectural blueprint we just built on your local machine directly into the GCP VM.

```bash
# 1. Authenticate with GitHub (Use your PAT token if the repo is private)
# Replace <YOUR_GITHUB_PAT> with your actual token
git clone https://<YOUR_GITHUB_PAT>@github.com/twazeioffice-work/Huffathul_hifaz_asl.git

# 2. Navigate to the Ecosystem Root
cd Huffathul_hifaz_asl/suffat-ul-huffaz-ecosystem

# 3. Install the PNPM Monorepo dependencies
pnpm install

# 4. Verify the architecture
ls -la
cat swarm_manifest.json
```

---

## Phase 4: Network & Firewall Setup (asia-south1-c)

To ensure the public website (Port 80/443), ERP (Port 3000), and FastAPI Backend (Port 8000) are accessible from the internet, you must open the GCP firewall rules:

```bash
# Assuming you have gcloud CLI locally, or run this from GCP Cloud Shell:
gcloud compute firewall-rules create allow-suffat-web \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:80,tcp:443,tcp:3000,tcp:8000 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=http-server,https-server
```
*(Make sure your instance `testbedofficeboy` has the `http-server` and `https-server` network tags applied in the GCP console).*
