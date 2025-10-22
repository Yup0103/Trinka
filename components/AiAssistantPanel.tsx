import React, { useState, useEffect, useRef } from 'react';
import type { Suggestion, ParaphraseResult, ReadinessDimension, PlagiarismResult, ChatMessage } from '../types';
import { SuggestionCard } from './SuggestionCard';
import { SparklesIcon, DismissIcon, GrammarIcon, SearchIcon, QuoteIcon, GaugeIcon, CopyIcon, ChartBarIcon, MicIcon, SendIcon } from './icons';

interface AiAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: Suggestion[];
  onAcceptSuggestion: (id: number) => void;
  onDismissSuggestion: (id: number) => void;
  onParaphrase: () => void;
  paraphraseResult: ParaphraseResult | null;
  isParaphrasing: boolean;
  paraphraseError: string | null;
  onCompress: (target: number) => void;
  compressedTextResult: string | null;
  isCompressing: boolean;
  compressError: string | null;
  readinessScores: ReadinessDimension[];
  plagiarismResult: PlagiarismResult;
}

const initialMessage: ChatMessage = {
  id: 0,
  sender: 'bot',
  content: { type: 'action-cards' },
};

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = (props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [nextId, setNextId] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [userInput]);

  // Effect to handle paraphrasing results
  useEffect(() => {
    if (!props.isParaphrasing && (props.paraphraseResult || props.paraphraseError)) {
      setMessages(prev => prev.map(msg => 
        msg.content.type === 'loading' && msg.content.text.includes('paraphrase')
        ? { ...msg, content: { type: 'paraphrase-results', result: props.paraphraseResult!, error: props.paraphraseError } }
        : msg
      ));
    }
  }, [props.isParaphrasing, props.paraphraseResult, props.paraphraseError]);

  // Effect to handle compression results
  useEffect(() => {
    if (!props.isCompressing && (props.compressedTextResult || props.compressError)) {
      setMessages(prev => prev.map(msg => 
        msg.content.type === 'loading' && msg.content.text.includes('Compressing')
        ? { ...msg, content: { type: 'compress-results', result: props.compressedTextResult, error: props.compressError, target: 0 } } // Target is not needed for display
        : msg
      ));
    }
  }, [props.isCompressing, props.compressedTextResult, props.compressError]);


  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: nextId }]);
    setNextId(prev => prev + 1);
  };
  
  const addLoadingMessage = (text: string) => {
    const loadingMessage = {
      id: nextId,
      sender: 'bot' as const,
      content: { type: 'loading' as const, text }
    };
    setMessages(prev => [...prev, loadingMessage]);
    setNextId(prev => prev + 1);
  };

  const handleActionClick = (action: string, userText: string) => {
    addMessage({ sender: 'user', content: { type: 'text', text: userText } });

    switch(action) {
      case 'grammar':
        addMessage({ sender: 'bot', content: { type: 'grammar-results', suggestions: props.suggestions } });
        break;
      case 'paraphrase':
        props.onParaphrase();
        addLoadingMessage('Generating paraphrase variations...');
        break;
      case 'compress':
        const target = 100; // Hardcoded for demo
        props.onCompress(target);
        addLoadingMessage(`Compressing text to ~${target} words...`);
        break;
      case 'readiness':
         addMessage({ sender: 'bot', content: { type: 'readiness-results', scores: props.readinessScores } });
        break;
      case 'plagiarism':
         addMessage({ sender: 'bot', content: { type: 'plagiarism-results', result: props.plagiarismResult } });
        break;
      case 'citations':
        addMessage({ sender: 'bot', content: { type: 'text', text: "Sure, I can help improve your citations. Please provide the DOI or abstract, and I can suggest different phrasing styles." } });
        break;
      case 'figure':
        addMessage({ sender: 'bot', content: { type: 'text', text: "To generate a figure, please upload your data (e.g., CSV, Excel), and I'll suggest the best visualization for it." } });
        break;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addMessage({ sender: 'user', content: { type: 'text', text: userInput.trim() } });
    
    // Static canned response for demo
    setTimeout(() => {
        addMessage({ sender: 'bot', content: { type: 'text', text: "Thank you for your query. This is a static demo. For full functionality, please use the action cards above!" } });
    }, 500);

    setUserInput('');
    setIsListening(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      // Simulate stopping recording and transcribing text
      setUserInput("How can I improve the introduction section of my paper?");
    }
    setIsListening(prev => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e as any);
    }
  };

  const ActionCards = () => (
    <div className="grid grid-cols-2 gap-3">
        <ActionCard icon={<GrammarIcon />} title="Check Grammar & Style" onClick={() => handleActionClick('grammar', 'Check grammar and style')} />
        <ActionCard icon={<SparklesIcon />} title="Rewrite & Paraphrase" onClick={() => handleActionClick('paraphrase', 'Rewrite & paraphrase the text')} />
        <ActionCard icon={<GaugeIcon />} title="Check Submission Readiness" onClick={() => handleActionClick('readiness', 'Check submission readiness')} />
        <ActionCard icon={<SearchIcon />} title="Check Plagiarism & AI" onClick={() => handleActionClick('plagiarism', 'Check for plagiarism and AI content')} />
        <ActionCard icon={<QuoteIcon />} title="Improve Citations" onClick={() => handleActionClick('citations', 'Improve my citations')} />
        <ActionCard icon={<ChartBarIcon />} title="Generate Figure from Data" onClick={() => handleActionClick('figure', 'Generate a figure from my data')} />
    </div>
  );

  const renderMessageContent = (message: ChatMessage) => {
    switch (message.content.type) {
      case 'text':
        return <p>{message.content.text}</p>;
      case 'loading':
        return <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
            <span>{message.content.text}</span>
        </div>
      case 'action-cards':
        return <div>
            <p className="font-semibold mb-3">Hi! I'm Trinka, your AI assistant. How can I help you today?</p>
            <ActionCards />
        </div>;
      case 'grammar-results':
        return <div className="space-y-3">
            <h3 className="font-semibold">Here are your grammar & style suggestions:</h3>
            {message.content.suggestions.length > 0 ? (
                 message.content.suggestions.map(s => <SuggestionCard key={s.id} suggestion={s} onAccept={() => props.onAcceptSuggestion(s.id)} onDismiss={() => props.onDismissSuggestion(s.id)} />)
            ) : <p className="text-gray-500">No suggestions found. Looks good!</p>}
        </div>;
      case 'paraphrase-results':
        const {result, error} = message.content;
        return <div className="space-y-3">
             <h3 className="font-semibold">Here are some rewriting variations:</h3>
             {error && <p className="text-red-500">{error}</p>}
             {result && <>
                <ParaphraseResultDisplay title="Formal" text={result.formal} />
                <ParaphraseResultDisplay title="Concise" text={result.concise} />
                <ParaphraseResultDisplay title="Detailed" text={result.detailed} />
             </>}
        </div>;
      case 'compress-results':
        return <div className="space-y-3">
             <h3 className="font-semibold">Here is the compressed version:</h3>
             {message.content.error && <p className="text-red-500">{message.content.error}</p>}
             {message.content.result && <ParaphraseResultDisplay title="Compressed Text" text={message.content.result} />}
        </div>
      case 'readiness-results':
        return <ReadinessPanel scores={message.content.scores} />;
       case 'plagiarism-results':
        return <PlagiarismPanel result={message.content.result} />;
      default:
        return null;
    }
  };

  return (
    <aside className={`absolute top-0 right-0 h-full w-[420px] bg-white border-l border-gray-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-30 ${props.isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">Trinka AI Assistant</h2>
        </div>
        <button onClick={props.onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200"><DismissIcon /></button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Trinka AI anything..."
            className="w-full p-3 pr-24 text-base bg-gray-100 border border-gray-300 rounded-lg resize-none focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow overflow-y-hidden"
            rows={1}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 text-gray-600'}`}
              aria-label={isListening ? 'Stop recording' : 'Start recording'}
            >
              <MicIcon className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="p-2 ml-1 rounded-full bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};

// Sub-components for chat results
const ActionCard = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
    <button onClick={onClick} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all text-left flex items-start space-x-3">
        <div className="text-purple-600 mt-1">{icon}</div>
        <span className="font-semibold text-sm text-gray-700">{title}</span>
    </button>
);

const ParaphraseResultDisplay = ({ title, text }: { title: string, text: string }) => (
    <div>
        <h4 className="font-semibold text-gray-700 text-sm">{title}</h4>
        <div className="mt-1 p-3 text-sm bg-gray-100 rounded-md border border-gray-200 relative group">
            <p>{text}</p>
            <button onClick={() => navigator.clipboard.writeText(text)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Copy text">
                <CopyIcon className="w-4 h-4"/>
            </button>
        </div>
    </div>
);

const ReadinessPanel = ({ scores }: { scores: ReadinessDimension[]}) => {
    const overallScore = Math.round(scores.reduce((acc, dim) => acc + dim.score, 0) / scores.length);
    const getScoreColor = (score: number) => score > 85 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div>
            <h3 className="font-semibold mb-3">Here is your Submission Readiness score:</h3>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                 <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
                 <div className="text-md font-semibold text-gray-700">Overall Score</div>
            </div>
            <div className="mt-4 space-y-3">
                {scores.map(dim => (
                    <div key={dim.name}>
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                            <span>{dim.name}</span>
                            <span className={getScoreColor(dim.score)}>{dim.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className={`h-1.5 rounded-full ${getScoreColor(dim.score).replace('text-', 'bg-')}`} style={{ width: `${dim.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PlagiarismPanel = ({ result }: { result: PlagiarismResult }) => {
    const ScoreDisplay = ({ score, label, colorClass }: { score: number, label: string, colorClass: string }) => (
        <div className="text-center p-3 bg-gray-50 rounded-lg flex-1">
            <div className={`text-2xl font-bold ${colorClass}`}>{score}%</div>
            <div className="text-xs text-gray-600 mt-1">{label}</div>
        </div>
    );
    return (
        <div>
             <h3 className="font-semibold mb-3">Here are the Plagiarism & AI check results:</h3>
             <div className="flex gap-3">
                 <ScoreDisplay score={result.similarityScore} label="Similarity" colorClass="text-orange-500" />
                 <ScoreDisplay score={result.aiContentScore} label="AI Content" colorClass="text-blue-500" />
             </div>
        </div>
    );
};