import { GoogleGenAI } from "@google/genai";

export async function generateReportCard(
  studentName: string,
  parentMessage: string,
  progressData: {
    sabaq: any[];
    attendance: any[];
    adab: number;
  }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("[LLM] GEMINI_API_KEY missing. Returning mock report.");
    return `*Progress Report: ${studentName}*\n\nAlhamdulillah, your child is doing well! (This is a mock response because the Gemini API key is not configured in .env).`;
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
You are an empathetic, professional, and encouraging Islamic school coordinator.
A parent has reached out on WhatsApp asking about their child's progress.
Write a well-structured, warm WhatsApp message summarizing their child's progress.

Rules:
1. Use WhatsApp markdown formatting (*bold*, _italics_, ~strikethrough~).
2. Include tasteful emojis (✨, 📚, 🕌, etc.).
3. Start with an Islamic greeting (e.g., As-salamu alaykum).
4. Reply in the SAME language the parent used in their message.
5. Keep it concise, highlighting their recent memorization (Sabaq), attendance, and behavior (Adab).
6. End with a polite closing, offering further assistance if needed.
`;

  const dataContext = `
Student Name: ${studentName}
Recent Attendance: ${JSON.stringify(progressData.attendance)}
Recent Sabaq (Memorization): ${JSON.stringify(progressData.sabaq)}
Overall Adab/Behavior Score (Out of 10): ${progressData.adab}

Parent's incoming message: "${parentMessage}"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + dataContext }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Report generation failed.";
  } catch (error) {
    console.error("[LLM] Failed to generate report:", error);
    return "Assalamu alaykum. We are currently experiencing an issue retrieving the detailed report. Please contact the administration directly.";
  }
}
