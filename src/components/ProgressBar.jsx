import React from 'react';

export const ProgressBar = ({ completed, resultsRevealed }) => {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden flex">
        <div className={`transition-all duration-700 ${completed[1] ? 'w-1/2 bg-blue-600' : 'w-0'}`}></div>
        <div className={`transition-all duration-700 ${completed[2] ? 'w-1/2 bg-teal-600' : 'w-0'}`}></div>
      </div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
        {resultsRevealed ? "Report Finalized" : "Assessment Phase"}
      </span>
    </div>
  );
};
