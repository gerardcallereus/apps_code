import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameShell from './GameShell';
import { generateQuizQuestion } from '../services/gameLogic';
import { QuizQuestion, AnswerStatus } from '../types';
import { ReplayIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface CastleEscapeGameProps {
  onBack: () => void;
}

type GameState = 'playing' | 'won' | 'lost';

const PLAYER_START_POS = 15;
const ENEMY_START_POS = 0;
const TREASURE_POS = 100;
const ENEMY_MOVE_PER_TURN = 6;
const PLAYER_BASE_MOVE = 8;
const PLAYER_PENALTY_MOVE = -5;


const CastleEscapeGame: React.FC<CastleEscapeGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;

  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [gameState, setGameState] = useState<GameState>('playing');
  
  const [playerPosition, setPlayerPosition] = useState(PLAYER_START_POS);
  const [enemyPosition, setEnemyPosition] = useState(ENEMY_START_POS);
  const [scoreSent, setScoreSent] = useState(false);
  
  const setupForPlayer = useRef<number | null>(null);

  const setupGame = useCallback((q: QuizQuestion | null) => {
    setQuestion(q);
    setPlayerPosition(PLAYER_START_POS);
    setEnemyPosition(ENEMY_START_POS);
    setGameState('playing');
    setAnswerStatus('unanswered');
    setScoreSent(false);
    if(!isTournamentMode) setInternalScore(0);
  }, [isTournamentMode]);

  useEffect(() => {
    if (isTournamentMode && tournament.challenge) {
        if (setupForPlayer.current !== tournament.currentPlayerIndex) {
            setupGame(tournament.challenge);
            setupForPlayer.current = tournament.currentPlayerIndex ?? null;
        } else {
            setQuestion(tournament.challenge);
            setAnswerStatus('unanswered');
        }
    } else if (!isTournamentMode) {
        setupGame(generateQuizQuestion());
    }
  }, [isTournamentMode, tournament?.challenge, setupGame, tournament?.currentPlayerIndex]);
  
  const getNextQuestion = () => {
    if(isTournamentMode) {
       tournament.requestNewChallenge();
       setAnswerStatus('unanswered');
    } else {
        setQuestion(generateQuizQuestion());
        setAnswerStatus('unanswered');
    }
  };

  const handleAnswer = (option: number) => {
    if (answerStatus !== 'unanswered' || gameState !== 'playing') return;
    
    const isCorrect = option === question?.correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    if (!isTournamentMode) {
        if (isCorrect) {
            setInternalScore(s => s + 10);
        } else {
            setInternalScore(s => Math.max(0, s - 5));
        }
    }

    const nextPlayerPos = isCorrect
        ? Math.min(TREASURE_POS, playerPosition + PLAYER_BASE_MOVE)
        : Math.max(ENEMY_START_POS, playerPosition + PLAYER_PENALTY_MOVE);
    const nextEnemyPos = enemyPosition + ENEMY_MOVE_PER_TURN;

    setTimeout(() => {
        setPlayerPosition(nextPlayerPos);
        setEnemyPosition(nextEnemyPos);

        if (nextPlayerPos >= TREASURE_POS) {
            setGameState('won');
        } else if (nextEnemyPos >= nextPlayerPos) {
            setGameState('lost');
        } else {
            getNextQuestion();
        }
    }, 1200);
  };


  useEffect(() => {
      if ((gameState === 'won' || gameState === 'lost') && !scoreSent) {
          if (isTournamentMode) {
              setScoreSent(true);
              let finalScore = 0;
              if (gameState === 'won') {
                  const distanceBonus = Math.round(playerPosition - enemyPosition);
                  finalScore = 50 + distanceBonus;
              } else { 
                  const progressPoints = Math.round(playerPosition / 4);
                  finalScore = progressPoints - 25;
              }
              tournament.submitAnswer({ scoreDelta: finalScore, isCorrect: gameState === 'won' });
          } else if (gameState === 'lost' && !isTournamentMode) {
              const timer = setTimeout(() => setupGame(generateQuizQuestion()), 2000);
              return () => clearTimeout(timer);
          }
      }
  }, [gameState, isTournamentMode, playerPosition, enemyPosition, scoreSent, tournament, setupGame]);


  if (!question) {
    return <div>Carregant la masmorra...</div>;
  }
  
  const getButtonClass = (option: number) => {
    if (answerStatus === 'unanswered') return 'bg-slate-100 hover:bg-indigo-100 border-slate-200 text-slate-700';
    if (option === question.correctAnswer) return 'bg-emerald-500 text-white border-emerald-500 scale-105';
    if (answerStatus === 'incorrect' && option !== question.correctAnswer) return 'bg-rose-500 text-white border-rose-500';
    return 'bg-slate-100 text-slate-700 opacity-50 border-slate-200';
  };

  return (
    <GameShell title="La Fuga del Castell" score={score} onBack={onBack}>
      <div className="relative">
        <div className="w-full bg-slate-800 rounded-lg p-6 border-4 border-stone-600 text-white mb-6">
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
                <span>Distància a la sortida: <span className="font-bold text-amber-300">{Math.max(0, TREASURE_POS - playerPosition)}m</span></span>
                <span>Distància del monstre: <span className="font-bold text-rose-400">{Math.max(0, playerPosition - enemyPosition)}m</span></span>
            </div>
            {/* Progress Bar Track */}
            <div className="relative h-10 w-full bg-stone-600 rounded-full border-2 border-stone-700 flex items-center">
                {/* Player and Enemy markers */}
                <div className="absolute top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ease-out" style={{ left: `calc(${Math.min(100, (enemyPosition / TREASURE_POS) * 100)}% - 20px)`}}>👹</div>
                <div className="absolute top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ease-out" style={{ left: `calc(${(playerPosition / TREASURE_POS) * 100}% - 20px)` }}><div style={{transform: 'scaleX(-1)'}}>🤺</div></div>
                <div className="absolute top-1/2 -translate-y-1/2 text-4xl" style={{ right: "-10px" }}>🚪</div>
            </div>
        </div>
        
         {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center animate-fade-in z-10 rounded-lg" role="status" aria-live="polite">
                <h3 className={`text-5xl font-bold mb-2 ${gameState === 'won' ? 'text-amber-400' : 'text-rose-500'}`}>{gameState === 'won' ? 'Has escapat!' : 'Atrapat!'}</h3>
                {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
                {!isTournamentMode && gameState === 'won' && <p className="text-xl text-white mb-6">Puntuació final: {score}</p>}
                {!isTournamentMode && gameState === 'won' && <button onClick={() => setupGame(generateQuizQuestion())} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"><ReplayIcon /> <span>Tornar a jugar</span></button>}
            </div>
        )}

        {gameState === 'playing' && (
        <div className="text-center mt-6 animate-fade-in">
            <p className="text-lg text-slate-600 mb-2">Converteix:</p>
            <p className="text-3xl font-bold mb-6">
                {question.fromValue.toLocaleString('ca-ES')} {question.fromUnit.symbol} <span className="text-indigo-500">a</span> {question.toUnit.symbol}
            </p>

            <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
                <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={answerStatus !== 'unanswered'}
                className={`p-4 rounded-lg text-xl font-semibold transition-all duration-300 transform border ${getButtonClass(option)}`}
                >
                {option.toLocaleString('ca-ES')}
                </button>
            ))}
            </div>
        </div>
        )}
      </div>
    </GameShell>
  );
};

export default CastleEscapeGame;