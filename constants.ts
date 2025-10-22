import type { Suggestion, ReadinessDimension, PlagiarismResult } from './types';

export const initialText = `Artificial intelligence (AI) has become a vital component of modern technology, transforming the way we live and work. One of the primary benefits of AI is its ability to automate repetitive and mundane tasks, freeing up human resources for more complex and creative work. Additionally, AI has made significa Artificial intelligence (AI) has become a vital component of modern technology, transforming the way we live and work. One of the primary benefits of AI is its ability to automate repetitive and complex and creative work. Furthermore, AI has made significant contributions to various industries, enhancing efficiency and productivity.nt advancements in machine learning and natural language processing, enabling machines to learn from data and interact with humans in a more intuitive and user-friendly manner. Furthermore, AI has the potential to revolutionize various industries, including healthcare, finance, and transportation, by providing accurate diagnoses, personalized recommendations, and optimized routes. Overall, the impact of AI on society is profound, and its continued development and integration will likely have a lasting impact on the world.`;

export const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    type: 'Style',
    category: 'Use a uniform English spelling style',
    original: 'revolutionize',
    suggestion: 'revolutionise',
    context: '...has the potential to revolutionize various industries, including...',
    explanation: 'Maintain a consistent spelling style throughout your document.',
    startIndex: 627,
    endIndex: 640,
  },
  {
    id: 2,
    type: 'Spelling',
    category: 'Spelling',
    original: 'significa',
    suggestion: 'significant',
    context: '...AI has made significa Artificial intelligence...',
    explanation: 'This word is not in our dictionary. If it is a valid word, please add it to your dictionary.',
    startIndex: 282,
    endIndex: 291,
  },
  {
    id: 3,
    type: 'Clarity',
    category: 'Conciseness',
    original: 'has the potential to',
    suggestion: 'can',
    context: '...Furthermore, AI has the potential to revolutionize various...',
    explanation: 'This phrase can be shortened for better clarity and conciseness.',
    startIndex: 608,
    endIndex: 627,
  },
    {
    id: 4,
    type: 'Grammar',
    category: 'Punctuation',
    original: 'productivity.nt',
    suggestion: 'productivity. nt',
    context: '...efficiency and productivity.nt advancements in machine...',
    explanation: 'It seems there is a missing space after the period.',
    startIndex: 489,
    endIndex: 503,
  }
];

export const mockReadiness: ReadinessDimension[] = [
    { name: 'Formatting', score: 95, details: 'Journal template applied.' },
    { name: 'Language', score: 82, details: '5 alerts remaining.' },
    { name: 'Citations', score: 70, details: 'Diversity could be improved.' },
    { name: 'Plagiarism/AI', score: 88, details: 'Low risk detected.' },
    { name: 'Compliance', score: 100, details: 'All checks passed.' },
];

export const mockPlagiarism: PlagiarismResult = {
    similarityScore: 8,
    aiContentScore: 12,
    sources: [
        { url: 'https://example.com/source1', percentage: 4 },
        { url: 'https://example.com/source2', percentage: 3 },
    ],
};