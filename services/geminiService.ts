import { GoogleGenAI, Type } from "@google/genai";
import type { ParaphraseResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function paraphraseText(text: string): Promise<ParaphraseResult> {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const prompt = `
    Paraphrase the following academic text. Provide three distinct variations:
    1.  **Formal**: A version that is more academic and formal in tone.
    2.  **Concise**: A version that reduces the word count while preserving the core meaning.
    3.  **Detailed**: A version that elaborates on the points for greater clarity.

    Text to paraphrase:
    "${text}"

    Return the result as a single JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formal: { type: Type.STRING },
            concise: { type: Type.STRING },
            detailed: { type: Type.STRING },
          },
          required: ["formal", "concise", "detailed"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as ParaphraseResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get paraphrasing suggestions from the AI model.");
  }
}

export async function compressText(text: string, wordCount: number): Promise<string> {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const prompt = `
    Compress the following academic text to be as close as possible to ${wordCount} words.
    Preserve the core meaning, key findings, and formal tone.

    Text to compress:
    "${text}"

    Return only the compressed text, with no extra formatting or commentary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for compression:", error);
    throw new Error("Failed to get compressed text from the AI model.");
  }
}