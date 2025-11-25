import React, { useState } from 'react';
import { UserPreferences, WorkoutPlan } from './types';
import { generateInitialWorkout, updateWorkoutPlan, parseWorkoutFromText } from './services/gemini';
import { PreferenceForm } from './components/PreferenceForm';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { ChatInterface } from './components/ChatInterface';
import { Dumbbell, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWorkout = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateInitialWorkout(prefs);
      setWorkoutPlan(plan);
    } catch (err) {
      setError("Failed to generate workout. Please check your API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportWorkout = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await parseWorkoutFromText(text);
      setWorkoutPlan(plan);
    } catch (err) {
      setError("Failed to process your text. Please try again or check the format.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyWorkout = async (message: string) => {
    if (!workoutPlan) return;
    setIsLoading(true);
    try {
      const updatedPlan = await updateWorkoutPlan(workoutPlan, message);
      setWorkoutPlan(updatedPlan);
    } catch (err) {
      setError("Failed to update workout. Please try rephrasing.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setWorkoutPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
              <Dumbbell className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              FlexAI
            </h1>
          </div>
          
          {workoutPlan && (
            <button 
              onClick={resetApp}
              className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              New Workout
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
            <div className="max-w-lg mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center animate-shake">
                {error}
            </div>
        )}

        {!workoutPlan ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <PreferenceForm 
                onSubmit={handleCreateWorkout} 
                onImport={handleImportWorkout}
                isLoading={isLoading} 
            />
          </div>
        ) : (
          <div className="relative">
            <WorkoutDisplay plan={workoutPlan} />
            <ChatInterface onSendMessage={handleModifyWorkout} isProcessing={isLoading} />
          </div>
        )}
      </main>
      
      {/* Footer - Only show on home screen to avoid cluttering workout view */}
      {!workoutPlan && (
        <footer className="py-6 text-center text-slate-600 text-sm">
            <p>© {new Date().getFullYear()} FlexAI. Powered by Google Gemini.</p>
        </footer>
      )}
    </div>
  );
};

export default App;