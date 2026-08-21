export interface StudentProgressData {
  studentName: string;
  rollNumber: string;
  centerName: string;
  hifzStats: {
    currentJuz: number;
    completedPages: number;
    averageGrade: string;
    recentLessons: Array<{
      date: string;
      juzNumber: number;
      pageStart: number;
      pageEnd: number;
      grade: string;
      teacherNotes?: string;
    }>;
  };
  attendanceStats: {
    presentCount: number;
    totalCount: number;
    recentPrayers: Array<{
      date: string;
      fajr: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    }>;
  };
  behaviorStats: {
    adabScore: number; // Out of 10
    cleanlinessScore: number; // Out of 10
    respectScore: number; // Out of 10
    recentWarnings?: string[];
  };
  enabledModules?: {
    halqa?: boolean;
    namaz?: boolean;
  };
}

/**
 * Invokes Google Gemini 1.5 Flash to generate a highly encouraging, multilingual progress report.
 * Dynamically detects the parent's language based on their incoming message or defaults to English.
 */
export async function generateAIReportCard(
  studentData: StudentProgressData,
  incomingParentMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  // Constructing a detailed prompt passing raw database metrics
  const systemInstructions = `
You are an empathetic, professional, and supportive Islamic Madrasah Coordinator at Suffat-ul Huffaz.
Your goal is to write a personalized student progress update for a parent based on the provided raw data.

CRITICAL FORMATTING RULES:
1. Use WhatsApp-friendly Markdown only (*bold* for highlights, _italics_ for emphasis, inline code if needed). Do NOT use HTML or standard headers (###).
2. Start with a warm Islamic greeting (e.g., "Assalamoalaikum Warahmatullahi Wabarakatuh").
3. Use bullet points and appropriate emojis (📖, 🟢, 🕌, ✨, 🌟) to make the report card visually clear, tidy, and highly readable on mobile screens.
4. Keep the tone encouraging, respectful, and balanced, providing constructive advice if behavior or attendance needs improvement.
5. Do NOT fabricate any statistics, dates, or grades not present in the raw data.

MULTILINGUAL TRANSLATION INSTRUCTION:
Analyze the incoming message from the parent: "${incomingParentMessage}".
- If the message is in Urdu, write the entire response in clean, professional Urdu script.
- If in Arabic, write in elegant Arabic.
- Otherwise, default to English, but keep terms like "Sabaq", "Manzil", and "Adab" intact to preserve cultural context.
`;

  const userPrompt = `
RAW STUDENT RECORD:
- Student: ${studentData.studentName} (Roll: ${studentData.rollNumber})
- Center: ${studentData.centerName}
- Current Hifz Progress: Juz ${studentData.hifzStats.currentJuz}, ${studentData.hifzStats.completedPages} pages logged.
- Recent Lessons: ${JSON.stringify(studentData.hifzStats.recentLessons)}
- Attendance Performance: ${studentData.attendanceStats.presentCount}/${studentData.attendanceStats.totalCount} days present.
- Recent Prayer Logs: ${JSON.stringify(studentData.attendanceStats.recentPrayers)}
- Behavior & Adab (Out of 10):
  * Adab: ${studentData.behaviorStats.adabScore}
  * Cleanliness: ${studentData.behaviorStats.cleanlinessScore}
  * Respect: ${studentData.behaviorStats.respectScore}
  * Remarks: ${JSON.stringify(studentData.behaviorStats.recentWarnings || [])}

Generate the final WhatsApp response message now:
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemInstructions + "\n" + userPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3, // Muted temperature for strict factual alignment
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();
    const candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Malformed payload returned from Gemini API.");
    }

    return candidateText.trim();
  } catch (err) {
    console.error("LLM Report Generation Exception:", err);
    // Bulletproof fallback message in case of API failure
    return `Assalamoalaikum Warahmatullahi Wabarakatuh.\n\nThank you for reaching out regarding *${studentData.studentName}*'s progress. Our system is currently experiencing a temporary server update. \n\n*Current Academic Standing:*\n📖 *Current Juz:* ${studentData.hifzStats.currentJuz}\n🕌 *Class Attendance:* ${studentData.attendanceStats.presentCount}/${studentData.attendanceStats.totalCount} days.\n\nOur Ustadh will message you shortly with detailed notes. JazakAllah khair!`;
  }
}
