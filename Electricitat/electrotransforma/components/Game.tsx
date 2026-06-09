import React, { useState, useEffect } from 'react';
import { getRandomQuestions } from '../services/questionService';
import { Question, GameState } from '../types';
import { CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight, Loader2 } from 'lucide-react';

const Game: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentQuestionIndex: 0,
    isGameOver: false,
    streak: 0,
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGame = async () => {
    setLoading(true);
    setGameState({ score: 0, currentQuestionIndex: 0, isGameOver: false, streak: 0 });
    setSelectedOption(null);
    setIsCorrect(null);
    
    // Use the local service to get questions
    const qs = await getRandomQuestions(10);
    setQuestions(qs);
    setLoading(false);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption) return; // Prevent double checking

    const currentQuestion = questions[gameState.currentQuestionIndex];
    const correct = option === currentQuestion.correctType;

    setSelectedOption(option);
    setIsCorrect(correct);

    if (correct) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100 + (prev.streak * 10),
        streak: prev.streak + 1
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0
      }));
    }
  };

  const nextQuestion = () => {
    if (gameState.currentQuestionIndex + 1 >= questions.length) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    } else {
      setGameState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-600 font-medium">Preparant el qüestionari...</p>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8 animate-fade-in mt-10">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Trophy size={64} className="text-yellow-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Joc Acabat!</h2>
        <p className="text-slate-500 mb-6">Has demostrat ser un expert en energia.</p>
        
        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <p className="text-sm text-indigo-600 uppercase tracking-wide font-bold">Puntuació Final</p>
          <p className="text-5xl font-black text-indigo-700">{gameState.score}</p>
        </div>

        <button 
          onClick={loadGame}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} /> Jugar de nou
        </button>
      </div>
    );
  }

  const currentQuestion = questions[gameState.currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      {/* Header Stat Bar */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Pregunta</span>
          <p className="text-xl font-bold text-slate-700">{gameState.currentQuestionIndex + 1} <span className="text-slate-400 text-sm">/ {questions.length}</span></p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase">Punts</span>
          <p className="text-xl font-bold text-indigo-600">{gameState.score}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 mb-6">
        <div className="bg-indigo-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{currentQuestion.objectName}</h3>
          <p className="text-indigo-100 opacity-90 text-lg">{currentQuestion.description}</p>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 font-medium mb-4">Quin tipus de transformació energètica realitza principalment?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentQuestion.correctType;
              
              let btnClass = "p-4 rounded-xl border-2 text-left font-semibold transition-all ";
              
              if (selectedOption) {
                if (isSelected && isCorrectOption) {
                  btnClass += "bg-green-50 border-green-500 text-green-700";
                } else if (isSelected && !isCorrectOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-700";
                } else if (!isSelected && isCorrectOption) {
                  btnClass += "bg-green-50 border-green-500 text-green-700 opacity-70";
                } else {
                  btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                }
              } else {
                btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:shadow-md cursor-pointer";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedOption}
                  className={btnClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Feedback Section */}
        {selectedOption && (
          <div className={`p-6 border-t ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} animate-fade-in`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
              ) : (
                <XCircle className="text-red-600 shrink-0 mt-1" size={24} />
              )}
              <div>
                <h4 className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correcte!' : 'Incorrecte'}
                </h4>
                <p className="text-slate-700 mt-1 mb-4 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <button
                  onClick={nextQuestion}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-transform active:scale-95 ${
                    isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Següent <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;