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
    instructions: { type: Type.STRING, description: "Concise step-by-step instructions on how to perform the exercise." },
    videoSearchTerm: { type: Type.STRING, description: "Specific search term for YouTube to find a demonstration (e.g. 'Barbell Squat Form')." },
  },
  required: ["id", "name", "sets", "reps", "rest", "notes", "muscleGroup", "instructions", "videoSearchTerm"],
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
    Include concise instructions for each exercise and a specific search term to find a video demonstration on YouTube.
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

export const parseWorkoutFromText = async (text: string): Promise<WorkoutPlan> => {
  const prompt = `
    The user has pasted a workout routine (raw text format). Your goal is to convert this unstructured text into a structured JSON WorkoutPlan.

    Input Text:
    """
    ${text}
    """

    Instructions:
    1. Parse the text to extract the workout structure (exercises, sets, reps).
    2. Map the content to the required JSON schema.
    3. CRITICAL: For EVERY exercise identified, you MUST generate:
       - 'instructions': A clear, brief description of how to perform the movement correctly. If the text provides cues, incorporate them. If not, generate standard professional form instructions.
       - 'videoSearchTerm': A specific string to search YouTube for a high-quality demonstration (e.g., "Dumbbell Floor Press Form").
    4. Infer sets, reps, and rest if implied or standard defaults if missing.
    5. If there is a warm-up section, include those as exercises but note them as "Warm-up" in the notes or muscle group field.
    6. Generate a title and description based on the content if not explicitly stated.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutSchema,
        systemInstruction: "You are an intelligent fitness assistant that parses workout text into structured data. You are an expert at explaining exercise form.",
      },
    });

    const result = response.text;
    if (!result) throw new Error("No response from AI");
    return JSON.parse(result) as WorkoutPlan;
  } catch (error) {
    console.error("Gemini parsing error:", error);
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
    If the user asks to swap an exercise, provide a suitable alternative with new instructions and video search term.
    If the user says it's too hard, reduce volume or complexity.
    Ensure every exercise has 'instructions' and 'videoSearchTerm'.
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