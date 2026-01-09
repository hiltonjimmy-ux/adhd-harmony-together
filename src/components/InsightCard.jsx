import React from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export const InsightCard = ({ insight }) => {
  const { type, title, body } = insight;

  const styles = {
    danger: 'bg-rose-50 border-rose-500',
    complementary: 'bg-blue-50 border-blue-600',
    success: 'bg-emerald-50 border-emerald-500'
  };

  const iconColors = {
    danger: 'text-rose-600',
    complementary: 'text-blue-600',
    success: 'text-emerald-600'
  };

  const titleColors = {
    danger: 'text-rose-900',
    complementary: 'text-slate-900',
    success: 'text-slate-900'
  };

  return (
    <div className={`p-6 rounded-2xl border-l-8 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        {type === 'danger' ? (
          <AlertTriangle className={`${iconColors[type]} shrink-0`} />
        ) : (
          <Lightbulb className={`${iconColors[type]} shrink-0`} />
        )}
        <div>
          <h5 className={`font-bold mb-1 ${titleColors[type]}`}>{title}</h5>
          <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
};
