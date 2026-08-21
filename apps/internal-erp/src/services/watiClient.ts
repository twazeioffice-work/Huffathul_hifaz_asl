export interface WatiMessagePayload {
  whatsappNumber: string;
  messageText: string;
}

/**
 * Dispatches a WhatsApp Session message back to the parent using the WATI API.
 */
export async function sendWatiSessionMessage(payload: WatiMessagePayload): Promise<boolean> {
  const watiApiUrl = process.env.WATI_API_ENDPOINT; // e.g., https://live-server.wati.io/api/v1
  const accessToken = process.env.WATI_ACCESS_TOKEN;

  if (!watiApiUrl || !accessToken) {
    console.warn("WATI API credentials missing. Simulating output logs in Development Mode.");
    console.log(`[WATI MOCK SEND] To: ${payload.whatsappNumber}\nBody:\n${payload.messageText}`);
    return true;
  }

  const normalizedPhone = payload.whatsappNumber.replace(/[^0-9]/g, "");

  // Execute outbound dispatch
  try {
    const response = await fetch(`${watiApiUrl}/api/v1/sendSessionMessage/${normalizedPhone}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ messageText: payload.messageText }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`WATI API returned status ${response.status}: ${errorMsg}`);
    }

    const result = await response.json();
    return result.result === "success" || result.valid === true;
  } catch (error) {
    console.error(`CRITICAL: Failed to dispatch WhatsApp payload to WATI client (${normalizedPhone}):`, error);
    return false;
  }
}
