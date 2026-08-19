import httpx
import logging
from celery import shared_task
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger("celery.outbound")

META_API_URL = "https://graph.facebook.com/v19.0"
WHATSAPP_PHONE_NUMBER_ID = "your-whatsapp-phone-id"
META_BEARER_TOKEN = "your-system-bearer-token"

@shared_task(name="tasks.dispatch_whatsapp_template")
def dispatch_whatsapp_template(phone: str, template_name: str, language_code: str, components: list):
    """
    Celery task wrapper to execute outbound communication dispatch via Meta Graph API.
    """
    import asyncio
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(
        async_send_whatsapp_template(phone, template_name, language_code, components)
    )

# Auto-retry on connection errors with a 5-step exponential wait limit (2s, 4s, 8s, 16s, max 30s)
@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=2, max=30), reraise=True)
async def async_send_whatsapp_template(phone: str, template_name: str, language_code: str, components: list):
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": language_code},
            "components": components
        }
    }
    
    headers = {
        "Authorization": f"Bearer {META_BEARER_TOKEN}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{META_API_URL}/{WHATSAPP_PHONE_NUMBER_ID}/messages"
        response = await client.post(url, json=payload, headers=headers)
        
        # Raise exception for HTTP error statuses (like 500 or 503) to trigger tenacity retry loop
        if response.status_code != 200:
            logger.error(f"[!] Meta API Failure: {response.status_code} | Body: {response.text}")
            response.raise_for_status()
            
        logger.info(f"[✓] Outbound template '{template_name}' successfully sent to: {phone}")
        return response.json()
