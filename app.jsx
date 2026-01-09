import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useAssessment } from './src/hooks/useAssessment';
import { ProgressBar } from './src/components/ProgressBar';
import { AssessmentForm } from './src/components/AssessmentForm';
import { CompletionView } from './src/components/CompletionView';
import { ResultsView } from './src/components/ResultsView';
import { ScaleGuide } from './src/components/ScaleGuide';

const App = () => {
  const [activePartner, setActivePartner] = useState(1);
  const {
    scores,
    completed,
    resultsRevealed,
    updateScore,
    markComplete,
    revealResults,
    resetAssessment
  } = useAssessment();

  const bothCompleted = completed[1] && completed[2];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <ProgressBar completed={completed} resultsRevealed={resultsRevealed} />

        {!resultsRevealed ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActivePartner(1)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    activePartner === 1
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                  }`}
                >
                  Partner 1 {completed[1] && '✓'}
                </button>
                <button
                  onClick={() => setActivePartner(2)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    activePartner === 2
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                  }`}
                >
                  Partner 2 {completed[2] && '✓'}
                </button>
              </div>
              <button
                onClick={resetAssessment}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Reset Everything"
              >
                <RefreshCcw size={20} />
              </button>
            </div>

            {completed[activePartner] ? (
              <CompletionView
                partnerNum={activePartner}
                bothCompleted={bothCompleted}
                onRevealResults={revealResults}
              />
            ) : (
              <AssessmentForm
                partnerNum={activePartner}
                scores={scores}
                updateScore={updateScore}
                onComplete={() => markComplete(activePartner)}
              />
            )}
          </div>
        ) : (
          <ResultsView
            scores={scores}
            onBackToAssessment={() => revealResults()}
          />
        )}

        <ScaleGuide />
      </div>
    </div>
  );
};

export default App;
