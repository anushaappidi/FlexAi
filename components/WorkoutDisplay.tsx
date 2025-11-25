import React from 'react';
import { WorkoutPlan } from '../types';
import { Clock, BarChart3, Info, Check, PlayCircle } from 'lucide-react';

interface Props {
  plan: WorkoutPlan;
}

export const WorkoutDisplay: React.FC<Props> = ({ plan }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up pb-32">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 mb-8 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{plan.title}</h2>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold border border-emerald-500/30 w-fit">
                    {plan.difficulty}
                </span>
            </div>
          
          <p className="text-slate-400 text-lg mb-6 max-w-2xl">{plan.description}</p>
          
          <div className="flex items-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-medium">{plan.totalDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="font-medium">{plan.exercises.length} Exercises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {plan.exercises.map((exercise, index) => (
          <div 
            key={exercise.id} 
            className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/10"
          >
            <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-emerald-400 font-bold text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {exercise.name}
                  </h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sets</p>
                        <p className="text-lg font-semibold text-white">{exercise.sets}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reps</p>
                        <p className="text-lg font-semibold text-white">{exercise.reps}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Rest</p>
                        <p className="text-lg font-semibold text-white">{exercise.rest}</p>
                    </div>
                </div>
              </div>

              <div className="md:w-1/3 mt-4 md:mt-0 md:border-l md:border-slate-700 md:pl-6">
                 <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-slate-400">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <p>{exercise.notes}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        {exercise.muscleGroup}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      {plan.tips.length > 0 && (
        <div className="mt-8 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-emerald-400" />
            Coach's Tips
          </h4>
          <ul className="space-y-2">
            {plan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
