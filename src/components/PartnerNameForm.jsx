import React, { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';

export const PartnerNameForm = ({ onNamesSet, initialNames = { partner1: '', partner2: '' } }) => {
  const [partner1Name, setPartner1Name] = useState(initialNames.partner1);
  const [partner2Name, setPartner2Name] = useState(initialNames.partner2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (partner1Name.trim() && partner2Name.trim()) {
      onNamesSet({ partner1: partner1Name.trim(), partner2: partner2Name.trim() });
    }
  };

  const isValid = partner1Name.trim() && partner2Name.trim();

  return (
    <div className="max-w-md mx-auto animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Your Assessment</h2>
          <p className="text-slate-500 text-sm">
            Enter both partners' first names to personalize your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="partner1" className="block text-sm font-semibold text-slate-700 mb-2">
              Partner 1 First Name
            </label>
            <input
              id="partner1"
              type="text"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              placeholder="Enter first name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              maxLength={30}
            />
          </div>

          <div>
            <label htmlFor="partner2" className="block text-sm font-semibold text-slate-700 mb-2">
              Partner 2 First Name
            </label>
            <input
              id="partner2"
              type="text"
              value={partner2Name}
              onChange={(e) => setPartner2Name(e.target.value)}
              placeholder="Enter first name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-slate-200'
            }`}
          >
            Start Assessment <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
