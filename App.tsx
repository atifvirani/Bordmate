
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { generateStudyMaterial } from './services/geminiService';
import type { FormState, StudyMaterial } from './types';
import { FORM_OPTIONS } from './constants';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [formState, setFormState] = useState<FormState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('boardMateSession');
      if (savedState) {
        return JSON.parse(savedState);
      }
    }
    return {
      board: FORM_OPTIONS.boards[0],
      class: FORM_OPTIONS.classes[0],
      subject: FORM_OPTIONS.subjects[0],
      chapter: '',
      weakPoints: '',
    };
  });

  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    localStorage.setItem('boardMateSession', JSON.stringify(formState));
  }, [formState]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleGenerate = useCallback(async () => {
    if (!formState.chapter) {
      setError('Please enter a chapter name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setStudyMaterial(null);
    try {
      const material = await generateStudyMaterial(formState);
      setStudyMaterial(material);
    } catch (err: any) {
      setError(`Failed to generate study material. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <InputForm 
            formState={formState}
            setFormState={setFormState}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-8 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <Spinner />}

          {studyMaterial && !isLoading && (
            <div className="mt-8">
              <ResultsDisplay material={studyMaterial} title={`${formState.subject} - ${formState.chapter}`} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
