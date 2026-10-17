import { GameEngine } from './src/game/Engine.js';
console.log("Creating Engine...");
try {
  const engine = new GameEngine('wheel');
  console.log("Success! Bodies:", engine.engine.world.bodies.length);
} catch (e) {
  console.error("ERROR:");
  console.error(e);
}
