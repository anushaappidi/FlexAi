import React, { useState } from 'react';
import { UserPreferences, Goal, Difficulty, Equipment } from '../types';
import { Dumbbell, Timer, Activity, Zap, CheckCircle2, FileText, PenTool } from 'lucide-react';

interface Props {
  onSubmit: (prefs: UserPreferences) => void;
  onImport: (text: string) => void;
  isLoading: boolean;
}

const goals: Goal[] = ['Strength', 'Hypertrophy', 'Endurance', 'Weight Loss', 'Flexibility'];
const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const equipmentList: Equipment[] = ['Gym', 'Dumbbells Only', 'Bodyweight', 'Home Gym'];

export const PreferenceForm: React.FC<Props> = ({ onSubmit, onImport, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'import'>('create');
  
  // Generator State
  const [goal, setGoal] = useState<Goal>('Hypertrophy');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [equipment, setEquipment] = useState<Equipment>('Gym');
  const [duration, setDuration] = useState(60);
  const [focusArea, setFocusArea] = useState('Full Body');
  const [notes, setNotes] = useState('');

  // Import State
  const [importText, setImportText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'create') {
        onSubmit({ goal, difficulty, equipment, duration, focusArea, notes });
    } else {
        if (!importText.trim()) return;
        onImport(importText);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-1 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 animate-fade-in flex flex-col">
      {/* Tabs */}
      <div className="flex p-1 gap-1 bg-slate-800 rounded-t-2xl border-b border-slate-700">
        <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'create' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
        >
            <PenTool className="w-4 h-4" />
            Design with AI
        </button>
        <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'import' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
        >
            <FileText className="w-4 h-4" />
            Import from Text
        </button>
      </div>

      <div className="p-6 pt-8">
        {activeTab === 'create' ? (
             <form onSubmit={handleSubmit} className="space-y-8">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-400">Design Your Workout</h2>
                <p className="text-slate-400 text-sm">Tell us what you need, and AI will build the perfect session.</p>
             </div>

             {/* Goal Selection */}
             <div className="space-y-3">
               <label className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                 <Activity className="w-5 h-5 text-emerald-400" />
                 Primary Goal
               </label>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {goals.map((g) => (
                   <button
                     key={g}
                     type="button"
                     onClick={() => setGoal(g)}
                     className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                       goal === g
                         ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                         : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:border-slate-500'
                     }`}
                   >
                     {g}
                   </button>
                 ))}
               </div>
             </div>
     
             {/* Difficulty */}
             <div className="space-y-3">
               <label className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                 <Zap className="w-5 h-5 text-emerald-400" />
                 Difficulty Level
               </label>
               <div className="flex gap-3">
                 {difficulties.map((d) => (
                   <button
                     key={d}
                     type="button"
                     onClick={() => setDifficulty(d)}
                     className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                       difficulty === d
                         ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                         : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:border-slate-500'
                     }`}
                   >
                     {d}
                   </button>
                 ))}
               </div>
             </div>
     
             {/* Equipment & Duration */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                   <Dumbbell className="w-5 h-5 text-emerald-400" />
                   Equipment
                 </label>
                 <select
                   value={equipment}
                   onChange={(e) => setEquipment(e.target.value as Equipment)}
                   className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                 >
                   {equipmentList.map((e) => (
                     <option key={e} value={e}>{e}</option>
                   ))}
                 </select>
               </div>
     
               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                   <Timer className="w-5 h-5 text-emerald-400" />
                   Duration (minutes)
                 </label>
                 <div className="flex items-center gap-4">
                    <input
                     type="range"
                     min="15"
                     max="120"
                     step="5"
                     value={duration}
                     onChange={(e) => setDuration(parseInt(e.target.value))}
                     className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                   />
                   <span className="w-16 text-center text-emerald-400 font-mono text-lg">{duration}m</span>
                 </div>
               </div>
             </div>
     
             {/* Custom Inputs */}
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Focus Area</label>
                 <input
                   type="text"
                   value={focusArea}
                   onChange={(e) => setFocusArea(e.target.value)}
                   placeholder="e.g. Chest & Triceps, Legs, Glutes"
                   className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-600"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Additional Notes (Injuries, specific preferences)</label>
                 <textarea
                   value={notes}
                   onChange={(e) => setNotes(e.target.value)}
                   placeholder="e.g. No jumping due to bad knees, I love deadlifts..."
                   rows={3}
                   className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-600 resize-none"
                 />
               </div>
             </div>
     
             <button
               type="submit"
               disabled={isLoading}
               className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {isLoading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   Generating Plan...
                 </>
               ) : (
                 <>
                   Generate Workout <CheckCircle2 className="w-5 h-5" />
                 </>
               )}
             </button>
           </form>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-400">Import from ChatGPT</h2>
                    <p className="text-slate-400 text-sm">Paste your workout text below. We'll organize it and find video demos for you.</p>
                 </div>
                 
                 <div className="space-y-2">
                     <textarea
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Paste your workout text here (e.g., '1. Bench Press 3x10...')"
                        className="w-full h-80 p-4 bg-slate-900 border border-slate-600 rounded-xl text-slate-200 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-600 resize-none leading-relaxed"
                     />
                 </div>

                 <button
                    type="submit"
                    disabled={isLoading || !importText.trim()}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                    {isLoading ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing Text...
                        </>
                    ) : (
                        <>
                        Convert to Plan <CheckCircle2 className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        )}
      </div>
    </div>
  );
};