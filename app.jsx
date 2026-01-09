import React, { useState } from 'react';
import { RefreshCcw, LogOut, Loader } from 'lucide-react';
import { useAuth } from './src/hooks/useAuth';
import { useAssessment } from './src/hooks/useAssessment';
import { AuthForm } from './src/components/AuthForm';
import { PartnerNameForm } from './src/components/PartnerNameForm';
import { ProgressBar } from './src/components/ProgressBar';
import { AssessmentForm } from './src/components/AssessmentForm';
import { CompletionView } from './src/components/CompletionView';
import { ResultsView } from './src/components/ResultsView';
import { ScaleGuide } from './src/components/ScaleGuide';

const App = () => {
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut } = useAuth();
  const [activePartner, setActivePartner] = useState(1);
  const {
    scores,
    completed,
    resultsRevealed,
    partnerNames,
    namesSet,
    updateScore,
    savePartnerNames,
    markComplete,
    revealResults,
    backToAssessments,
    resetAssessment
  } = useAssessment();

  const bothCompleted = completed[1] && completed[2];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} loading={authLoading} error={authError} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {!namesSet ? (
          <PartnerNameForm
            onNamesSet={savePartnerNames}
            initialNames={partnerNames}
          />
        ) : (
          <>
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
                      {partnerNames.partner1} {completed[1] && '✓'}
                    </button>
                    <button
                      onClick={() => setActivePartner(2)}
                      className={`px-6 py-2 rounded-full font-bold transition-all ${
                        activePartner === 2
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                      }`}
                    >
                      {partnerNames.partner2} {completed[2] && '✓'}
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
                    partnerName={partnerNames[`partner${activePartner}`]}
                    bothCompleted={bothCompleted}
                    onRevealResults={revealResults}
                  />
                ) : (
                  <AssessmentForm
                    partnerNum={activePartner}
                    partnerName={partnerNames[`partner${activePartner}`]}
                    scores={scores}
                    updateScore={updateScore}
                    onComplete={() => markComplete(activePartner)}
                  />
                )}
              </div>
            ) : (
              <ResultsView
                scores={scores}
                partnerNames={partnerNames}
                onBackToAssessment={backToAssessments}
              />
            )}

            <ScaleGuide />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
