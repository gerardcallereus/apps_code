require('ts-node').register();
const Engine = require('./src/game/Engine.ts').GameEngine;
try {
  let engine = new Engine('wheel');
  console.log("Success! Bodies:", engine.engine.world.bodies.length);
} catch (e) {
  console.error("ERROR:", e);
}
