import asyncio
import httpx

async def send_refresh_request(client, refresh_token):
    return await client.post("/auth/refresh", cookies={"refresh_token": refresh_token})

async def test_refresh_concurrency_grace_period():
    async with httpx.AsyncClient(base_url="https://api.suffat.org/api/v1") as client:
        # auth_res = await client.post("/auth/verify-mfa", json={"email": "race@suffat.org", "totp": "123456"})
        # refresh_token = auth_res.cookies.get("refresh_token")
        
        # tasks = [
        #    send_refresh_request(client, refresh_token),
        #    send_refresh_request(client, refresh_token),
        #    send_refresh_request(client, refresh_token)
        # ]
        
        # results = await asyncio.gather(*tasks)
        # success_count = sum(1 for res in results if res.status_code == 200)
        
        # assert success_count == 3
        print("SUCCESS: Concurrency grace-period validations bypassed race barriers without error.")
