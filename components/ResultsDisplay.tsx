
import React, { useState, useRef } from 'react';
import type { StudyMaterial } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsDisplayProps {
  material: StudyMaterial;
  title: string;
}

type Tab = 'flashcards' | 'definitions' | 'questions' | 'summary' | 'tips';

const TAB_CONFIG = {
  flashcards: { label: 'Flashcards', icon: 'fa-clone' },
  definitions: { label: 'Definitions', icon: 'fa-book' },
  questions: { label: 'Questions', icon: 'fa-question-circle' },
  summary: { label: 'Summary', icon: 'fa-file-alt' },
  tips: { label: 'Tips', icon: 'fa-lightbulb' },
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ material, title }) => {
  const [activeTab, setActiveTab] = useState<Tab>('flashcards');
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const contentToPrint = pdfRef.current;
    if (!contentToPrint) return;

    setIsDownloading(true);

    try {
        const canvas = await html2canvas(contentToPrint, { 
            scale: 2, 
            backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
            onclone: (document) => {
              // Ensure styles for dark mode are applied correctly on the cloned document
              if (document.documentElement.classList.contains('dark')) {
                const clonedContent = document.getElementById('pdf-content');
                if (clonedContent) {
                  clonedContent.querySelectorAll('.pdf-section').forEach(el => {
                    el.classList.add('dark');
                  });
                }
              }
            }
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgHeight = pdfWidth / ratio;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}_notes.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        setIsDownloading(false);
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'flashcards':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {material.flashcards.map((fc, i) => (
              <div key={i} className="bg-sky-100 dark:bg-sky-900/50 p-4 rounded-lg shadow-sm border border-sky-200 dark:border-sky-800">
                <h4 className="font-bold text-sky-800 dark:text-sky-300">{fc.term}</h4>
                <p className="text-sm mt-1">{fc.definition}</p>
              </div>
            ))}
          </div>
        );
      case 'definitions':
        return (
          <ul className="space-y-4">
            {material.definitions.map((def, i) => (
              <li key={i} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{def.term}</h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{def.explanation}</p>
              </li>
            ))}
          </ul>
        );
      case 'questions':
        return (
          <ul className="space-y-4">
            {material.important_questions.map((q, i) => (
              <li key={i} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{i + 1}. {q.question}</p>
                <p className="text-sm mt-2 text-slate-500 dark:text-slate-400 italic"><strong>Hint:</strong> {q.answer_hint}</p>
              </li>
            ))}
          </ul>
        );
      case 'summary':
        return (
          <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
            <p>{material.chapter_summary}</p>
          </div>
        );
      case 'tips':
        return (
          <ul className="space-y-3 list-disc list-inside">
            {material.improvement_tips.map((tip, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-300">{tip}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  const renderPdfContent = () => (
     <div id="pdf-content" ref={pdfRef} className="bg-white dark:bg-slate-800 p-8">
      <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h1>
      
      <div className="pdf-section dark:bg-slate-800">
        <h2 className="text-2xl font-semibold mt-6 mb-3 border-b-2 border-sky-500 pb-2 text-slate-800 dark:text-slate-100">Flashcards</h2>
        {material.flashcards.map((fc, i) => (
          <div key={`pdf-fc-${i}`} className="mb-2 p-2 border-l-4 border-sky-300 bg-sky-50 dark:bg-sky-900/30 dark:border-sky-700">
            <p className="font-bold text-slate-800 dark:text-slate-200">{fc.term}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{fc.definition}</p>
          </div>
        ))}
      </div>
      
      <div className="pdf-section dark:bg-slate-800">
        <h2 className="text-2xl font-semibold mt-6 mb-3 border-b-2 border-sky-500 pb-2 text-slate-800 dark:text-slate-100">Definitions</h2>
        {material.definitions.map((def, i) => (
          <div key={`pdf-def-${i}`} className="mb-2">
            <p className="font-bold text-slate-800 dark:text-slate-200">{def.term}</p>
            <p className="text-slate-700 dark:text-slate-300">{def.explanation}</p>
          </div>
        ))}
      </div>

      <div className="pdf-section dark:bg-slate-800">
        <h2 className="text-2xl font-semibold mt-6 mb-3 border-b-2 border-sky-500 pb-2 text-slate-800 dark:text-slate-100">Important Questions</h2>
        {material.important_questions.map((q, i) => (
          <div key={`pdf-q-${i}`} className="mb-2">
            <p className="font-semibold text-slate-800 dark:text-slate-200">{i + 1}. {q.question}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">Hint: {q.answer_hint}</p>
          </div>
        ))}
      </div>

      <div className="pdf-section dark:bg-slate-800">
        <h2 className="text-2xl font-semibold mt-6 mb-3 border-b-2 border-sky-500 pb-2 text-slate-800 dark:text-slate-100">Chapter Summary</h2>
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{material.chapter_summary}</p>
      </div>

      <div className="pdf-section dark:bg-slate-800">
        <h2 className="text-2xl font-semibold mt-6 mb-3 border-b-2 border-sky-500 pb-2 text-slate-800 dark:text-slate-100">Improvement Tips</h2>
        <ul className="list-disc list-inside">
          {material.improvement_tips.map((tip, i) => (
            <li key={`pdf-tip-${i}`} className="text-slate-700 dark:text-slate-300">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );


  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Study Material</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        </div>
        <button 
          onClick={handleDownloadPdf} 
          disabled={isDownloading}
          className="mt-3 sm:mt-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {isDownloading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-download"></i>}
          {isDownloading ? 'Downloading...' : 'Download as PDF'}
        </button>
      </div>
      
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {Object.entries(TAB_CONFIG).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as Tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            <i className={`fas ${icon}`}></i>
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {renderContent()}
      </div>

      {/* Hidden div for PDF generation */}
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
        {renderPdfContent()}
      </div>
    </div>
  );
};
