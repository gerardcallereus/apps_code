import React from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';

interface CircuitBoardProps {
  isActive: boolean;
}

export const CircuitBoard: React.FC<CircuitBoardProps> = ({ isActive }) => {
  return (
    <div className="w-full bg-slate-800 rounded-xl p-6 mb-8 border-4 border-slate-600 shadow-inner relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-around gap-8">
        
        {/* Wire Traces */}
        <div className={`absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-gray-700 transition-colors duration-300 ${isActive ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]' : ''}`} />

        {/* Light Bulb Station */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-yellow-100 border-yellow-400 shadow-[0_0_50px_rgba(253,224,71,0.8)]' : 'bg-gray-700 border-gray-600'}`}>
            <Lightbulb 
              size={48} 
              className={`transition-all duration-300 ${isActive ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} 
            />
          </div>
          <span className="mt-2 text-white font-mono text-sm bg-black/50 px-2 py-1 rounded">BOMBETA</span>
        </div>

        {/* Battery / Power Source Visual */}
        <div className="relative z-10 bg-slate-700 p-2 rounded border-2 border-slate-500">
             <div className="flex gap-1 items-center">
                <div className="w-2 h-8 bg-red-500 rounded-sm"></div>
                <div className="w-2 h-8 bg-black rounded-sm"></div>
                <div className="w-2 h-8 bg-red-500 rounded-sm"></div>
                <div className="w-2 h-8 bg-black rounded-sm"></div>
             </div>
             <div className="text-xs text-center text-gray-400 font-mono mt-1">6V</div>
        </div>

        {/* Buzzer Station */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-lg border-4 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-red-900/50 border-red-500 animate-pulse' : 'bg-gray-700 border-gray-600'}`}>
            <Volume2 
              size={48} 
              className={`transition-all duration-100 ${isActive ? 'text-red-500 translate-x-0.5' : 'text-gray-500'}`} 
            />
             {isActive && (
                <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-ping opacity-75"></div>
             )}
          </div>
          <span className="mt-2 text-white font-mono text-sm bg-black/50 px-2 py-1 rounded">BRUNZIDOR</span>
        </div>

      </div>
    </div>
  );
};
