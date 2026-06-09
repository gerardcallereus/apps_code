import Matter from 'matter-js';
import { InputState } from './types';
import { MachineType } from './levels';

export class GameEngine {
    machineId: MachineType;
    engine: Matter.Engine;
    playerBody!: Matter.Body;
    
    playerState = { 
        isGrounded: false, 
        facingRight: true, 
        deadTimer: 0, 
        finished: false, 
        activeDialog: null as string | null,
        activeInGameQuiz: null as string | null,
        isCrouching: false,
        jumpCooldown: 0,
        isMoving: false
    };

    state: 'playing' | 'gameover' | 'quiz' | 'history' = 'playing';
    doorBodies = new Map<string, Matter.Body>();
    spawnX = 200;
    spawnY = 200;
    
    signs: { id: string, x: number, y: number, w: number, h: number, triggered: boolean }[] = [];

    constructor(machineId: MachineType) {
        this.machineId = machineId;
        this.engine = Matter.Engine.create({
            gravity: { x: 0, y: 1.5, scale: 0.001 },
            positionIterations: 8,
            velocityIterations: 8
        });
        this.reset();
    }

    reset() {
        Matter.World.clear(this.engine.world, false);
        Matter.Engine.clear(this.engine);
        
        this.playerState = { isGrounded: false, facingRight: true, deadTimer: 0, finished: false, activeDialog: null, activeInGameQuiz: null, isCrouching: false, jumpCooldown: 0, isMoving: false };
        this.signs = [];
        this.doorBodies.clear();
        
        const bodies: Matter.Body[] = [];
        const world = this.engine.world;
        
        if (this.machineId === ('editor_temp' as any)) {
            const editorData = (window as any).__EDITOR_TEMP_BODIES;
            if (editorData) {
                const newBodies = editorData.map((d: any) => {
                    if (d.label && d.label.startsWith('sign:')) {
                        const signId = d.label.split(':')[1];
                        this.signs.push({ id: signId, x: d.x, y: d.y, w: d.w || 40, h: d.h || 40, triggered: false });
                    }
                    
                    if (d.label === 'enemy' || d.circleRadius) {
                        return Matter.Bodies.circle(d.x, d.y, d.circleRadius || 20, {
                            isSensor: d.isSensor, isStatic: d.isStatic, label: d.label, plugin: d.plugin
                        });
                    } else if (d.label === 'stone') {
                        if (d.plugin?.customVertices) {
                             let tempBody;
                             try {
                                 tempBody = Matter.Bodies.fromVertices(d.x, d.y, [d.plugin.customVertices]);
                             } catch(e) {
                                 tempBody = null;
                             }
                             if (!tempBody) {
                                 tempBody = Matter.Bodies.polygon(d.x, d.y, d.plugin?.sides || 6, (d.w || 60) / 2);
                             } else {
                                 const boundsW = tempBody.bounds.max.x - tempBody.bounds.min.x || 1;
                                 const boundsH = tempBody.bounds.max.y - tempBody.bounds.min.y || 1;
                                 Matter.Body.scale(tempBody, d.w / boundsW, d.h / boundsH);
                             }
                             tempBody.friction = d.friction;
                             tempBody.density = d.density;
                             tempBody.plugin = d.plugin;
                             Matter.Body.setStatic(tempBody, d.isStatic);
                             tempBody.isSensor = d.isSensor;
                             if (d.angle) Matter.Body.setAngle(tempBody, d.angle);
                             tempBody.label = d.label;
                             return tempBody;
                        }
                        return Matter.Bodies.polygon(d.x, d.y, d.plugin?.sides || 6, (d.w || 60) / 2, {
                            isSensor: d.isSensor, isStatic: d.isStatic, label: d.label, angle: d.angle || 0, friction: d.friction, density: d.density, plugin: d.plugin
                        });
                    } else {
                        let rw = typeof d.w === 'number' && !isNaN(d.w) ? d.w : 10;
                        let rh = typeof d.h === 'number' && !isNaN(d.h) ? d.h : 10;
                        let rx = typeof d.x === 'number' && !isNaN(d.x) ? d.x : 0;
                        let ry = typeof d.y === 'number' && !isNaN(d.y) ? d.y : 0;
                        return Matter.Bodies.rectangle(rx, ry, rw, rh, {
                            isSensor: d.isSensor, isStatic: d.isStatic, label: d.label, angle: d.angle || 0, friction: d.friction, plugin: d.plugin
                        });
                    }
                }).filter(Boolean);
                Matter.Composite.add(world, newBodies);
                
                // Boundaries to keep player in the map
                Matter.Composite.add(world, [
                    Matter.Bodies.rectangle(50, 400, 100, 2000, { isStatic: true, label: 'boundary' }),
                    Matter.Bodies.rectangle(24000 + 800, 400, 100, 2000, { isStatic: true, label: 'boundary' }),
                    Matter.Bodies.rectangle(10000, 2000, 24000, 100, { isStatic: true, label: 'void_floor', isSensor: true })
                ]);
                
                this.spawnX = 200;
                this.spawnY = 200;
                this.playerBody = Matter.Bodies.rectangle(this.spawnX, this.spawnY, 24, 34, {
                     label: 'player', density: 0.02, inertia: Infinity, friction: 0.2, frictionAir: 0.01, restitution: 0, chamfer: { radius: 6 }
                });
                Matter.Composite.add(world, this.playerBody);
                Matter.Events.on(this.engine, 'collisionStart', this.handleCollisions.bind(this));
                this.state = 'playing';
                return;
            }
        }
        
        let curX = 600;
        
        let groundLabel = 'cement';
        let groundFriction = 1.0;
        let groundSegments: {start: number, end: number}[] = [{ start: -2000, end: 24000 }];
        
        const addPit = (startX: number, width: number) => {
            const pitEnd = startX + width;
            const newSegs = [];
            for (const seg of groundSegments) {
                if (seg.end <= startX || seg.start >= pitEnd) {
                    newSegs.push(seg);
                } else {
                    if (seg.start < startX - 2) newSegs.push({ start: seg.start, end: startX - 2 }); // gap margin
                    if (seg.end > pitEnd + 2) newSegs.push({ start: pitEnd + 2, end: seg.end });
                }
            }
            groundSegments = newSegs;
        };

        const generatePlatformerSection = (startX: number) => {
            const pitStart = startX + 600; // Lots of running space before pit
            addPit(pitStart, 1200); // 1200 wide pit
            
            // Generate some static jumping platforms (pillars) in the pit
            // Vary widths and heights for difficulty
            bodies.push(Matter.Bodies.rectangle(pitStart + 200, 820, 80, 140, { 
                isStatic: true, label: groundLabel, friction: groundFriction 
            }));
            bodies.push(Matter.Bodies.rectangle(pitStart + 430, 780, 60, 100, { 
                isStatic: true, label: groundLabel, friction: groundFriction 
            }));
            bodies.push(Matter.Bodies.rectangle(pitStart + 660, 800, 90, 100, { 
                isStatic: true, label: groundLabel, friction: groundFriction 
            }));
            bodies.push(Matter.Bodies.rectangle(pitStart + 890, 750, 70, 70, { 
                isStatic: true, label: groundLabel, friction: groundFriction 
            }));
            bodies.push(Matter.Bodies.rectangle(pitStart + 1100, 790, 60, 120, { 
                isStatic: true, label: groundLabel, friction: groundFriction 
            }));

            // Add dynamic physics objects (stones/walls) in the pit
            bodies.push(Matter.Bodies.polygon(pitStart + 200, 700, Math.floor(Math.random() * 4) + 3, Math.random() * 15 + 15, { label: 'stone', density: 0.005, friction: 0.8 }));
            bodies.push(Matter.Bodies.polygon(pitStart + 660, 650, Math.floor(Math.random() * 4) + 3, Math.random() * 15 + 15, { label: 'stone', density: 0.005, friction: 0.8 }));
            
            // Add an enemy past the pit before the next element
            bodies.push(Matter.Bodies.circle(pitStart + 1600, 720, 20, { 
                 isSensor: true, isStatic: true, label: 'enemy', 
                 plugin: { origX: pitStart + 1600, origY: 720, range: 300, speed: 0.0015, axis: 'x', isEnemy: true }
            }));
            
            return pitStart + 2000; // Return X coordinate past the platforming zone
        };

        if (this.machineId === 'wheel') {
            groundLabel = 'cement'; groundFriction = 1.0;
            
            const shapes = [
                { id: 'sign_intro', sides: -1, shape: 'none' },
                { id: 'sign_triangle', sides: 3, shape: 'polygon' },
                { id: 'sign_square', sides: 4, shape: 'polygon' },
                { id: 'sign_pentagon', sides: 5, shape: 'polygon' },
                { id: 'sign_hexagon', sides: 6, shape: 'polygon' },
                { id: 'sign_octagon', sides: 8, shape: 'polygon' },
                { id: 'sign_decagon', sides: 10, shape: 'polygon' },
                { id: 'sign_dodecagon', sides: 12, shape: 'polygon' },
                { id: 'sign_hexadecagon', sides: 16, shape: 'polygon' },
                { id: 'sign_wheel', sides: 0, shape: 'circle' }
            ];

            for (let i = 0; i < shapes.length; i++) {
                const config = shapes[i];
                this.signs.push({ id: config.id, x: curX, y: 730, w: 60, h: 60, triggered: false });
                bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:${config.id}`, isSensor: true }));
                
                // Add a history sign every shape, spaced well
                if (i <= 8) {
                    const hId = i;
                    this.signs.push({ id: `sign_hist_${hId}`, x: curX + 250, y: 730, w: 60, h: 60, triggered: false });
                    bodies.push(Matter.Bodies.rectangle(curX + 250, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_${hId}`, isSensor: true }));
                }

                if (config.shape === 'none') {
                    curX = generatePlatformerSection(curX + 200); continue;
                }
                const shapeX = curX + 500; // Increased distance from sign
                const radius = 35; // reduced radius so player hits higher up
                let shapeBody;
                if (config.shape === 'circle') {
                    shapeBody = Matter.Bodies.circle(shapeX, 750 - radius, radius, { label: 'wheel', friction: 10.0, density: 0.007, restitution: 0.2 });
                } else {
                    const apothem = radius * Math.cos(Math.PI / config.sides);
                    shapeBody = Matter.Bodies.polygon(shapeX, 750 - apothem, config.sides, radius, { 
                        label: 'wood', friction: 10.0, frictionStatic: 20.0, density: 0.007, restitution: 0.0, angle: Math.PI / 2 - (Math.PI / config.sides)
                    }); 
                }
                bodies.push(shapeBody);
                
                const wallX = shapeX + 400;
                for (let row = 0; row < 7; row++) {
                    for (let col = 0; col < 2; col++) {
                        // Lighter stones for wall so they fall easily
                        bodies.push(Matter.Bodies.rectangle(wallX + col * 30, 735 - row * 30, 30, 30, { label: 'stone', friction: 0.7, density: 0.0005 }));
                    }
                }
                
                // Add some ramps or stairs for dynamism
                let dynX = wallX + 300;
                if (i % 2 === 0) {
                     // Stairs
                     bodies.push(Matter.Bodies.rectangle(dynX + 50, 750 + 20, 100, 40, { isStatic: true, label: groundLabel }));
                     bodies.push(Matter.Bodies.rectangle(dynX + 150, 750 + 10, 100, 60, { isStatic: true, label: groundLabel }));
                     dynX += 300;
                } else {
                     // Ramp
                     bodies.push(Matter.Bodies.rectangle(dynX + 100, 750 + 10, 250, 40, { isStatic: true, label: groundLabel, angle: Math.PI / 8 }));
                     dynX += 300;
                }
                
                curX = dynX + 400; // lots of space
                
                if (i % 3 === 2) {
                    // more space before platformer
                    curX += 300;
                    curX = generatePlatformerSection(curX);
                    curX += 400; // space after it
                }
            }
        } 
        else if (this.machineId === 'lever') {
            groundLabel = 'sand'; groundFriction = 0.5;
            
            this.signs.push({ id: 'sign_intro', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_intro`, isSensor: true }));

            // History 0
            curX = generatePlatformerSection(curX + 600);
            this.signs.push({ id: 'sign_hist_0', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_0`, isSensor: true }));

            // Quiz door 1 (before catapult)
            curX += 500;
            this.signs.push({ id: 'quiz_door_0', x: curX - 100, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 100, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_0`, isSensor: true }));
            
            curX = generatePlatformerSection(curX + 400);
            
            this.signs.push({ id: 'sign_hist_2', x: curX + 200, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX + 200, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_2`, isSensor: true }));
            
            this.signs.push({ id: 'sign_hist_3', x: curX + 600, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX + 600, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_3`, isSensor: true }));
            
            (this as any).catapultX = curX + 1100;
            
            this.setupCatapult(200, 30); // Default

            curX = (this as any).catapultX + 1200;
            curX = generatePlatformerSection(curX);

            this.signs.push({ id: 'sign_hist_1', x: curX + 300, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX + 300, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_1`, isSensor: true }));
            
            curX = generatePlatformerSection(curX + 600);
            
            this.signs.push({ id: 'sign_hist_4', x: curX + 200, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX + 200, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_4`, isSensor: true }));

            this.signs.push({ id: 'sign_hist_5', x: curX + 600, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX + 600, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_5`, isSensor: true }));

            curX += 1000;
        }
        else if (this.machineId === 'inclined_plane') {
            groundLabel = 'snow'; groundFriction = 0.1;
            
            this.signs.push({ id: 'sign_intro', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_intro`, isSensor: true }));

            // Quiz door 0 (before Ramp 1)
            curX = generatePlatformerSection(curX + 600);
            
            this.signs.push({ id: 'quiz_door_0', x: curX - 150, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 150, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_0`, isSensor: true }));

            // Gentle Slope (Ramp 1)
            curX += 200;
            this.signs.push({ id: 'sign_1', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_1`, isSensor: true }));
            
            let startX1 = curX + 400;
            const h1 = 200;
            const length1 = 1000;
            const w1 = Math.sqrt(length1 * length1 - h1 * h1);
            const angle1Rad = Math.asin(h1/length1);
            const ramp1 = Matter.Bodies.rectangle(startX1 + w1/2, 750 - h1/2 + 10, length1, 20, { 
                isStatic: true, angle: -angle1Rad, label: 'ramp', friction: 0.2,
                plugin: { startX: startX1, w: w1, h: h1, l: length1 }
            });
            bodies.push(ramp1);
            bodies.push(Matter.Bodies.rectangle(startX1 + 100, 750 - 50, 40, 40, { 
                label: 'physics_box', friction: 0.01, density: 0.005,
                plugin: { mass: 50, h: h1/100, l: length1/100 }
            }));
            // Platform top
            bodies.push(Matter.Bodies.rectangle(startX1 + w1 + 100, 750 - h1 + 10, 200, 20, { isStatic: true, label: 'stone', friction: 0.2 }));
            bodies.push(Matter.Bodies.circle(startX1 + w1 + 100, 750 - h1 - 5, 20, { isStatic: true, label: 'goal_circle', isSensor: true }));

            // Drop back to ground
            bodies.push(Matter.Bodies.rectangle(startX1 + w1 + 250, 750 - h1/2 + 10, 100, 20, { isStatic: true, label: 'stone', angle: Math.PI / 4}));

            // History sign 0 before Quiz door
            curX = generatePlatformerSection(startX1 + w1 + 350);
            
            this.signs.push({ id: 'sign_hist_0', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_0`, isSensor: true }));

            // Quiz door 1 (before Ramp 2)
            curX += 300;
            this.signs.push({ id: 'quiz_door_1', x: curX - 150, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 150, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_1`, isSensor: true }));

            // Steep Slope (Ramp 2)
            curX += 400;
            let startX2 = curX;
            this.signs.push({ id: 'sign_2', x: startX2 - 200, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(startX2 - 200, 730, 40, 40, { isStatic: true, label: `sign:sign_2`, isSensor: true }));
            
            const h2 = 300;
            const length2 = 500;
            const w2 = 400; // 3-4-5 triangle
            const angle2Rad = Math.asin(h2/length2);
            const ramp2 = Matter.Bodies.rectangle(startX2 + w2/2, 750 - h2/2 + 10, length2, 20, { 
                isStatic: true, angle: -angle2Rad, label: 'ramp', friction: 0.2,
                plugin: { startX: startX2, w: w2, h: h2, l: length2 }
            });
            bodies.push(ramp2);
            bodies.push(Matter.Bodies.rectangle(startX2 + 50, 750 - 50, 40, 40, { 
                label: 'physics_box', friction: 0.01, density: 0.005,
                plugin: { mass: 50, h: h2/100, l: length2/100 }
            }));
            bodies.push(Matter.Bodies.rectangle(startX2 + w2 + 100, 750 - h2 + 10, 200, 20, { isStatic: true, label: 'stone', friction: 0.2 }));
            bodies.push(Matter.Bodies.circle(startX2 + w2 + 100, 750 - h2 - 5, 20, { isStatic: true, label: 'goal_circle', isSensor: true }));
            
            // Drop back to ground
            bodies.push(Matter.Bodies.rectangle(startX2 + w2 + 250, 750 - h2/2 + 10, 100, 20, { isStatic: true, label: 'stone', angle: Math.PI / 4}));

            curX = generatePlatformerSection(startX2 + w2 + 350);

            // History sign 1
            this.signs.push({ id: 'sign_hist_1', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_1`, isSensor: true }));

            // Quiz door 2 (before Ramp 3)
            curX += 400;
            this.signs.push({ id: 'quiz_door_2', x: curX - 150, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 150, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_2`, isSensor: true }));

            // SUPER LONG RAMP (Ramp 3)
            let startX3 = curX + 400;
            this.signs.push({ id: 'sign_3', x: startX3 - 200, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(startX3 - 200, 730, 40, 40, { isStatic: true, label: `sign:sign_3`, isSensor: true }));
            
            const h3 = 100;
            const length3 = 1000;
            const w3 = Math.sqrt(length3 * length3 - h3 * h3);
            const angle3Rad = Math.asin(h3/length3);
            const ramp3 = Matter.Bodies.rectangle(startX3 + w3/2, 750 - h3/2 + 10, length3, 20, { 
                isStatic: true, angle: -angle3Rad, label: 'ramp', friction: 0.2,
                plugin: { startX: startX3, w: w3, h: h3, l: length3 }
            });
            bodies.push(ramp3);
            bodies.push(Matter.Bodies.rectangle(startX3 + 50, 750 - 50, 40, 40, { 
                label: 'physics_box', friction: 0.01, density: 0.005,
                plugin: { mass: 50, h: h3/100, l: length3/100 }
            }));
            bodies.push(Matter.Bodies.rectangle(startX3 + w3 + 100, 750 - h3 + 10, 200, 20, { isStatic: true, label: 'stone', friction: 0.2 }));
            bodies.push(Matter.Bodies.circle(startX3 + w3 + 100, 750 - h3 - 5, 20, { isStatic: true, label: 'goal_circle', isSensor: true }));

            // Drop back down 
            bodies.push(Matter.Bodies.rectangle(startX3 + w3 + 250, 750 - h3/2 + 10, 100, 20, { isStatic: true, label: 'stone', angle: Math.PI / 4}));

            curX = generatePlatformerSection(startX3 + w3 + 350);

            // History sign 2
            this.signs.push({ id: 'sign_hist_2', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_2`, isSensor: true }));

            curX += 600;
        }
        else if (this.machineId === 'pulley') {
            groundLabel = 'cement'; groundFriction = 1.0;
            
            // Intro
            this.signs.push({ id: 'sign_intro', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_intro`, isSensor: true }));

            curX = generatePlatformerSection(curX + 600);
            
            // Crane 1: Simple
            const crane1X = curX;
            const cb1 = Matter.Bodies.rectangle(crane1X, 750, 200, 20, { isStatic: true, label: 'crane_base', collisionFilter: { mask: 0 } });
            bodies.push(cb1); // base
            bodies.push(Matter.Bodies.rectangle(crane1X, 350, 60, 800, { isStatic: true, label: 'crane_tower', collisionFilter: { mask: 0 } })); // tower
            const arm1 = Matter.Bodies.rectangle(crane1X + 150, 100, 400, 40, { isStatic: true, label: 'crane_arm', collisionFilter: { mask: 0 } });
            bodies.push(arm1);
            
            // The hanging weight
            const w1 = Matter.Bodies.rectangle(crane1X + 300, 650, 60, 60, { 
                label: 'pulley_weight', 
                plugin: { n: 1, mass: 200 },
                friction: 0.1 
            });
            bodies.push(w1);
            Matter.World.add(world, Matter.Constraint.create({ bodyA: arm1, pointB: { x: 150, y: 20 }, bodyB: w1, length: 500, stiffness: 0.1, label: 'rope:crane1' }));
            bodies.push(Matter.Bodies.rectangle(crane1X - 100, 740, 60, 20, { isStatic: true, isSensor: true, label: 'btn:crane1' }));
            
            this.signs.push({ id: 'sign_1', x: crane1X - 250, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(crane1X - 250, 730, 40, 40, { isStatic: true, label: `sign:sign_1`, isSensor: true }));
            
            // Quiz door 1
            curX = generatePlatformerSection(crane1X + 500);
            
            this.signs.push({ id: 'quiz_door_0', x: curX - 100, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 100, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_0`, isSensor: true }));

            // Crane 2: Mobile Pulley (N=2)
            const crane2X = curX + 600;
            bodies.push(Matter.Bodies.rectangle(crane2X, 750, 200, 20, { isStatic: true, label: 'crane_base', collisionFilter: { mask: 0 } }));
            bodies.push(Matter.Bodies.rectangle(crane2X, 350, 60, 800, { isStatic: true, label: 'crane_tower', collisionFilter: { mask: 0 } }));
            const arm2 = Matter.Bodies.rectangle(crane2X + 150, 100, 400, 40, { isStatic: true, label: 'crane_arm', collisionFilter: { mask: 0 } });
            bodies.push(arm2);

            const w2 = Matter.Bodies.rectangle(crane2X + 300, 650, 80, 80, { 
                label: 'pulley_weight', 
                plugin: { n: 2, mass: 400 },
                friction: 0.1 
            });
            bodies.push(w2);
            Matter.World.add(world, Matter.Constraint.create({ bodyA: arm2, pointB: { x: 150, y: 20 }, bodyB: w2, length: 500, stiffness: 0.1, label: 'rope:crane2' }));
            bodies.push(Matter.Bodies.rectangle(crane2X - 100, 740, 60, 20, { isStatic: true, isSensor: true, label: 'btn:crane2' }));

            // Quiz door 2
            curX = generatePlatformerSection(crane2X + 500);
            
            this.signs.push({ id: 'quiz_door_1', x: curX - 100, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 100, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_1`, isSensor: true }));

            // Crane 3: Polispast (N=4)
            const crane3X = curX + 600;
            this.signs.push({ id: 'sign_3', x: crane3X - 250, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(crane3X - 250, 730, 40, 40, { isStatic: true, label: `sign:sign_3`, isSensor: true }));

            bodies.push(Matter.Bodies.rectangle(crane3X, 750, 200, 20, { isStatic: true, label: 'crane_base', collisionFilter: { mask: 0 } }));
            bodies.push(Matter.Bodies.rectangle(crane3X, 350, 60, 800, { isStatic: true, label: 'crane_tower', collisionFilter: { mask: 0 } }));
            const arm3 = Matter.Bodies.rectangle(crane3X + 150, 100, 400, 40, { isStatic: true, label: 'crane_arm', collisionFilter: { mask: 0 } });
            bodies.push(arm3);

            const w3 = Matter.Bodies.rectangle(crane3X + 300, 650, 100, 100, { 
                label: 'pulley_weight', 
                plugin: { n: 4, mass: 1000 },
                friction: 0.1 
            });
            bodies.push(w3);
            Matter.World.add(world, Matter.Constraint.create({ bodyA: arm3, pointB: { x: 150, y: 20 }, bodyB: w3, length: 500, stiffness: 0.1, label: 'rope:crane3' }));
            bodies.push(Matter.Bodies.rectangle(crane3X - 100, 740, 60, 20, { isStatic: true, isSensor: true, label: 'btn:crane3' }));

            // Quiz door 3
            curX = generatePlatformerSection(crane3X + 500);
            
            this.signs.push({ id: 'quiz_door_2', x: curX - 100, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX - 100, 730, 40, 40, { isStatic: true, label: `sign:quiz_door_2`, isSensor: true }));

            curX = generatePlatformerSection(curX + 200);

            // History 0
            this.signs.push({ id: 'sign_hist_0', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_hist_0`, isSensor: true }));

            curX += 400;
        }
        else {
            // General tiny map for others until they are implemented uniquely
            groundLabel = 'cement'; groundFriction = 1.0;
            this.signs.push({ id: 'sign_intro', x: curX, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX, 730, 40, 40, { isStatic: true, label: `sign:sign_intro`, isSensor: true }));
            
            this.signs.push({ id: 'sign_1', x: curX + 500, y: 730, w: 60, h: 60, triggered: false });
            bodies.push(Matter.Bodies.rectangle(curX + 500, 730, 40, 40, { isStatic: true, label: `sign:sign_1`, isSensor: true }));
            
            curX += 900;
        }

        // Convert ground segments into actual bodies
        for(const seg of groundSegments) {
            const w = seg.end - seg.start;
            if (w > 0) {
                 bodies.push(Matter.Bodies.rectangle(seg.start + w/2, 800, w, 100, { isStatic: true, label: groundLabel, friction: groundFriction, frictionStatic: groundFriction * 2 }));
            }
        }

        // Finish Line Zone
        bodies.push(Matter.Bodies.rectangle(curX + 200, 600, 100, 500, { isStatic: true, label: 'finish', isSensor: true }));
        this.signs.push({ id: 'finish', x: curX + 200, y: 730, w: 60, h: 60, triggered: false });

        // Boundaries to keep player in the map
        bodies.push(Matter.Bodies.rectangle(50, 400, 100, 2000, { isStatic: true, label: 'boundary' }));
        bodies.push(Matter.Bodies.rectangle(curX + 800, 400, 100, 2000, { isStatic: true, label: 'boundary' }));

        // Boundaries to catch falling players
        bodies.push(Matter.Bodies.rectangle(10000, 2000, 24000, 100, { isStatic: true, label: 'void_floor', isSensor: true }));

        this.spawnX = 200;
        this.spawnY = 200;
        this.playerBody = Matter.Bodies.rectangle(this.spawnX, this.spawnY, 24, 34, { 
            label: 'player', density: 0.02, inertia: Infinity, friction: 0.2, frictionAir: 0.01, restitution: 0, chamfer: { radius: 6 }
        });
        bodies.push(this.playerBody);

        console.log("ADDING BODIES:", bodies.length);
        Matter.World.add(world, bodies);
        Matter.Events.on(this.engine, 'collisionStart', this.handleCollisions.bind(this));
        
        this.state = 'playing';
    }

    handleCollisions(event: Matter.IEventCollision<Matter.Engine>) {
        for (const pair of event.pairs) {
            const a = pair.bodyA;
            const b = pair.bodyB;
            
            this.checkPlayerCollision(a, b);
            this.checkPlayerCollision(b, a);
        }
    }

    checkPlayerCollision(pBody: Matter.Body, other: Matter.Body) {
        if (pBody.label !== 'player') return;
        
        if (other.label === 'rava' || other.label === 'void_floor' || other.label === 'lava' || other.label === 'water') {
            this.killPlayer();
        } else if (other.label === 'finish') {
            this.playerState.finished = true;
            this.state = 'quiz';
        } else if (other.label.startsWith('sign:')) {
            // Unused via direct collision since sensor overlaps can be finicky. Handled in updatePlayer distance check.
        }
    }

    killPlayer() {
        if (this.playerState.deadTimer > 0) return;
        this.playerState.deadTimer = 1000;
        Matter.Body.setVelocity(this.playerBody, { x: 0, y: 0 });
    }

    openQuizDoor(doorId: string) {
        const door = this.doorBodies.get(doorId);
        if (door) {
            Matter.World.remove(this.engine.world, door);
            this.doorBodies.delete(doorId);
        }
        this.signs = this.signs.filter(s => s.id !== doorId);
        this.playerState.activeInGameQuiz = null;
    }

    setupCatapult(effortDist: number, counterweightMass: number) {
        const world = this.engine.world;
        // Clean up previous catapult objects
        const toRem = Matter.Composite.allBodies(world).filter(b => b.label.startsWith('catapult_') || b.label.startsWith('c_blocker:') || b.label.startsWith('btn:fire_') || b.label.startsWith('castle_'));
        Matter.World.remove(world, toRem);
        const consToRem = Matter.Composite.allConstraints(world).filter(c => c.label.startsWith('catapult_'));
        Matter.World.remove(world, consToRem);

        const catX = (this as any).catapultX || 1800; // location
        
        // Base
        const base = Matter.Bodies.rectangle(catX, 700, 120, 100, { isStatic: true, label: 'catapult_base' });
        
        // Arm length 800
        const arm = Matter.Bodies.rectangle(catX + 200, 640, 800, 20, { label: 'catapult_arm', density: 0.001, friction: 1.0, restitution: 0.1 });
        
        // Lip to hold rock at end of arm
        const lip = Matter.Bodies.rectangle(catX + 590, 610, 20, 40, { label: 'catapult_arm_lip', density: 0.001, friction: 1.0 });

        // Pivot
        Matter.World.add(world, Matter.Constraint.create({ 
            bodyA: base, 
            pointA: { x: 0, y: -50 }, 
            bodyB: arm, 
            pointB: { x: -200, y: 0 }, 
            stiffness: 1, 
            length: 0,
            label: 'catapult_pivot'
        }));
        
        // Attach lip to arm strictly
        Matter.World.add(world, Matter.Constraint.create({
            bodyA: arm,
            pointA: { x: 390, y: -10 },
            bodyB: lip,
            pointB: { x: 0, y: 20 },
            stiffness: 1,
            length: 0,
            label: 'catapult_lip_join'
        }));

        const pointAX = -200 - effortDist; 
        
        const counterweight = Matter.Bodies.rectangle(catX - effortDist, 600, 80, 80, { 
            label: 'catapult_weight', 
            density: counterweightMass / 3000, // Reduced density to heavily restrict flying speed
            plugin: { dist: effortDist, mass: counterweightMass },
            restitution: 0.1
        });
        
        Matter.World.add(world, Matter.Constraint.create({
            bodyA: arm,
            pointA: { x: pointAX, y: 0 }, 
            bodyB: counterweight,
            pointB: { x: 0, y: 0 },
            stiffness: 1, 
            length: 40,
            label: 'catapult_weight_rope'
        }));

        // Rock positioned perfectly inside arm and lip
        const rock = Matter.Bodies.circle(catX + 550, 580, 30, { label: 'catapult_rock', density: 0.005, restitution: 0.1, friction: 1.0 });
        
        // Suppress arm dropping beforehand
        const armBlocker = Matter.Bodies.rectangle(catX - effortDist, 740, 80, 100, { isStatic: true, label: `c_blocker:cat` });
        
        // Stop the arm from swinging past 45 degrees upwards
        const armStopper = Matter.Bodies.rectangle(catX - 300, 750, 40, 60, { isStatic: true, label: 'catapult_base' });
        
        const castleX = catX + 750; // closer than before, was 1100
        const castleParts = [];
        for(let r=0; r<4; r++) {
            for(let c=0; c<2; c++) {
                castleParts.push(Matter.Bodies.polygon(castleX + c*60, 720 - r*60, 4, 30, { label: 'castle_block', density: 0.001, restitution: 0.1 }));
            }
        }
        castleParts.push(Matter.Bodies.rectangle(castleX + 30, 720 - 4*60, 140, 20, { label: 'castle_block', density: 0.001, restitution: 0.1 }));
        
        castleParts.push(Matter.Bodies.circle(castleX + 30, 720 - 4*60 - 30, 25, { label: 'castle_king', density: 0.001, restitution: 0.1 }));

        Matter.World.add(world, [base, arm, lip, armStopper, counterweight, rock, armBlocker, ...castleParts]);
    }

    fireCatapult() {
        const blocker = Matter.Composite.allBodies(this.engine.world).find(b => b.label === `c_blocker:cat`);
        if (blocker) {
            Matter.World.remove(this.engine.world, blocker);
        }
    }

    update(delta: number, input: InputState) {
        if (this.state !== 'playing') return;
        
        (this as any).elapsedTime = ((this as any).elapsedTime || 0) + delta;
        const time = (this as any).elapsedTime;

        const checkGrounded = (body: Matter.Body) => {
            const tempBounds = body.bounds;
            return Matter.Query.region(this.engine.world.bodies, {
                min: { x: tempBounds.min.x + 4, y: tempBounds.max.y },
                max: { x: tempBounds.max.x - 4, y: tempBounds.max.y + 6 }
            }).some(b => !b.isSensor && b !== body);
        };
        
        this.playerState.isGrounded = checkGrounded(this.playerBody);

        let activeBtns = new Set<string>();
        for (const body of Matter.Composite.allBodies(this.engine.world)) {
             if (body.label.startsWith('btn:')) {
                  if (Matter.Collision.collides(this.playerBody, body)) {
                       activeBtns.add(body.label.split(':')[1]);
                  }
             }

             if (body.plugin && (body.label === 'moving_platform' || body.label === 'enemy')) {
                  const p = body.plugin;
                  const offset = Math.sin(time * p.speed) * p.range;
                  const targetX = p.axis === 'x' ? p.origX + offset : p.origX;
                  const targetY = p.axis === 'y' ? p.origY + offset : p.origY;
                  
                  // For platforms, use velocity so the player doesn't slip off
                  if (body.label === 'moving_platform') {
                       Matter.Body.setVelocity(body, {
                            x: (targetX - body.position.x) / (delta || 16) * 1000,
                            y: (targetY - body.position.y) / (delta || 16) * 1000
                       });
                  }
                  Matter.Body.setPosition(body, { x: targetX, y: targetY });

                  if (body.label === 'enemy' && Matter.Collision.collides(this.playerBody, body)) {
                       this.killPlayer();
                  }
             }
        }

        // Process ropes
        for (const constraint of Matter.Composite.allConstraints(this.engine.world)) {
             if (constraint.label && constraint.label.startsWith('rope:')) {
                  const targetBtn = constraint.label.split(':')[1];
                  if (activeBtns.has(targetBtn)) {
                       constraint.length = Math.max(80, constraint.length - delta * 0.4);
                  } else {
                       constraint.length = Math.min(500, constraint.length + delta * 0.4);
                  }
                  
                  // Stabilize horizontal swinging for pulleys for better realism
                  const w = constraint.bodyB;
                  if (w && w.label === 'pulley_weight' && constraint.bodyA) {
                       const anchorX = constraint.bodyA.position.x + constraint.pointA.x;
                       if (Math.abs(w.position.x - anchorX) > 2) {
                            const newX = anchorX + (w.position.x - anchorX) * 0.9;
                            Matter.Body.setPosition(w, { x: newX, y: w.position.y });
                            Matter.Body.setVelocity(w, { x: w.velocity.x * 0.9, y: w.velocity.y });
                       }
                  }
             }
        }

        // Process catapults
        for (const btn of activeBtns) {
            if (btn.startsWith('fire_')) {
                const catId = btn.split('_')[1];
                const blocker = Matter.Composite.allBodies(this.engine.world).find(b => b.label === `c_blocker:${catId}`);
                if (blocker) {
                    Matter.World.remove(this.engine.world, blocker);
                }
            }
        }

        this.updatePlayer(input, delta);

        const boxes = Matter.Composite.allBodies(this.engine.world).filter(b => b.label === 'physics_box');
        const goals = Matter.Composite.allBodies(this.engine.world).filter(b => b.label === 'goal_circle');
        for (const box of boxes) {
            if (box.isStatic) continue;
            for (const goal of goals) {
                const coll = Matter.Collision.collides(box, goal);
                if (coll) {
                    Matter.Body.setStatic(box, true);
                    Matter.Body.setPosition(box, { x: goal.position.x, y: goal.position.y - 20 });
                    if (box.plugin) box.plugin.reached = true;
                }
            }
        }
        
        Matter.Engine.update(this.engine, delta);
    }

    updatePlayer(input: InputState, delta: number) {
        if (this.playerState.deadTimer > 0) {
            this.playerState.deadTimer -= delta;
            if (this.playerState.deadTimer <= 0) {
                Matter.Body.setPosition(this.playerBody, { x: this.spawnX, y: this.spawnY });
                Matter.Body.setVelocity(this.playerBody, { x: 0, y: 0 });
            } else {
                Matter.Body.setPosition(this.playerBody, { x: -1000, y: -1000 }); 
            }
            return;
        }

        // Sign distance check
        let activeSign = null;
        let activeQuiz = null;
        for (const sign of this.signs) {
            const dx = this.playerBody.position.x - sign.x;
            const dy = this.playerBody.position.y - sign.y;
            if (Math.abs(dx) < 80 && Math.abs(dy) < 100) {
                if (sign.id.startsWith('quiz_door_')) {
                     activeQuiz = sign.id;
                } else {
                     activeSign = sign.id;
                     this.spawnX = sign.x;
                     this.spawnY = 500;
                }
            }
        }
        this.playerState.activeDialog = activeSign;
        this.playerState.activeInGameQuiz = activeQuiz;

        if (this.playerBody.position.y > 1500) {
            this.killPlayer();
        }

        this.playerState.isCrouching = input.down && this.playerState.isGrounded;

        let moveForce = this.playerState.isCrouching ? 0.0 : 0.08; // sharper acceleration
        // Reduce air lateral force significantly for realism, but allow some steering
        if (!this.playerState.isGrounded) {
             moveForce = 0.015;
        }
        
        let maxSpeed = this.playerState.isCrouching ? 0.0 : 6.0;
        if (!this.playerState.isGrounded) {
             maxSpeed = 5.5; // Cap air speed slightly below ground speed
        }
        
        if (input.left && !this.playerState.isCrouching) {
            if (this.playerBody.velocity.x > -maxSpeed) Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: -moveForce, y: 0 });
            this.playerState.facingRight = false;
            this.playerState.isMoving = true;
        } else if (input.right && !this.playerState.isCrouching) {
            if (this.playerBody.velocity.x < maxSpeed) Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: moveForce, y: 0 });
            this.playerState.facingRight = true;
            this.playerState.isMoving = true;
        } else {
            this.playerState.isMoving = false;
            if (this.playerState.isGrounded) {
                Matter.Body.setVelocity(this.playerBody, { x: this.playerBody.velocity.x * 0.70, y: this.playerBody.velocity.y }); // sharper friction
            } else {
                Matter.Body.setVelocity(this.playerBody, { x: this.playerBody.velocity.x * 0.95, y: this.playerBody.velocity.y });
            }
        }

        if (this.playerState.jumpCooldown > 0) {
            this.playerState.jumpCooldown -= delta;
        }

        if (input.up) {
             if (this.playerState.isGrounded && !this.playerState.isCrouching && this.playerState.jumpCooldown <= 0) {
                 Matter.Body.setPosition(this.playerBody, { x: this.playerBody.position.x, y: this.playerBody.position.y - 4 });
                 Matter.Body.setVelocity(this.playerBody, { x: this.playerBody.velocity.x, y: -9.5 }); 
                 this.playerState.isGrounded = false;
                 this.playerState.jumpCooldown = 250; 
             }
             // Sustain jump slightly if held
             else if (this.playerBody.velocity.y < 0 && this.playerState.jumpCooldown > 50) {
                 Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: 0, y: -0.0008 * this.playerBody.mass }); // better float
             }
        } else if (!input.up && this.playerBody.velocity.y < 0 && !this.playerState.isGrounded) {
             Matter.Body.setVelocity(this.playerBody, { x: this.playerBody.velocity.x, y: this.playerBody.velocity.y * 0.85 });
        }
        
        if (this.playerBody.velocity.y > 0) {
             Matter.Body.applyForce(this.playerBody, this.playerBody.position, { x: 0, y: 0.0015 * this.playerBody.mass }); // heavier fall
        }
    }
}


