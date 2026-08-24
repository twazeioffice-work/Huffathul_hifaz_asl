import os

FILE_PATH = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\next.config.mjs"
with open(FILE_PATH, "r", encoding="utf-8") as f:
    config = f.read()

config = config.replace("""  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8000/api/v1/:path*", // Proxy to FastAPI Backend
      },
    ];
  },""", "")

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(config)

print("Removed FastAPI proxy rewrite from Next.js config.")
