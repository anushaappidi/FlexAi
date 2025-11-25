import React, { useState, useRef, useEffect } from 'react';
import { Send, Wand2, X } from 'lucide-react';

interface Props {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export const ChatInterface: React.FC<Props> = ({ onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  // Suggestions for the user
  const suggestions = [
    "Make it harder",
    "Swap squats for leg press",
    "I have a sore shoulder",
    "Shorten to 30 mins"
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Quick Suggestion Chips - Only show when input is focused or empty */}
        <div className={`flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide transition-all duration-300 ${isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => {
                        onSendMessage(s);
                        setInput('');
                    }}
                    className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-medium text-emerald-400 transition-colors shadow-lg shadow-black/20"
                >
                    {s}
                </button>
            ))}
        </div>

        <form 
            onSubmit={handleSubmit}
            className={`relative flex items-center bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl shadow-emerald-900/10 transition-all duration-300 ${isProcessing ? 'ring-2 ring-emerald-500/50 border-emerald-500/50' : 'focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500'}`}
        >
          <div className="pl-4 pr-2">
            <Wand2 className={`w-5 h-5 ${isProcessing ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={isProcessing ? "AI is updating your plan..." : "Ask to modify (e.g., 'Too many squats')"}
            className="w-full bg-transparent border-none text-white placeholder-slate-500 px-3 py-4 focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="p-3 mr-1 text-emerald-400 disabled:text-slate-600 transition-colors hover:bg-slate-700/50 rounded-xl"
          >
            {isProcessing ? (
                 <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  );
};
