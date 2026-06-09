import React, { useState, useEffect } from 'react';
import { getQuizQuestions } from '../services/gemini';
import { QuizQuestion } from '../types';
import { Brain, CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const data = await getQuizQuestions();
    // Shuffle questions randomly
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedOption(null);
    setLoading(false);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (questions[currentQuestionIndex] && index === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-purple-500" />
        <p>Preparant les preguntes...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">¡Test Completat!</h2>
        <div className="text-6xl mb-6">🏆</div>
        <p className="text-xl text-slate-600 mb-2">Has encertat:</p>
        <p className="text-5xl font-bold text-purple-600 mb-8">{score} de {questions.length}</p>
        
        <div className="text-left bg-purple-50 p-6 rounded-xl mb-8">
          {score === questions.length ? (
            <p className="text-purple-900 font-bold text-center">¡Excel·lent! Ets un expert en electricitat! ⚡</p>
          ) : score > questions.length / 2 ? (
            <p className="text-purple-900 font-bold text-center">Molt bé! Però encara pots millorar.</p>
          ) : (
            <p className="text-purple-900 font-bold text-center">Torna a repassar la teoria i prova-ho de nou!</p>
          )}
        </div>

        <button 
          onClick={restartQuiz}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw className="w-5 h-5" /> Tornar a començar
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 text-purple-600 font-bold">
          <Brain className="w-6 h-6" />
          <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
        </div>
        <div className="text-slate-600 font-medium">
          Punts: <span className="text-purple-600 text-xl font-bold">{score}</span>
        </div>
      </div>

      <div className="min-h-[400px]">
        {currentQuestion ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-purple-600 p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold leading-tight">
                {currentQuestion.question}
              </h3>
            </div>
            
            <div className="p-6 grid gap-4">
              {currentQuestion.options.map((option, index) => {
                let cardStyle = "border-2 border-slate-100 hover:border-purple-300 hover:bg-purple-50 cursor-pointer";
                
                if (isAnswered) {
                  if (index === currentQuestion.correctAnswerIndex) {
                    cardStyle = "border-2 border-green-500 bg-green-50 text-green-800 cursor-default";
                  } else if (index === selectedOption) {
                    cardStyle = "border-2 border-red-500 bg-red-50 text-red-800 cursor-default";
                  } else {
                    cardStyle = "border-slate-100 opacity-50 cursor-default";
                  }
                }

                return (
                  <button 
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl transition-all duration-200 flex items-center justify-between text-left w-full ${cardStyle}`}
                  >
                    <span className="font-medium text-lg">{option}</span>
                    {isAnswered && index === currentQuestion.correctAnswerIndex && (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    )}
                    {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswerIndex && (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="mb-4">
                  <h4 className="font-bold text-slate-700 mb-1">Explicació:</h4>
                  <p className="text-slate-600">{currentQuestion.explanation}</p>
                </div>
                <button 
                  onClick={nextQuestion}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-200"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Següent Pregunta' : 'Veure Resultats'} 
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500">Error carregant la pregunta.</div>
        )}
      </div>
    </div>
  );
};

export default Quiz;