import React, { useState, useCallback, useEffect } from 'react';
import { Editor } from './components/Editor';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import type { Suggestion, ParaphraseResult, ReadinessDimension, PlagiarismResult, ChatMessage } from './types';
import { initialText, mockSuggestions, mockReadiness, mockPlagiarism } from './constants';
import { paraphraseText, compressText } from './services/geminiService';


export default function App(): React.ReactElement {
  const [text, setText] = useState<string>(initialText);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  
  // AI Assistant Panel State
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(true); // Open by default for demo
  
  // Paraphraser state
  const [paraphraseResult, setParaphraseResult] = useState<ParaphraseResult | null>(null);
  const [isParaphrasing, setIsParaphrasing] = useState<boolean>(false);
  const [paraphraseError, setParaphraseError] = useState<string | null>(null);

  // Compressor state
  const [compressedTextResult, setCompressedTextResult] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressError, setCompressError] = useState<string | null>(null);

  // New feature states
  const [readinessScores] = useState<ReadinessDimension[]>(mockReadiness);
  const [plagiarismResult] = useState<PlagiarismResult>(mockPlagiarism);
  
  const handleAcceptSuggestion = useCallback((suggestionId: number) => {
    const suggestionToApply = suggestions.find(s => s.id === suggestionId);
    if (!suggestionToApply) return;

    const { startIndex, endIndex, suggestion, original } = suggestionToApply;
    
    const newText = text.slice(0, startIndex) + suggestion + text.slice(endIndex);
    setText(newText);

    const lengthDifference = suggestion.length - original.length;
    
    const updatedSuggestions = suggestions
      .filter(s => s.id !== suggestionId)
      .map(s => {
        if (s.startIndex > startIndex) {
          return {
            ...s,
            startIndex: s.startIndex + lengthDifference,
            endIndex: s.endIndex + lengthDifference,
          };
        }
        return s;
      });
    
    setSuggestions(updatedSuggestions);
  }, [text, suggestions]);

  const handleDismissSuggestion = useCallback((suggestionId: number) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  const handleParaphrase = useCallback(async () => {
    setIsParaphrasing(true);
    setParaphraseError(null);
    setParaphraseResult(null);
    try {
      const result = await paraphraseText(text);
      setParaphraseResult(result);
    } catch (error) {
      console.error("Paraphrasing failed:", error);
      setParaphraseError("Failed to paraphrase. Please try again.");
    } finally {
      setIsParaphrasing(false);
    }
  }, [text]);

  const handleCompress = useCallback(async (targetWordCount: number) => {
    setIsCompressing(true);
    setCompressError(null);
    setCompressedTextResult(null);
    try {
      const result = await compressText(text, targetWordCount);
      setCompressedTextResult(result);
    } catch (error) {
      console.error("Compression failed:", error);
      setCompressError("Failed to compress text. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  }, [text]);


  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-gray-800 bg-gray-50 overflow-hidden">
      <Header onToggleAssistant={() => setIsAssistantOpen(prev => !prev)} />
      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col">
            <Editor text={text} onTextChange={setText} suggestions={suggestions} />
            <Footer wordCount={wordCount} />
          </div>
        </div>
        <AiAssistantPanel
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          suggestions={suggestions}
          onAcceptSuggestion={handleAcceptSuggestion}
          onDismissSuggestion={handleDismissSuggestion}
          // Paraphraser props
          onParaphrase={handleParaphrase}
          paraphraseResult={paraphraseResult}
          isParaphrasing={isParaphrasing}
          paraphraseError={paraphraseError}
          // Compressor props
          onCompress={handleCompress}
          compressedTextResult={compressedTextResult}
          isCompressing={isCompressing}
          compressError={compressError}
          // New feature props
          readinessScores={readinessScores}
          plagiarismResult={plagiarismResult}
        />
      </main>
    </div>
  );
}