import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, StudyMaterial } from "../types";

const API_KEY = "AIzaSyBbhKIZ4OqmoIXdvbLJANkkkaqQ6qdTr8Y";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    flashcards: {
      type: Type.ARRAY,
      description: '5 concise flashcards with a term and a short definition.',
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
        },
        required: ['term', 'definition'],
      },
    },
    definitions: {
      type: Type.ARRAY,
      description: '5-10 important terms with their detailed explanations.',
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['term', 'explanation'],
      },
    },
    important_questions: {
      type: Type.ARRAY,
      description: 'A list of important questions following the specified board exam pattern, with hints for answers.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer_hint: { type: Type.STRING },
        },
        required: ['question', 'answer_hint'],
      },
    },
    chapter_summary: {
      type: Type.STRING,
      description: 'A concise summary of the entire chapter.',
    },
    improvement_tips: {
      type: Type.ARRAY,
      description: 'Actionable tips to improve on the specified weak points. If no weak points are provided, give general study tips for the chapter.',
      items: { type: Type.STRING },
    },
  },
  required: ['flashcards', 'definitions', 'important_questions', 'chapter_summary', 'improvement_tips'],
};


export const generateStudyMaterial = async (
  formState: FormState
): Promise<StudyMaterial> => {
  const { board, 'class': studentClass, subject, chapter, weakPoints } = formState;

  const prompt = `
    You are an expert study assistant for class ${studentClass} ${board} students.
    Your task is to generate comprehensive study material.
    Subject: ${subject}
    Chapter: ${chapter}
    Student's weak points: ${weakPoints || 'None provided'}.

    Generate the following structured study material:
    1. Flashcards: 5 concise cards for quick revision.
    2. Definitions: 5-10 important terms with clear explanations.
    3. Important Questions: 5-7 questions that are typical for the ${board} board exam pattern for class ${studentClass}. Provide a brief hint for the answer.
    4. Chapter Summary: A short, easy-to-understand summary of the key concepts in the chapter.
    5. Improvement Tips: Based on the student's weak points, provide 3-5 actionable tips. If no weak points are mentioned, provide general effective study strategies for this chapter.

    Provide the output in a structured JSON format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text.trim();
    const parsedJson = JSON.parse(text);
    return parsedJson as StudyMaterial;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI failed to generate a valid response. Please try again.");
  }
};