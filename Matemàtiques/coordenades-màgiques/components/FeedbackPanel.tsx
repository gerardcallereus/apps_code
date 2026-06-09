
import React from 'react';
import { GameStatus } from '../types';

interface FeedbackPanelProps {
  message: string;
  status: GameStatus;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ message, status }) => {
  if (status === 'playing' || status === 'initial') return null;

  const baseClasses = 'p-4 rounded-lg text-center font-semibold text-lg transition-all duration-300';
  let statusClasses = '';
  let icon = '';

  switch (status) {
    case 'correct':
      statusClasses = 'bg-green-100 text-green-800 border-2 border-green-300';
      icon = '✅';
      break;
    case 'incorrect':
      statusClasses = 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300';
      icon = '🤔';
      break;
    default:
      return null;
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${baseClasses} ${statusClasses}`}>
      <span className="text-2xl">{icon}</span>
      <p>{message}</p>
    </div>
  );
};

export default FeedbackPanel;
