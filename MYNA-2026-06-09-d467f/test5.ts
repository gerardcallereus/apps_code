import { GameEngine } from './src/game/Engine.js';
import Matter from 'matter-js';

(global as any).window = {
    __EDITOR_TEMP_BODIES: [
        { label: 'cement', x: 500, y: 700, w: 200, h: 50, isStatic: true, isSensor: false }
    ]
};

const engine = new GameEngine('editor_temp' as any);

console.log("Adding Editor Temp bodies! Length:");
console.log(engine.engine.world.bodies.length);

const bodies = engine.engine.world.bodies;
bodies.forEach(b => {
    console.log(`[${b.label}] x:${b.position.x} y:${b.position.y} width:${b.bounds.max.x - b.bounds.min.x}`);
});

