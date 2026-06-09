import React, { useRef, useState } from 'react';
import { identifySymbolFromImage } from '../services/geminiService';
import { CIRCUIT_ELEMENTS } from '../constants';
import { AnalysisResult } from '../types';

const ScannerMode: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setResult(null);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Full: string) => {
    setIsAnalyzing(true);
    // Remove data:image/...;base64, prefix for API
    const base64Data = base64Full.split(',')[1];
    
    try {
      const analysis = await identifySymbolFromImage(base64Data);
      setResult(analysis);
    } catch (e) {
      console.error(e);
      setResult({
          elementId: null,
          confidence: 0,
          explanation: "Error de connexió."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const identifiedElement = result?.elementId 
    ? CIRCUIT_ELEMENTS.find(e => e.id === result.elementId)
    : null;

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto flex flex-col h-full">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-amber-900 mb-1">Identificador IA</h3>
        <p className="text-sm text-amber-800">
          Fes una foto a un esquema o un dibuix fet a mà. La IA intentarà endevinar de quin component es tracta.
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center">
        {!imagePreview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square max-h-80 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <svg className="w-16 h-16 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-slate-500 font-medium">Prem per fer foto o pujar imatge</span>
          </div>
        ) : (
          <div className="w-full relative rounded-2xl overflow-hidden shadow-lg mb-6">
            <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain bg-black" />
            <button 
              onClick={() => { setImagePreview(null); setResult(null); }}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {isAnalyzing && (
            <div className="w-full py-8 text-center animate-pulse">
                <p className="text-lg font-semibold text-amber-600">Analitzant el circuit...</p>
            </div>
        )}

        {result && !isAnalyzing && (
            <div className={`w-full p-6 rounded-xl border-2 ${identifiedElement ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                {identifiedElement ? (
                    <div className="text-center">
                        <div className="text-sm font-bold text-green-700 uppercase tracking-wide mb-2">Identificat</div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">{identifiedElement.name}</h2>
                        <div className="w-32 h-20 mx-auto text-slate-800 mb-4 bg-white rounded-lg p-2 border border-slate-100">
                             {identifiedElement.icon}
                        </div>
                        <p className="text-slate-600 text-sm mb-4 bg-white/50 p-2 rounded">{result.explanation}</p>
                        
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${result.confidence * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500">Seguretat IA: {Math.round(result.confidence * 100)}%</p>
                    </div>
                ) : (
                    <div className="text-center text-red-700">
                        <p className="font-bold mb-2">No s'ha pogut identificar</p>
                        <p className="text-sm">{result.explanation}</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ScannerMode;