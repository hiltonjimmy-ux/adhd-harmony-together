import React, { useState } from 'react';
import { CheckCircle, ClipboardList, AlertCircle, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants/assessmentData';
import { isCategoryComplete, isAssessmentComplete } from '../utils/assessmentUtils';

export const AssessmentForm = ({ partnerNum, partnerName, scores, updateScore, onComplete }) => {
  const [currentTab, setCurrentTab] = useState(Object.keys(CATEGORIES)[0]);
  const categoryKeys = Object.keys(CATEGORIES);
  const currentTabIndex = categoryKeys.indexOf(currentTab);
  const isLastTab = currentTabIndex === categoryKeys.length - 1;
  const allTabsComplete = isAssessmentComplete(scores, partnerNum);

  const handleNext = () => {
    if (currentTabIndex < categoryKeys.length - 1) {
      setCurrentTab(categoryKeys[currentTabIndex + 1]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <ClipboardList size={20} /> {partnerName}'s Assessment
        </h3>
        <p className="text-sm text-blue-700">Rate honestly. Your partner cannot see these until you both finish.</p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {Object.keys(CATEGORIES).map(cat => {
          const isComplete = isCategoryComplete(scores, partnerNum, cat);
          return (
            <button
              key={cat}
              onClick={() => setCurrentTab(cat)}
              className={`px-4 py-2 rounded-t-lg whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === cat
                  ? 'bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'
                  : 'text-slate-500 hover:text-blue-500'
              }`}
            >
              {cat}
              {isComplete && <span className="text-emerald-600">✓</span>}
            </button>
          );
        })}
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

      {isLastTab ? (
        <>
          {!allTabsComplete && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle size={18} />
                <p className="font-medium text-sm">Please complete all tabs before finalizing your ratings.</p>
              </div>
            </div>
          )}

          <button
            onClick={onComplete}
            disabled={!allTabsComplete}
            className={`w-full py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 ${
              allTabsComplete
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-slate-200'
            }`}
          >
            <CheckCircle size={20} /> Finalize My Ratings
          </button>
        </>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer"
        >
          Next <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
};
