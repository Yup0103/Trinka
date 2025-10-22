export interface Suggestion {
  id: number;
  type: 'Spelling' | 'Style' | 'Clarity' | 'Grammar';
  category: string;
  original: string;
  suggestion: string;
  context: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
}

export interface ParaphraseResult {
  formal: string;
  concise: string;
  detailed: string;
}

export type ActiveSidebarTab = 'grammar' | 'paraphraser' | 'checks' | 'citations' | 'readiness';

export interface ReadinessDimension {
  name: 'Formatting' | 'Language' | 'Citations' | 'Plagiarism/AI' | 'Compliance';
  score: number;
  details: string;
}

export interface PlagiarismResult {
  similarityScore: number;
  aiContentScore: number;
  sources: {
    url: string;
    percentage: number;
  }[];
}


// New types for the Chatbot UI
export type MessageSender = 'user' | 'bot';

export type MessageContent = 
  | { type: 'text'; text: string }
  | { type: 'loading'; text: string }
  | { type: 'action-cards' }
  | { type: 'grammar-results'; suggestions: Suggestion[] }
  | { type: 'paraphrase-results'; result: ParaphraseResult; error: string | null }
  | { type: 'compress-results'; result: string | null; error: string | null; target: number }
  | { type: 'readiness-results'; scores: ReadinessDimension[] }
  | { type: 'plagiarism-results'; result: PlagiarismResult };


export interface ChatMessage {
  id: number;
  sender: MessageSender;
  content: MessageContent;
}