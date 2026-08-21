export async function sendWatiMessage(phone: string, text: string) {
  const watiEndpoint = process.env.WATI_API_ENDPOINT;
  const watiToken = process.env.WATI_ACCESS_TOKEN;

  if (!watiEndpoint || !watiToken) {
    console.warn("[WATI] Integration missing credentials. Mocking send to:", phone);
    console.log("[WATI] Message:\n", text);
    return { success: true, mocked: true };
  }

  try {
    // Standard format requires stripping '+' from phone
    const cleanPhone = phone.replace(/\D/g, "");
    
    // Check WATI docs for exact endpoint structure; usually /api/v1/sendSessionMessage/{waId}
    const url = `${watiEndpoint.replace(/\/$/, '')}/api/v1/sendSessionMessage/${cleanPhone}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": watiToken,
        "Content-Type": "application/json-patch+json" // WATI often requires this content type
      },
      body: JSON.stringify({ messageText: text })
    });

    if (!response.ok) {
      throw new Error(`WATI API returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("[WATI] Failed to send message:", error);
    return { success: false, error };
  }
}
