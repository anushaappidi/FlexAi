import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, WorkoutPlan } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the workout plan to ensure consistent UI rendering
const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Unique identifier for the exercise" },
    name: { type: Type.STRING, description: "Name of the exercise" },
    sets: { type: Type.STRING, description: "Number of sets, e.g., '3' or '3-4'" },
    reps: { type: Type.STRING, description: "Rep range, e.g., '8-12' or 'AMRAP'" },
    rest: { type: Type.STRING, description: "Rest period, e.g., '60s' or '90s'" },
    notes: { type: Type.STRING, description: "Form cues or tempo instructions" },
    muscleGroup: { type: Type.STRING, description: "Primary muscle worked" },
  },
  required: ["id", "name", "sets", "reps", "rest", "notes", "muscleGroup"],
};

const workoutSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy title for the workout" },
    description: { type: Type.STRING, description: "Brief overview of the session focus" },
    totalDuration: { type: Type.STRING, description: "Estimated total time" },
    difficulty: { type: Type.STRING },
    exercises: {
      type: Type.ARRAY,
      items: exerciseSchema,
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 key tips for this specific workout",
    },
  },
  required: ["title", "description", "totalDuration", "difficulty", "exercises", "tips"],
};

export const generateInitialWorkout = async (prefs: UserPreferences): Promise<WorkoutPlan> => {
  const prompt = `
    Create a detailed workout plan based on the following preferences:
    - Goal: ${prefs.goal}
    - Level: ${prefs.difficulty}
    - Equipment: ${prefs.equipment}
    - Duration: ${prefs.duration} minutes
    - Focus Area: ${prefs.focusArea}
    - Additional Notes: ${prefs.notes || "None"}

    Ensure the workout fits the time constraint. Be specific with sets and reps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutSchema,
        systemInstruction: "You are an elite fitness coach specializing in evidence-based programming.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};

export const updateWorkoutPlan = async (currentPlan: WorkoutPlan, instruction: string): Promise<WorkoutPlan> => {
  const prompt = `
    Here is the current workout plan JSON:
    ${JSON.stringify(currentPlan)}

    The user wants to modify this plan with the following instruction:
    "${instruction}"

    Please update the JSON structure to reflect these changes. 
    Maintain the overall structure and ensure the workout remains balanced if possible.
    If the user asks to swap an exercise, provide a suitable alternative.
    If the user says it's too hard, reduce volume or complexity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutSchema,
        systemInstruction: "You are a helpful fitness assistant. You modify existing workout plans based on user feedback.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Gemini modification error:", error);
    throw error;
  }
};
