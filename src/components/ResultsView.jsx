import React, { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer
} from 'recharts';
import { Lightbulb, Users, Download, ChevronLeft } from 'lucide-react';
import { generateRadarData, generateInsights } from '../utils/assessmentUtils';
import { InsightCard } from './InsightCard';

export const ResultsView = ({ scores, onBackToAssessment }) => {
  const radarData = useMemo(() => generateRadarData(scores), [scores]);
  const insights = useMemo(() => generateInsights(scores), [scores]);

  return (
    <div className="space-y-10 animate-in zoom-in-95 duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Relationship Synergy Report</h2>
        <p className="text-slate-500">A deep-dive analysis of your ADHD dynamics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar name="Partner 1" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
              <Radar name="Partner 2" dataKey="B" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> Executive Summary
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your "Relationship Shape" is unique. Overlapping areas show shared challenges, while diverging points show where one partner can act as a cognitive stabilizer for the other.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>CATEGORY</span>
              <span>P1 | P2</span>
            </div>
            {radarData.map(d => (
              <div key={d.subject} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                <span className="text-sm font-medium text-slate-700">{d.subject}</span>
                <span className="text-sm font-mono text-slate-500">{d.A} vs {d.B}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Lightbulb size={24} className="text-amber-500" /> Strategic Recommendations
        </h3>
        <div className="grid gap-4">
          {insights.map((ins, idx) => (
            <InsightCard key={idx} insight={ins} />
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">The ADHD Partnership Contract</h3>
          <p className="text-slate-400 text-sm mb-6">Commit to these three rules for the next 30 days:</p>
          <ul className="space-y-4 mb-8">
            <li className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white p-1 rounded text-xs font-bold">1</span>
              <span><strong>Delegation, not Dumping:</strong> The partner leading a category manages the "Planning," the other partner helps with "Tasks."</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white p-1 rounded text-xs font-bold">2</span>
              <span><strong>No-Shame Systems:</strong> If we both struggle with a category, we agree to buy the solution (e.g. pre-chopped veg) without feeling guilty.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white p-1 rounded text-xs font-bold">3</span>
              <span><strong>The 5-Minute Reset:</strong> If sensory overload happens, either partner can call a "Silent Reset" for 5 minutes.</span>
            </li>
          </ul>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <Download size={18} /> Download/Print Contract
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-10 rounded-full -mr-20 -mt-20"></div>
      </div>

      <button
        onClick={onBackToAssessment}
        className="mt-12 text-slate-400 hover:text-blue-600 flex items-center gap-2 mx-auto"
      >
        <ChevronLeft size={18} /> Back to Assessments
      </button>
    </div>
  );
};
