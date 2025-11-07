
export interface FormState {
  board: string;
  class: string;
  subject: string;
  chapter: string;
  weakPoints?: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface Definition {
  term: string;
  explanation: string;
}

export interface Question {
  question: string;
  answer_hint: string;
}

export interface StudyMaterial {
  flashcards: Flashcard[];
  definitions: Definition[];
  important_questions: Question[];
  chapter_summary: string;
  improvement_tips: string[];
}
