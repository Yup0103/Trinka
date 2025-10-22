import type { ParaphraseResult } from "../types";

// Mock paraphrase results for demonstration
const mockParaphraseResults: Record<string, ParaphraseResult> = {
  default: {
    formal: "Artificial intelligence represents an essential element of contemporary technological advancement, fundamentally altering human existence and professional activities. A principal advantage of AI lies in its capacity to mechanize routine and tedious operations, thereby liberating human capital for more sophisticated and innovative endeavors. Moreover, AI has contributed substantially to diverse sectors, improving operational effectiveness and output.",
    concise: "AI is crucial to modern technology, changing how we live and work. It automates repetitive tasks, freeing people for complex work. AI enhances efficiency across industries.",
    detailed: "Artificial intelligence (AI) has emerged as an indispensable component within the framework of contemporary technological infrastructure, fundamentally reshaping the paradigms of human existence and professional engagement. One of the most significant advantages offered by AI is its remarkable capability to automate repetitive and mundane operational tasks, thereby emancipating human intellectual resources to focus on more intricate and creative intellectual pursuits. Furthermore, AI has delivered substantial contributions across multiple industrial domains, significantly augmenting operational efficiency and overall productivity levels."
  }
};

// Mock compression results
function generateMockCompression(text: string, targetWordCount: number): string {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const currentWordCount = words.length;

  if (currentWordCount <= targetWordCount) {
    return text; // Already shorter than target
  }

  // Simple mock compression - take first part of the text
  const compressionRatio = targetWordCount / currentWordCount;
  const charsToKeep = Math.floor(text.length * compressionRatio);
  let compressed = text.substring(0, charsToKeep);

  // Try to end at a word boundary
  const lastSpace = compressed.lastIndexOf(' ');
  if (lastSpace > 0) {
    compressed = compressed.substring(0, lastSpace);
  }

  return compressed + '.';
}

export async function paraphraseText(text: string): Promise<ParaphraseResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock results - in a real app, this would vary based on input text
  return mockParaphraseResults.default;
}

export async function compressText(text: string, wordCount: number): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  return generateMockCompression(text, wordCount);
}