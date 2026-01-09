import React from 'react';
import { CheckCircle, Unlock } from 'lucide-react';

export const CompletionView = ({ partnerNum, bothCompleted, onRevealResults }) => {
  return (
    <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-500">
      <div className="inline-block p-4 bg-emerald-100 text-emerald-600 rounded-full mb-2">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-2xl font-bold">Partner {partnerNum} Assessment Complete</h2>
      <p className="text-slate-500 max-w-sm mx-auto">
        Your responses are locked. Please hand the device to your partner or wait for them to finish.
      </p>
      {bothCompleted && (
        <button
          onClick={onRevealResults}
          className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto"
        >
          <Unlock size={24} /> Reveal Shared Results
        </button>
      )}
    </div>
  );
};
