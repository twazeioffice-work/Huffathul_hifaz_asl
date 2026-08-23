import { NextRequest, NextResponse } from "next/server";
import { generateAIReportCard } from "../../../../services/llmReportGenerator";
import { sendWatiSessionMessage } from "../../../../services/watiClient";

// Simple in-memory cache to handle immediate webhook deduplication (WA message IDs)
const processedMessageCache = new Set<string>();

/**
 * Webhook handler receiving live conversational events from the WATI dashboard.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // 1. Extract WATI properties from the incoming JSON envelope
    // Note: WATI payloads generally supply message details under 'id', 'senderString', and 'text'
    const messageId = payload.id || payload.messageId;
    const parentPhone = payload.senderString || payload.waId; 
    const messageText = payload.text || payload.messageText || "";

    if (!parentPhone) {
      return NextResponse.json({ success: false, error: "Missing parent identifier (waId)." }, { status: 400 });
    }

    // 2. Immediate Deduplication (Fast-ACK Gate)
    if (messageId && processedMessageCache.has(messageId)) {
      return NextResponse.json({ status: "ignored", message: "Duplicate payload detected." }, { status: 200 });
    }

    if (messageId) {
      processedMessageCache.add(messageId);
      // Clean up cache periodically in high-traffic setups
      if (processedMessageCache.size > 5000) {
        processedMessageCache.clear();
      }
    }

    // 3. Spawns asynchronous worker processing in the background to guarantee < 1s response times
    // This satisfies WATI/Meta's strict fast-ACK SLA rules.
    processInboundParentMessageAsync(parentPhone, messageText)
      .catch((err) => console.error("Conversational background process failed:", err));

    return NextResponse.json({ status: "received", message: "Webhook queued successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("WATI Webhook Parser Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}

/**
 * Decoupled background service mapping the parent phone to active student records,
 * compiling history, invoking Gemini, and dispatching report cards back via WATI.
 */
async function processInboundParentMessageAsync(parentPhone: string, parentMessage: string) {
  const normalizedPhone = parentPhone.replace(/[^0-9]/g, "");

  // 1. Query the secure Core Backend to retrieve student profiles linked to this parent number.
  // This delegation preserves RLS boundaries at the FastAPI layer.
  const backendUrl = process.env.INTERNAL_API_URL || "http://localhost:8000";
  const systemToken = process.env.SYSTEM_INTEGRATION_TOKEN; // Microservice-to-microservice secure token

  const response = await fetch(
    `${backendUrl}/api/v1/portal/students/progress-by-parent-phone?phone=${normalizedPhone}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${systemToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to resolve parent profile on backend: ${response.status}`);
  }

  const payload = await response.json();
  // Expects structure: { found: boolean, students: StudentProgressData[] }
  if (!payload.found || !payload.students || payload.students.length === 0) {
    // Send a friendly prompt if the phone number is not registered in our ERP database
    await sendWatiSessionMessage({
      whatsappNumber: parentPhone,
      messageText: "Assalamoalaikum. We could not find a registered student linked to this phone number in the Suffat-ul Huffaz database. Please contact your local Center Administrator (Nazim) to verify your contact card. JazakAllah khair!",
    });
    return;
  }

  // 2. Loop through all registered children linked to this parent card (supports multi-sibling families!)
  for (const student of payload.students) {
    // Check if the center admin has disabled dynamic parent updates for this specific student standard
    const isLmsEnabled = student.enabledModules?.halqa || student.enabledModules?.namaz;
    if (isLmsEnabled === false) {
      await sendWatiSessionMessage({
        whatsappNumber: parentPhone,
        messageText: `Assalamoalaikum. Mobile portal updates for *${student.studentName}* are currently locked by the Center Admin. Please review your parent portal dashboard online at Port 3001. JazakAllah khair!`,
      });
      continue;
    }

    // 3. Call the multilingual Gemini LLM Report Generator to construct the message
    const formattedReport = await generateAIReportCard(student, parentMessage);

    // 4. Dispatch the gorgeous, personalized report card back to the parent
    await sendWatiSessionMessage({
      whatsappNumber: parentPhone,
      messageText: formattedReport,
    });
  }
}
export async function GET() { return NextResponse.json({ hello: "world" }); }
