import React, { useState, useRef } from 'react';
import { Point } from '../types';

interface GameControlsProps {
  onSubmit: (guess: Point) => void;
  disabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onSubmit, disabled }) => {
  const [xVal, setXVal] = useState('');
  const [yVal, setYVal] = useState('');
  const xInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const x = parseInt(xVal, 10);
    const y = parseInt(yVal, 10);

    if (!isNaN(x) && !isNaN(y)) {
      onSubmit({ x, y });
      setXVal('');
      setYVal('');
      xInputRef.current?.focus();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-semibold text-slate-600">(</span>
            <label htmlFor="x-coord" className="sr-only">Coordenada X</label>
            <input
                ref={xInputRef}
                id="x-coord"
                type="number"
                value={xVal}
                onChange={(e) => setXVal(e.target.value)}
                placeholder="X"
                disabled={disabled}
                className="w-20 text-center text-lg font-bold border-2 border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-100"
            />
            <span className="text-xl font-semibold text-slate-600">,</span>
            <label htmlFor="y-coord" className="sr-only">Coordenada Y</label>
            <input
                id="y-coord"
                type="number"
                value={yVal}
                onChange={(e) => setYVal(e.target.value)}
                placeholder="Y"
                disabled={disabled}
                className="w-20 text-center text-lg font-bold border-2 border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-100"
            />
            <span className="text-xl font-semibold text-slate-600">)</span>
        </div>
      <button
        type="submit"
        disabled={disabled || xVal === '' || yVal === ''}
        className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
      >
        Comprova
      </button>
    </form>
  );
};

export default GameControls;