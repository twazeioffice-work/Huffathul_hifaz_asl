import asyncio
import aiohttp
import time
import random
import sys

async def hammer_endpoints(duration_minutes):
    base_url = "http://localhost:8000/api/v1"
    
    # We test the endpoints. Since DB is empty, 401s or 404s might be expected, but we shouldn't get 500 Server Errors!
    endpoints = [
        "/portal/complaints",
        "/portal/facilities",
        "/portal/notices",
    ]
    
    print(f"Initiating Antigravity Sentinel {duration_minutes}-Minute Bombardment Protocol...")
    start_time = time.time()
    duration = duration_minutes * 60 
    
    req_count = 0
    err_count = 0
    
    async with aiohttp.ClientSession() as session:
        while time.time() - start_time < duration:
            tasks = []
            for _ in range(25): # batch size
                ep = random.choice(endpoints)
                tasks.append(session.get(f"{base_url}{ep}"))
                
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            for r in responses:
                req_count += 1
                if isinstance(r, Exception):
                    err_count += 1
                elif r.status >= 500:
                    err_count += 1
            
            # small sleep to avoid completely starving the OS, maintaining high concurrency
            await asyncio.sleep(0.05)
            
            if req_count % 1000 == 0:
                elapsed = time.time() - start_time
                print(f"[{elapsed:.1f}s] Sent {req_count} requests. Errors (5xx/Exception): {err_count}")

    print(f"\nBombardment complete! Total Requests: {req_count}, Errors: {err_count}")
    if err_count > 0:
        print("Sentinel Diagnostics: FAILED. High error rate under load.")
    else:
        print("Sentinel Diagnostics: PASSED. System remained stable under continuous load.")

if __name__ == '__main__':
    # Default 20 mins, but can be configured
    duration = float(sys.argv[1]) if len(sys.argv) > 1 else 20
    asyncio.run(hammer_endpoints(duration))
