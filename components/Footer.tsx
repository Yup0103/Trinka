import React, { useState } from 'react';
import { MicIcon } from './icons';

interface FooterProps {
  wordCount: number;
}

export const Footer = ({ wordCount }: FooterProps): React.ReactElement => {
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    // In a real app, this would start/stop voice recognition
    setIsListening(prev => !prev);
  };

  return (
    <div className="flex items-center justify-between p-2 text-sm text-gray-500 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <div className="flex items-center space-x-4">
        <span>Word Count: {wordCount}</span>
        <button
          onClick={handleMicClick}
          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 text-gray-600'}`}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
          <MicIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <span>Type '/' for AI commands</span>
        <div className="w-px h-4 bg-gray-300"></div>
        <span>Saved</span>
      </div>
    </div>
  );
};