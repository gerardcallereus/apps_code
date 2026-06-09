import { GameEngine } from './src/game/Engine.js';
import Matter from 'matter-js';

const engine = new GameEngine('wheel');

console.log("Player Y before:", engine.playerBody.position.y);
for (let i = 0; i < 100; i++) {
   Matter.Engine.update(engine.engine, 1000/60);
}
console.log("Player Y after 100 ticks:", engine.playerBody.position.y);
for (let i = 0; i < 100; i++) {
   Matter.Engine.update(engine.engine, 1000/60);
}
console.log("Player Y after 200 ticks:", engine.playerBody.position.y);
