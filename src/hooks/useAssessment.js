import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getAllAttributeIds } from '../utils/assessmentUtils';

export const useAssessment = (assessmentId = null) => {
  const [currentAssessmentId, setCurrentAssessmentId] = useState(assessmentId);
  const [scores, setScores] = useState({ 1: {}, 2: {} });
  const [completed, setCompleted] = useState({ 1: false, 2: false });
  const [resultsRevealed, setResultsRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAssessment = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (assessmentError) throw assessmentError;

      if (assessment) {
        setCompleted({
          1: assessment.partner1_completed,
          2: assessment.partner2_completed
        });
        setResultsRevealed(assessment.results_revealed);

        const { data: scoresData, error: scoresError } = await supabase
          .from('scores')
          .select('*')
          .eq('assessment_id', id);

        if (scoresError) throw scoresError;

        const loadedScores = { 1: {}, 2: {} };
        scoresData?.forEach(score => {
          loadedScores[score.partner_number][score.attribute_id] = score.score_value;
        });
        setScores(loadedScores);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: createError } = await supabase
        .from('assessments')
        .insert([{ user_id: user.id }])
        .select()
        .single();

      if (createError) throw createError;

      setCurrentAssessmentId(data.id);
      return data.id;
    } catch (err) {
      setError(err.message);
      console.error('Error creating assessment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScore = useCallback(async (partner, attrId, value) => {
    setScores(prev => ({
      ...prev,
      [partner]: { ...prev[partner], [attrId]: value }
    }));

    if (!currentAssessmentId) return;

    try {
      const { error: upsertError } = await supabase
        .from('scores')
        .upsert({
          assessment_id: currentAssessmentId,
          partner_number: partner,
          attribute_id: attrId,
          score_value: value
        }, {
          onConflict: 'assessment_id,partner_number,attribute_id'
        });

      if (upsertError) throw upsertError;
    } catch (err) {
      console.error('Error updating score:', err);
    }
  }, [currentAssessmentId]);

  const markComplete = useCallback(async (partner) => {
    setCompleted(prev => ({ ...prev, [partner]: true }));

    if (!currentAssessmentId) return;

    try {
      const field = partner === 1 ? 'partner1_completed' : 'partner2_completed';
      const { error: updateError } = await supabase
        .from('assessments')
        .update({ [field]: true })
        .eq('id', currentAssessmentId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error marking complete:', err);
    }
  }, [currentAssessmentId]);

  const revealResults = useCallback(async () => {
    setResultsRevealed(true);

    if (!currentAssessmentId) return;

    try {
      const { error: updateError } = await supabase
        .from('assessments')
        .update({ results_revealed: true })
        .eq('id', currentAssessmentId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error revealing results:', err);
    }
  }, [currentAssessmentId]);

  const backToAssessments = useCallback(async () => {
    setResultsRevealed(false);

    if (!currentAssessmentId) return;

    try {
      const { error: updateError } = await supabase
        .from('assessments')
        .update({ results_revealed: false })
        .eq('id', currentAssessmentId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error going back to assessments:', err);
    }
  }, [currentAssessmentId]);

  const resetAssessment = useCallback(async () => {
    const newId = await createAssessment();
    if (newId) {
      setScores({ 1: {}, 2: {} });
      setCompleted({ 1: false, 2: false });
      setResultsRevealed(false);
    }
  }, [createAssessment]);

  useEffect(() => {
    if (currentAssessmentId) {
      loadAssessment(currentAssessmentId);
    } else {
      createAssessment();
    }
  }, []);

  return {
    assessmentId: currentAssessmentId,
    scores,
    completed,
    resultsRevealed,
    loading,
    error,
    updateScore,
    markComplete,
    revealResults,
    backToAssessments,
    resetAssessment
  };
};
