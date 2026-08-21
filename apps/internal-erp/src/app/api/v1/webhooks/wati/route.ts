import { NextResponse } from "next/server";
import { generateReportCard } from "@/services/llmReportGenerator";
import { sendWatiMessage } from "@/services/watiClient";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // WATI typical webhook structure contains messages array
    const messages = payload.messages || [];
    if (messages.length === 0) {
      return NextResponse.json({ status: "ignored" });
    }

    const message = messages[0];
    const senderPhone = message.from; // e.g. '919876543210'
    const messageText = message.text?.body || "";

    if (!messageText) {
      return NextResponse.json({ status: "ignored", reason: "no text" });
    }

    console.log(`[WATI Webhook] Received message from ${senderPhone}: "${messageText}"`);

    // In a real database, we would query the student matching this parent's phone number.
    // For this implementation, we will mock the database retrieval using the senderPhone.
    const mockStudentData = {
      name: "Zaid Ibrahim",
      sabaq: [
        { date: "2026-08-20", pages: 1, quality: "Mumtaz" },
        { date: "2026-08-19", pages: 1, quality: "Jayyid" },
      ],
      attendance: [
        { date: "2026-08-20", status: "Present" },
        { date: "2026-08-19", status: "Present" },
      ],
      adab: 9
    };

    // 1. Generate the LLM Report
    const reportText = await generateReportCard(
      mockStudentData.name, 
      messageText, 
      mockStudentData
    );

    // 2. Send the report back to the parent via WATI
    await sendWatiMessage(senderPhone, reportText);

    return NextResponse.json({ status: "success", message_sent: true }, { status: 200 });
  } catch (error) {
    console.error("[WATI Webhook] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
