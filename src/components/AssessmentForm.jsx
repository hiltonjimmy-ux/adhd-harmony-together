import React, { useState } from 'react';
import { CheckCircle, ClipboardList } from 'lucide-react';
import { CATEGORIES } from '../constants/assessmentData';

export const AssessmentForm = ({ partnerNum, scores, updateScore, onComplete }) => {
  const [currentTab, setCurrentTab] = useState(Object.keys(CATEGORIES)[0]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <ClipboardList size={20} /> Partner {partnerNum}'s Assessment
        </h3>
        <p className="text-sm text-blue-700">Rate honestly. Your partner cannot see these until you both finish.</p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {Object.keys(CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setCurrentTab(cat)}
            className={`px-4 py-2 rounded-t-lg whitespace-nowrap text-sm font-medium transition-colors ${
              currentTab === cat
                ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'
                : 'text-slate-500 hover:text-blue-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 py-4">
        {CATEGORIES[currentTab].map(attr => (
          <div key={attr.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-800">{attr.label}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                (scores[partnerNum][attr.id] || 1) > 3 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Score: {scores[partnerNum][attr.id] || 1}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={scores[partnerNum][attr.id] || 1}
              onChange={(e) => updateScore(partnerNum, attr.id, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>No Struggle</span>
              <span>Constant Struggle</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} /> Finalize My Ratings
      </button>
    </div>
  );
};
