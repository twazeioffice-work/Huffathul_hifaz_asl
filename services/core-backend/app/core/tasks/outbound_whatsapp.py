import os
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

META_API_TOKEN = os.getenv("META_API_BEARER_TOKEN", "MOCK_TOKEN_FOR_NOW")
META_PHONE_ID = os.getenv("META_PHONE_NUMBER_ID", "MOCK_ID")

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=2, max=30))
async def dispatch_whatsapp_welcome(phone: str, first_name: str, admission_number: str, temp_password: str):
    endpoint = f"https://graph.facebook.com/v17.0/{META_PHONE_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {META_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": {
            "name": "welcome_student_enrollment",
            "language": {"code": "en_US"},
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": first_name},
                        {"type": "text", "text": admission_number},
                        {"type": "text", "text": temp_password}
                    ]
                }
            ]
        }
    }
    
    # In a real environment, this would call the API.
    # For now, we simulate a successful call to avoid errors with mock tokens.
    if META_API_TOKEN != "MOCK_TOKEN_FOR_NOW":
        async with httpx.AsyncClient() as client:
            res = await client.post(endpoint, json=payload, headers=headers)
            if res.status_code != 200:
                raise httpx.HTTPStatusError("WhatsApp dispatch failed.", request=res.request, response=res)
    else:
        print(f"MOCK WHATSAPP OUTBOUND: Sent welcome to {phone} [Admission: {admission_number}]")
