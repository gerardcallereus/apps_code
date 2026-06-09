import React from 'react';
import { Play } from 'lucide-react';

export const CodeBox: React.FC<{
  code: string;
  setCode: (code: string) => void;
  description?: string;
}> = ({ code, setCode, description }) => {
  return (
    <div className="my-6">
      {description && <p className="text-sm font-semibold text-slate-700 mb-2.5">{description}</p>}
      <div className="bg-[#FAF9F6]/45 border border-slate-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
        <div className="p-5 overflow-auto bg-[#FAFAFA]">
          <pre className="text-[14px] font-mono leading-relaxed text-slate-800 font-semibold whitespace-pre-wrap">{code}</pre>
        </div>
        <div className="bg-slate-50/80 px-4 py-2.5 flex justify-end border-t border-slate-200/60">
          <button
            onClick={() => setCode(code)}
            className="bg-white text-violet-700 border border-violet-200 hover:bg-violet-50 hover:text-violet-800 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-95 cursor-pointer"
          >
            <Play size={13} fill="currentColor" />
            Obrir a l'Editor
          </button>
        </div>
      </div>
    </div>
  );
};
