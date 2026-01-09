import React from 'react';
import { SCALE_GUIDE } from '../constants/assessmentData';

export const ScaleGuide = () => {
  return (
    <div className="mt-20 border-t border-slate-200 pt-10">
      <div className="grid md:grid-cols-5 gap-4">
        {SCALE_GUIDE.map(s => (
          <div key={s.val} className="text-center">
            <div className="font-black text-slate-300 text-2xl mb-1">{s.val}</div>
            <div className="font-bold text-xs text-slate-600 uppercase mb-1">{s.label}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
