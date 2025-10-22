
import React, { useMemo } from 'react';
import type { Suggestion } from '../types';
import { BoldIcon, ItalicIcon, UnderlineIcon } from './icons';

interface EditorProps {
  text: string;
  onTextChange: (newText: string) => void;
  suggestions: Suggestion[];
}

const highlightColors: Record<Suggestion['type'], string> = {
    Spelling: 'bg-red-200/50 border-b-2 border-red-400',
    Grammar: 'bg-blue-200/50 border-b-2 border-blue-400',
    Style: 'bg-purple-200/50 border-b-2 border-purple-400',
    Clarity: 'bg-green-200/50 border-b-2 border-green-400',
};

export const Editor = ({ text, onTextChange, suggestions }: EditorProps): React.ReactElement => {
    
    const highlightedContent = useMemo(() => {
        if (suggestions.length === 0) {
            return <>{text}</>;
        }

        const sortedSuggestions = [...suggestions].sort((a, b) => a.startIndex - b.startIndex);
        
        let lastIndex = 0;
        const parts = [];

        sortedSuggestions.forEach(suggestion => {
            if (suggestion.startIndex > lastIndex) {
                parts.push(text.slice(lastIndex, suggestion.startIndex));
            }
            parts.push(
                <span key={suggestion.id} className={`rounded-sm px-0.5 ${highlightColors[suggestion.type]}`}>
                    {text.slice(suggestion.startIndex, suggestion.endIndex)}
                </span>
            );
            lastIndex = suggestion.endIndex;
        });

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return <>{parts}</>;
    }, [text, suggestions]);

    return (
        <div className="flex flex-col flex-1">
            {/* Simplified Toolbar */}
            <div className="flex items-center p-2 space-x-2 border-b border-gray-200 bg-gray-50">
                <button className="p-2 rounded hover:bg-gray-200"><BoldIcon /></button>
                <button className="p-2 rounded hover:bg-gray-200"><ItalicIcon /></button>
                <button className="p-2 rounded hover:bg-gray-200"><UnderlineIcon /></button>
            </div>
            
            <div 
                className="flex-1 p-6 text-lg leading-relaxed text-gray-700 whitespace-pre-wrap outline-none"
                contentEditable
                onInput={(e) => onTextChange(e.currentTarget.innerText)}
                suppressContentEditableWarning
            >
                {highlightedContent}
            </div>
        </div>
    );
};
