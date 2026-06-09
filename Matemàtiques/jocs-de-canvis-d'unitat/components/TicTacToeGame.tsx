import React from 'react';
import GameShell from './GameShell';

const TicTacToeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <GameShell title="Tic Tac Toe" score={0} onBack={onBack}>
            <div className="text-center">
                <h2 className="text-2xl text-white">Tic Tac Toe Game</h2>
                <p className="text-gray-400 mt-4">This game is not yet implemented.</p>
            </div>
        </GameShell>
    );
};

export default TicTacToeGame;
