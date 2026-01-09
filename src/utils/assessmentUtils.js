import { CATEGORIES } from '../constants/assessmentData';

export const getCategoryAverage = (scores, partner, category) => {
  const attrIds = CATEGORIES[category].map(a => a.id);
  const categoryScores = attrIds.map(id => scores[partner][id] || 1);
  const sum = categoryScores.reduce((a, b) => a + b, 0);
  return (sum / attrIds.length).toFixed(1);
};

export const generateRadarData = (scores) => {
  return Object.keys(CATEGORIES).map(cat => ({
    subject: cat,
    A: parseFloat(getCategoryAverage(scores, 1, cat)),
    B: parseFloat(getCategoryAverage(scores, 2, cat)),
    fullMark: 5,
  }));
};

export const generateInsights = (scores) => {
  const insights = [];

  Object.keys(CATEGORIES).forEach(cat => {
    const p1Avg = parseFloat(getCategoryAverage(scores, 1, cat));
    const p2Avg = parseFloat(getCategoryAverage(scores, 2, cat));
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

export const getAllAttributeIds = () => {
  return Object.values(CATEGORIES).flat().map(attr => attr.id);
};

export const isAssessmentComplete = (scores, partnerNumber) => {
  const allIds = getAllAttributeIds();
  return allIds.every(id => scores[partnerNumber] && scores[partnerNumber][id]);
};

export const isCategoryComplete = (scores, partnerNumber, category) => {
  const categoryIds = CATEGORIES[category].map(attr => attr.id);
  return categoryIds.every(id => scores[partnerNumber] && scores[partnerNumber][id]);
};
