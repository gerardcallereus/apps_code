import { GameEngine } from './src/game/Engine.js';
import { render } from './src/game/Renderer.js';

const engine = new GameEngine('wheel');

let ops = 0;
const mockCtx = {
    translate: () => {},
    restore: () => {},
    save: () => {},
    clearRect: () => {},
    beginPath: () => {},
    rect: () => {},
    clip: () => {},
    moveTo: () => {},
    lineTo: () => {},
    fill: () => {},
    stroke: () => {},
    arc: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    measureText: () => ({ width: 10 }),
    rotate: () => {},
    transform: () => {},
    scale: () => {},
    roundRect: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    setLineDash: () => {},
    ellipse: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {}
} as any;

try {
    render(mockCtx, engine);
    console.log("RENDER SUCCESS!");
} catch (e) {
    console.error("RENDER FAILED:", e);
}
