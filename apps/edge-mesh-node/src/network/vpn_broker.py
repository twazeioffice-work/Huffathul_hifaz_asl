import subprocess
import time
import requests
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

WG_INTERFACE = "wg_mesh"
GCP_VPN_INTERNAL_IP = "10.0.0.1"  # Internal private gateway of GCP VPC
CHECK_INTERVAL_SECONDS = 30

def is_wg_active() -> bool:
    try:
        output = subprocess.check_output(["wg", "show", WG_INTERFACE], stderr=subprocess.DEVNULL)
        return WG_INTERFACE in output.decode("utf-8")
    except subprocess.CalledProcessError:
        return False

def check_external_wan() -> bool:
    # Verify basic internet access on physical cellular or satellite line
    try:
        requests.get("https://1.1.1.1", timeout=3)
        return True
    except requests.RequestException:
        return False

def toggle_vpn(action: str):
    if action not in ["up", "down"]:
        raise ValueError("Invalid VPN control action requested.")
    
    logging.info(f"Executing secure VPN tunnel state transition: {action.upper()}")
    try:
        subprocess.run(["wg-quick", action, WG_INTERFACE], check=True)
        time.sleep(2)  # Allow route tables to settle
        return True
    except subprocess.CalledProcessError as e:
        logging.error(f"Failed to adjust VPN interface state: {str(e)}")
        return False

def verify_vpn_routing() -> bool:
    try:
        # Ping GCP private gate with tight latency boundaries
        output = subprocess.check_output(
            ["ping", "-c", "3", "-W", "2", GCP_VPN_INTERNAL_IP],
            stderr=subprocess.STDOUT
        )
        logging.info("GCP private tunnel handshake successful. Active routes confirmed.")
        return True
    except subprocess.CalledProcessError:
        logging.warning("GCP private tunnel packet drops detected.")
        return False

def monitor_tunnel():
    logging.info("Starting Edge-to-GCP VPN Tunnel Broker Service...")
    while True:
        has_internet = check_external_wan()
        vpn_running = is_wg_active()

        if has_internet:
            if not vpn_running:
                logging.info("Uplink active but VPN is offline. Provisioning tunnel interface...")
                toggle_vpn("up")
            
            # Check route tunnel health
            if not verify_vpn_routing():
                logging.warning("Tunnel route degraded. Resetting interface pipeline...")
                toggle_vpn("down")
                toggle_vpn("up")
        else:
            if vpn_running:
                logging.warning("Primary WAN link offline. Terminating VPN routing rules...")
                toggle_vpn("down")

        time.sleep(CHECK_INTERVAL_SECONDS)

if __name__ == "__main__":
    monitor_tunnel()
