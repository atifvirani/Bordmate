
import React from 'react';
import type { FormState } from '../types';
import { FORM_OPTIONS } from '../constants';

interface InputFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ formState, setFormState, onGenerate, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-700 dark:text-slate-100">Smart Study Assistant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label htmlFor="board" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Board</label>
          <select id="board" name="board" value={formState.board} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500">
            {FORM_OPTIONS.boards.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Class</label>
          <select id="class" name="class" value={formState.class} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500">
            {FORM_OPTIONS.classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Subject</label>
          <select id="subject" name="subject" value={formState.subject} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500">
            {FORM_OPTIONS.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="chapter" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Chapter Name</label>
        <input type="text" id="chapter" name="chapter" value={formState.chapter} onChange={handleChange} placeholder="e.g., The Laws of Motion" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500" />
      </div>
      
      <div className="mb-6">
        <label htmlFor="weakPoints" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Weak Points (Optional)</label>
        <textarea id="weakPoints" name="weakPoints" value={formState.weakPoints} onChange={handleChange} rows={3} placeholder="e.g., I have trouble with numerical problems and derivations." className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500"></textarea>
      </div>

      <button onClick={onGenerate} disabled={isLoading} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <i className="fas fa-magic"></i>
            Generate Study Material
          </>
        )}
      </button>
    </div>
  );
};
