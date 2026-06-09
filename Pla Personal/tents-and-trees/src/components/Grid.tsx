import React from 'react';
import { Tent, TreePine, Sprout } from 'lucide-react';
import { cn } from '../lib/utils';
import { CellState, Position } from '../lib/puzzle';

interface GridProps {
  size: number;
  trees: Position[];
  gridState: CellState[][];
  rowClues: number[];
  colClues: number[];
  onCellClick: (r: number, c: number) => void;
  onCellRightClick: (e: React.MouseEvent, r: number, c: number) => void;
}

export function Grid({ size, trees, gridState, rowClues, colClues, onCellClick, onCellRightClick }: GridProps) {
  const isTree = (r: number, c: number) => trees.some(t => t.r === r && t.c === c);

  // Calculate current tent counts
  const currentRowCounts = new Array(size).fill(0);
  const currentColCounts = new Array(size).fill(0);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gridState[r][c] === 'tent') {
        currentRowCounts[r]++;
        currentColCounts[c]++;
      }
    }
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: `auto repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `auto repeat(${size}, minmax(0, 1fr))`
        }}
      >
        {/* Top-left empty corner */}
        <div className="w-8 h-8 sm:w-12 sm:h-12"></div>

        {/* Column clues */}
        {colClues.map((clue, c) => (
          <div 
            key={`col-clue-${c}`} 
            className={cn(
              "flex items-center justify-center font-bold text-lg sm:text-xl",
              currentColCounts[c] === clue ? "text-green-600" : currentColCounts[c] > clue ? "text-red-500" : "text-gray-700"
            )}
          >
            {clue}
          </div>
        ))}

        {/* Rows */}
        {Array.from({ length: size }).map((_, r) => (
          <React.Fragment key={`row-${r}`}>
            {/* Row clue */}
            <div 
              className={cn(
                "flex items-center justify-center font-bold text-lg sm:text-xl w-8 h-8 sm:w-12 sm:h-12",
                currentRowCounts[r] === rowClues[r] ? "text-green-600" : currentRowCounts[r] > rowClues[r] ? "text-red-500" : "text-gray-700"
              )}
            >
              {rowClues[r]}
            </div>

            {/* Cells */}
            {Array.from({ length: size }).map((_, c) => {
              const tree = isTree(r, c);
              const state = gridState[r][c];

              return (
                <div
                  key={`cell-${r}-${c}`}
                  onClick={() => !tree && onCellClick(r, c)}
                  onContextMenu={(e) => !tree && onCellRightClick(e, r, c)}
                  className={cn(
                    "w-8 h-8 sm:w-12 sm:h-12 border-2 flex items-center justify-center rounded-md transition-colors",
                    tree ? "bg-green-100 border-green-300" : "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer"
                  )}
                >
                  {tree && <TreePine className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />}
                  {!tree && state === 'tent' && <Tent className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />}
                  {!tree && state === 'grass' && <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 opacity-70" />}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
