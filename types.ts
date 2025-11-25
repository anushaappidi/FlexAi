export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Goal = 'Strength' | 'Hypertrophy' | 'Endurance' | 'Weight Loss' | 'Flexibility';
export type Equipment = 'Gym' | 'Dumbbells Only' | 'Bodyweight' | 'Home Gym';

export interface UserPreferences {
  goal: Goal;
  difficulty: Difficulty;
  equipment: Equipment;
  duration: number; // in minutes
  focusArea: string; // e.g., "Legs", "Full Body", "Push"
  notes: string; // Additional context like injuries
}

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
  muscleGroup: string;
}

export interface WorkoutPlan {
  title: string;
  description: string;
  totalDuration: string;
  difficulty: string;
  exercises: Exercise[];
  tips: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
