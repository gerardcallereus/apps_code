import { GameEngine } from './src/game/Engine.js';
import Matter from 'matter-js';

const engine = new GameEngine('wheel');
const bodies = Matter.Composite.allBodies(engine.engine.world);

console.log("Total bodies:", bodies.length);
bodies.forEach(b => {
    if (b.label === 'player' || b.label === 'cement') {
        console.log(`[${b.label}] x:${b.position.x} y:${b.position.y} width:${b.bounds.max.x - b.bounds.min.x}`);
        console.log(`      isStatic: ${b.isStatic}, isSensor: ${b.isSensor}`);
    }
});
