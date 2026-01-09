import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Lock, Unlock, Download, ChevronRight, ChevronLeft, 
  CheckCircle, AlertTriangle, Lightbulb, Users, ClipboardList, RefreshCcw
} from 'lucide-react';

// --- DATA DEFINITIONS ---
const CATEGORIES = {
  "Household": [
    { id: "h1", label: "Laundry Cycles" },
    { id: "h2", label: "Meal Planning" },
    { id: "h3", label: "Grocery Logistics" },
    { id: "h4", label: "Tidying/Clutter" },
    { id: "h5", label: "Home Maintenance" },
    { id: "h6", label: "Pet/Child Schedules" }
  ],
  "Financial & Admin": [
    { id: "f1", label: "Bill Payments" },
    { id: "f2", label: "Long-term Saving" },
    { id: "f3", label: "Impulse Spending" },
    { id: "f4", label: "Filing/Documents" },
    { id: "f5", label: "Appointment Booking" },
    { id: "f6", label: "Email Management" }
  ],
  "Emotional & Social": [
    { id: "e1", label: "Rejection Sensitivity" },
    { id: "e2", label: "Active Listening" },
    { id: "e3", label: "Social Battery Management" },
    { id: "e4", label: "Conflict Resolution" },
    { id: "e5", label: "Tone of Voice" },
    { id: "e6", label: "Sharing the Mic" }
  ],
  "Executive Function": [
    { id: "x1", label: "Time Blindness" },
    { id: "x2", label: "Task Initiation" },
    { id: "x3", label: "Working Memory" },
    { id: "x4", label: "Transitioning" },
    { id: "x5", label: "Hyperfocus Management" },
    { id: "x6", label: "Prioritization" }
  ],
  "Physical & Sensory": [
    { id: "s1", label: "Sensory Overload" },
    { id: "s2", label: "Sleep Hygiene" },
    { id: "s3", label: "Consistent Exercise" },
    { id: "s4", label: "Dopamine Seeking" },
    { id: "s5", label: "Personal Hygiene" },
    { id: "s6", label: "Morning Routines" }
  ]
};

const SCALE_GUIDE = [
  { val: 1, label: "No Struggle", desc: "Easy, automatic, or non-impactful." },
  { val: 2, label: "Mild", desc: "Occasionally requires effort/reminders." },
  { val: 3, label: "Moderate", desc: "Significant effort; causes regular friction." },
  { val: 4, label: "Severe", desc: "Highly impactful; causes frequent failure." },
  { val: 5, label: "Constant", desc: "Overwhelming; requires external support." }
];

const App = () => {
  // --- STATE ---
  const [activePartner, setActivePartner] = useState(1);
  const [scores, setScores] = useState({ 1: {}, 2: {} });
  const [completed, setCompleted] = useState({ 1: false, 2: false });
  const [resultsRevealed, setResultsRevealed] = useState(false);
  const [currentTab, setCurrentTab] = useState(Object.keys(CATEGORIES)[0]);

  // --- LOGIC ---
  const updateScore = (partner, attrId, val) => {
    setScores(prev => ({
      ...prev,
      [partner]: { ...prev[partner], [attrId]: val }
    }));
  };

  const getCategoryAverage = (partner, category) => {
    const attrIds = CATEGORIES[category].map(a => a.id);
    const categoryScores = attrIds.map(id => scores[partner][id] || 1);
    const sum = categoryScores.reduce((a, b) => a + b, 0);
    return (sum / attrIds.length).toFixed(1);
  };

  const radarData = useMemo(() => {
    return Object.keys(CATEGORIES).map(cat => ({
      subject: cat,
      A: parseFloat(getCategoryAverage(1, cat)),
      B: parseFloat(getCategoryAverage(2, cat)),
      fullMark: 5,
    }));
  }, [scores, resultsRevealed]);

  const generateInsights = () => {
    const insights = [];
    Object.keys(CATEGORIES).forEach(cat => {
      const p1Avg = parseFloat(getCategoryAverage(1, cat));
      const p2Avg = parseFloat(getCategoryAverage(2, cat));
      const diff = Math.abs(p1Avg - p2Avg);
      
      if (p1Avg >= 4 && p2Avg >= 4) {
        insights.push({
          type: 'danger',
          title: `Critical Conflict: ${cat}`,
          body: `You both struggle severely here. This is a high-risk burnout zone. STOP trying to manage this internally. Strategy: Automate (apps/robot cleaners) or outsource (hired help).`
        });
      } else if (diff >= 1.5) {
        const lead = p1Avg < p2Avg ? "Partner 1" : "Partner 2";
        insights.push({
          type: 'complementary',
          title: `Complementary Strength: ${cat}`,
          body: `${lead} handles this significantly better. Strategy: ${lead} acts as the 'Executive Director' for this domain, while the other partner performs discrete, non-planning tasks.`
        });
      } else if (p1Avg <= 2 && p2Avg <= 2) {
        insights.push({
          type: 'success',
          title: `Shared Anchor: ${cat}`,
          body: `This is a safe zone. Use this area to ground the relationship when other domains feel chaotic.`
        });
      }
    });
    return insights;
  };

  // --- RENDERERS ---
  const renderAssessment = (partnerNum) => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-6">
        <h3 className="font-bold text-indigo-800 flex items-center gap-2">
          <ClipboardList size={20} /> Partner {partnerNum}'s Assessment
        </h3>
        <p className="text-sm text-indigo-700">Rate honestly. Your partner cannot see these until you both finish.</p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {Object.keys(CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setCurrentTab(cat)}
            className={`px-4 py-2 rounded-t-lg whitespace-nowrap text-sm font-medium transition-colors ${
              currentTab === cat 
                ? 'bg-white text-indigo-600 border-t border-l border-r border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]' 
                : 'text-slate-500 hover:text-indigo-400'
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
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>No Struggle</span>
              <span>Constant Struggle</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCompleted(prev => ({ ...prev, [partnerNum]: true }))}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} /> Finalize My Ratings
      </button>
    </div>
  );

  const renderResults = () => {
    const insights = generateInsights();
    return (
      <div className="space-y-10 animate-in zoom-in-95 duration-700">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Relationship Synergy Report</h2>
          <p className="text-slate-500">A deep-dive analysis of your ADHD dynamics.</p>
        </div>

        {/* Visual Comparison */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Partner 1" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                <Radar name="Partner 2" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" /> Executive Summary
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

        {/* Tactical Insights */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb size={24} className="text-amber-500" /> Strategic Recommendations
          </h3>
          <div className="grid gap-4">
            {insights.map((ins, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border-l-8 ${
                  ins.type === 'danger' ? 'bg-rose-50 border-rose-500' : 
                  ins.type === 'complementary' ? 'bg-indigo-50 border-indigo-500' : 
                  'bg-emerald-50 border-emerald-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {ins.type === 'danger' ? <AlertTriangle className="text-rose-600 shrink-0" /> : <Lightbulb className="text-indigo-600 shrink-0" />}
                  <div>
                    <h5 className={`font-bold mb-1 ${
                      ins.type === 'danger' ? 'text-rose-900' : 'text-slate-900'
                    }`}>{ins.title}</h5>
                    <p className="text-sm text-slate-600 leading-relaxed">{ins.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">The ADHD Partnership Contract</h3>
            <p className="text-slate-400 text-sm mb-6">Commit to these three rules for the next 30 days:</p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 items-start">
                <span className="bg-indigo-500 text-white p-1 rounded text-xs font-bold">1</span>
                <span><strong>Delegation, not Dumping:</strong> The partner leading a category manages the "Planning," the other partner helps with "Tasks."</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-indigo-500 text-white p-1 rounded text-xs font-bold">2</span>
                <span><strong>No-Shame Systems:</strong> If we both struggle with a category, we agree to buy the solution (e.g. pre-chopped veg) without feeling guilty.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-indigo-500 text-white p-1 rounded text-xs font-bold">3</span>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full -mr-20 -mt-20"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div className={`transition-all duration-700 ${completed[1] ? 'w-1/2 bg-indigo-500' : 'w-0'}`}></div>
            <div className={`transition-all duration-700 ${completed[2] ? 'w-1/2 bg-pink-500' : 'w-0'}`}></div>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {resultsRevealed ? "Report Finalized" : "Assessment Phase"}
          </span>
        </div>

        {/* View Switcher */}
        {!resultsRevealed ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActivePartner(1)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${activePartner === 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 shadow-sm border border-slate-200'}`}
                >
                  Partner 1 {completed[1] && '✓'}
                </button>
                <button 
                  onClick={() => setActivePartner(2)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${activePartner === 2 ? 'bg-pink-600 text-white shadow-lg' : 'bg-white text-slate-500 shadow-sm border border-slate-200'}`}
                >
                  Partner 2 {completed[2] && '✓'}
                </button>
              </div>
              <button 
                onClick={() => {
                   setScores({ 1: {}, 2: {} });
                   setCompleted({ 1: false, 2: false });
                   setResultsRevealed(false);
                }}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Reset Everything"
              >
                <RefreshCcw size={20} />
              </button>
            </div>

            {completed[activePartner] ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="inline-block p-4 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold">Partner {activePartner} Assessment Complete</h2>
                <p className="text-slate-500 max-w-sm mx-auto">Your responses are locked. Please hand the device to your partner or wait for them to finish.</p>
                {completed[1] && completed[2] && (
                  <button 
                    onClick={() => setResultsRevealed(true)}
                    className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto"
                  >
                    <Unlock size={24} /> Reveal Shared Results
                  </button>
                )}
              </div>
            ) : (
              renderAssessment(activePartner)
            )}
          </div>
        ) : (
          <div>
             {renderResults()}
             <button 
               onClick={() => setResultsRevealed(false)}
               className="mt-12 text-slate-400 hover:text-indigo-600 flex items-center gap-2 mx-auto"
             >
               <ChevronLeft size={18} /> Back to Assessments
             </button>
          </div>
        )}

        {/* Global Footer Guide */}
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
      </div>
    </div>
  );
};

export default App;
