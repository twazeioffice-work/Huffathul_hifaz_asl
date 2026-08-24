import React, { useState } from "react";
import { FileWarning, Plus } from "lucide-react";

export function HifzSabaqEntryCard() {
  const [mistakes, setMistakes] = useState<any[]>([]);

  const addMistake = () => {
    setMistakes([...mistakes, { type: "Lahn Jali", page: 1, ayah: "" }]);
  };

  return (
    <div className="p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-100">Hifz Sabaq Entry</h2>
      </div>
      
      {/* Main entry fields would go here */}
      <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-300">Tracked Mistakes</h3>
          <button 
            onClick={addMistake}
            className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors text-xs"
          >
            <Plus className="h-3 w-3" />
            <span>Add Mistake</span>
          </button>
        </div>

        {mistakes.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No mistakes recorded for this session.</p>
        ) : (
          <div className="space-y-2">
            {mistakes.map((m, i) => (
              <div key={i} className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl flex items-center space-x-3">
                <FileWarning className="h-4 w-4 text-rose-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-300">Type: {m.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
