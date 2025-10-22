import React from 'react';
import type { Suggestion } from '../types';
import { CopyIcon } from './icons';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAccept: () => void;
  onDismiss: () => void;
}

// FIX: Explicitly type the component with React.FC to resolve issues with special React props like 'key'.
export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onAccept, onDismiss }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          <span>{suggestion.category}</span>
        </div>
        <div className="mt-2 text-base">
          <p className="text-gray-500">
            ...has made <span className="text-red-600 line-through">{suggestion.original}</span> <span className="text-green-600 font-semibold">{suggestion.suggestion}</span> Artifici...
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600">{suggestion.explanation}</p>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
            <button 
                onClick={onAccept}
                className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
                Accept
            </button>
            <button
                onClick={onDismiss}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
                Dismiss
            </button>
        </div>
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200">
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
