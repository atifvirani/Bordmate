
import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <i className="fas fa-brain text-2xl text-sky-500"></i>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            BoardMate
            </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="w-12 h-6 rounded-full p-1 bg-slate-200 dark:bg-slate-700 relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Toggle dark mode"
        >
          <span className="sr-only">Toggle Dark Mode</span>
          <div
            id="toggle-switch"
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
              isDarkMode ? 'translate-x-5' : ''
            }`}
          >
            {isDarkMode ? 
              <i className="fas fa-moon text-xs text-slate-700"></i> :
              <i className="fas fa-sun text-xs text-yellow-500"></i>
            }
          </div>
        </button>
      </div>
    </header>
  );
};
