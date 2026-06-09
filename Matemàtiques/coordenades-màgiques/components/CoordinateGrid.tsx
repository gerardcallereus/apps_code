import React, { useMemo } from 'react';
import { Point, GameStatus } from '../types';
import { StarIcon, CrossIcon } from './Icons';

interface CoordinateGridProps {
  gridMin: number;
  gridMax: number;
  targetPosition: Point;
  userGuess: Point | null;
  status: GameStatus | string;
  visiblePoints?: Point[] | null;
  connectionPoints?: Point[] | null;
  onGridClick?: (point: Point) => void;
  isShapeClosed?: boolean;
}

const CoordinateGrid: React.FC<CoordinateGridProps> = ({
  gridMin,
  gridMax,
  targetPosition,
  userGuess,
  status,
  visiblePoints,
  connectionPoints,
  onGridClick,
  isShapeClosed,
}) => {
  const svgSize = 500;
  const padding = 30;
  const contentSize = svgSize - 2 * padding;
  const gridSize = gridMax - gridMin;
  const cellSize = contentSize / gridSize;

  const toSvgCoords = (p: Point): Point => {
    const x = padding + (p.x - gridMin) * cellSize;
    const y = padding + (gridMax - p.y) * cellSize;
    return { x, y };
  };

  const fromSvgCoords = (svgPoint: { x: number; y: number }): Point => {
    const x = Math.round((svgPoint.x - padding) / cellSize + gridMin);
    const y = Math.round(gridMax - (svgPoint.y - padding) / cellSize);
    return { x, y };
  };

  const handleGridClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onGridClick) return;

    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const gridPoint = fromSvgCoords(svgPoint);

    if (gridPoint.x >= gridMin && gridPoint.x <= gridMax && gridPoint.y >= gridMin && gridPoint.y <= gridMax) {
      onGridClick(gridPoint);
    }
  };

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = gridMin; i <= gridMax; i++) {
      lines.push(
        <line
          key={`v-${i}`}
          x1={toSvgCoords({ x: i, y: 0 }).x} y1={padding}
          x2={toSvgCoords({ x: i, y: 0 }).x} y2={svgSize - padding}
          className={i === 0 ? 'stroke-slate-500' : 'stroke-slate-200'}
          strokeWidth={i === 0 ? 1.5 : 0.5}
        />
      );
      lines.push(
        <line
          key={`h-${i}`}
          x1={padding} y1={toSvgCoords({ x: 0, y: i }).y}
          x2={svgSize - padding} y2={toSvgCoords({ x: 0, y: i }).y}
          className={i === 0 ? 'stroke-slate-500' : 'stroke-slate-200'}
          strokeWidth={i === 0 ? 1.5 : 0.5}
        />
      );
    }
    return lines;
  }, [gridMin, gridMax]);

  const labels = useMemo(() => {
    const lbls = [];
    for (let i = gridMin; i <= gridMax; i++) {
      if (i !== 0) {
        lbls.push(
          <text
            key={`lx-${i}`}
            x={toSvgCoords({ x: i, y: 0 }).x} y={toSvgCoords({ x: 0, y: 0 }).y + 15}
            className="text-xs fill-slate-500" textAnchor="middle"
          >
            {i}
          </text>
        );
        lbls.push(
          <text
            key={`ly-${i}`}
            x={toSvgCoords({ x: 0, y: 0 }).x - 12} y={toSvgCoords({ x: 0, y: i }).y}
            className="text-xs fill-slate-500" textAnchor="end" dominantBaseline="middle"
          >
            {i}
          </text>
        );
      }
    }
    lbls.push(<text key="x-axis" x={svgSize - padding + 10} y={toSvgCoords({ x: 0, y: 0 }).y + 5} className="text-sm font-bold fill-slate-700">X</text>);
    lbls.push(<text key="y-axis" x={toSvgCoords({ x: 0, y: 0 }).x - 5} y={padding-10} className="text-sm font-bold fill-slate-700">Y</text>);
    return lbls;
  }, [gridMin, gridMax]);

  const targetSvgPos = toSvgCoords(targetPosition);
  const guessSvgPos = userGuess ? toSvgCoords(userGuess) : null;
  const connectionLines = useMemo(() => {
    if (!connectionPoints || connectionPoints.length < 2) return null;
    const lines = [];
    for (let i = 0; i < connectionPoints.length - 1; i++) {
      const p1 = toSvgCoords(connectionPoints[i]);
      const p2 = toSvgCoords(connectionPoints[i + 1]);
      lines.push(
        <line
          key={`conn-${i}`}
          x1={p1.x} y1={p1.y}
          x2={p2.x} y2={p2.y}
          className="stroke-cyan-400"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    if (isShapeClosed && connectionPoints.length > 2) {
      const p1 = toSvgCoords(connectionPoints[connectionPoints.length - 1]);
      const p2 = toSvgCoords(connectionPoints[0]);
      lines.push(
        <line
          key={`conn-close`}
          x1={p1.x} y1={p1.y}
          x2={p2.x} y2={p2.y}
          className="stroke-cyan-400"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    return lines;
  }, [connectionPoints, isShapeClosed]);


  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className={`w-full h-auto ${onGridClick ? 'cursor-pointer' : ''}`}
        onClick={handleGridClick}
      >
        {gridLines}
        {labels}
        {connectionLines}
        
        {visiblePoints?.map((p, index) => {
            const pos = toSvgCoords(p);
            return (
                <foreignObject
                    key={`vp-${index}`}
                    x={pos.x - cellSize}
                    y={pos.y - cellSize}
                    width={cellSize * 2}
                    height={cellSize * 2}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <StarIcon className="w-1/2 h-1/2 text-purple-500 drop-shadow-lg" />
                    </div>
                </foreignObject>
            )
        })}

        {connectionPoints?.map((p, index) => {
            const pos = toSvgCoords(p);
            return (
                <circle
                    key={`cp-${index}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={cellSize / 4}
                    className="fill-cyan-400"
                />
            )
        })}

        {status === 'correct' && (
          <foreignObject
            x={targetSvgPos.x - cellSize * 0.7}
            y={targetSvgPos.y - cellSize * 0.7}
            width={cellSize * 1.4}
            height={cellSize * 1.4}
          >
            <div className="w-full h-full flex items-center justify-center">
              <StarIcon className="w-full h-full text-yellow-400 animate-pulse drop-shadow-lg" />
            </div>
          </foreignObject>
        )}

        {status === 'incorrect' && guessSvgPos && (
          <foreignObject
            x={guessSvgPos.x - cellSize * 0.7}
            y={guessSvgPos.y - cellSize * 0.7}
            width={cellSize * 1.4}
            height={cellSize * 1.4}
          >
             <div className="w-full h-full flex items-center justify-center">
                <CrossIcon className="w-full h-full text-red-500 drop-shadow-lg" />
             </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default CoordinateGrid;