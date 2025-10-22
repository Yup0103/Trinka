
import React from 'react';
import { SparklesIcon } from './icons';

interface HeaderProps {
    onToggleAssistant: () => void;
}

export const Header = ({ onToggleAssistant }: HeaderProps): React.ReactElement => {
  return (
    <header className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-purple-700">TRINKA</span>
        </div>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-800">Untitled</h1>
            <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span>EN (UK), Academic</span>
                <span className="cursor-pointer hover:text-purple-600">Download</span>
            </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleAssistant}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>Trinka AI</span>
        </button>
      </div>
    </header>
  );
};