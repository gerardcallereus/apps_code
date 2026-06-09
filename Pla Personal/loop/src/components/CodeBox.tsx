import React from 'react';
import { Play } from 'lucide-react';

export const CodeBox: React.FC<{
  code: string;
  setCode: (code: string) => void;
  description?: string;
}> = ({ code, setCode, description }) => {
  return (
    <div className="my-6">
      {description && (
        <p className="text-xs font-black text-lime-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
          {description}
        </p>
      )}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Glow effect at the top boundary */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500/20 to-transparent"></div>
        
        {/* LCD Phosphor Screen */}
        <div className="p-5 overflow-auto bg-[#0a0a0c] border-b border-zinc-900">
          <pre className="text-[14.5px] font-mono leading-relaxed text-[#a3e635] drop-shadow-[0_0_4px_rgba(163,230,53,0.3)] font-medium whitespace-pre-wrap">{code}</pre>
        </div>
        
        {/* Tactile sampler button footer */}
        <div className="bg-zinc-900/35 px-4 py-2.5 flex justify-end">
          <button
            onClick={() => setCode(code)}
            className="bg-zinc-900 text-lime-400 hover:text-lime-300 border border-zinc-800 hover:border-lime-500/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-md"
          >
            <Play size={12} fill="currentColor" className="text-lime-400" />
            Carrega Codi
          </button>
        </div>
      </div>
    </div>
  );
};
