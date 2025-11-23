import { GoogleGenAI } from "@google/genai";
import { GrandTest, SubjectScore } from "../types";
import { SUBJECTS } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzePerformance = async (tests: GrandTest[]): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API Key is missing. Please configure the environment to use AI features.";
  }

  // Prepare a summary of the latest test
  const latestTest = tests[tests.length - 1];
  if (!latestTest) return "No test data available for analysis.";

  const scoresSummary = Object.values(latestTest.scores).map((s: SubjectScore) => {
    const subject = SUBJECTS.find(sub => sub.id === s.subjectId);
    return `${subject?.name} (${subject?.category}): ${s.percentage}%`;
  }).join('\n');

  const prompt = `
    You are an expert MBBS study coach. Analyze the following subject-wise performance for a student's latest Grand Test (${latestTest.name}).
    
    The subjects are categorized as:
    - Rank Building (Basics)
    - Rank Maintaining (Clinical Core)
    - Rank Deciding (Short Subjects)
    
    Performance Data:
    ${scoresSummary}
    
    Color Code Reference:
    0-50%: Red (Weak)
    50-80%: Yellow (Average)
    80-100%: Green (Strong)
    
    Provide a concise analysis:
    1. Identify the critical "Red" zone subjects that are dragging the rank down.
    2. Suggest specific focus areas based on the categories (e.g., if Rank Building is weak, emphasize basic sciences).
    3. Give a short motivational action plan for the next test.
    
    Keep the tone professional, encouraging, and strategic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "An error occurred while communicating with the AI service.";
  }
};
