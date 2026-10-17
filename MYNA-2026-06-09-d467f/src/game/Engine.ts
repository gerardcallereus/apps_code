import Matter from 'matter-js';
import { InputState } from './types';
import { MachineType } from './levels';

export interface MachineTelemetry {
    title: string;
    subtitle: string;
    formula: string;
    effortForce: number;
    loadForce: number;
    mechanicalAdvantage: number;
    efficiencyNote: string;
    canOperate: boolean;
    statusMessage: string;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
    gravity?: number;
}

export class GameEngine {
    machineId: MachineType;
    engine: Matter.Engine;
    playerBody!: Matter.Body;

    playerState = {
        isGrounded: false,
        wasGrounded: false,
        facingRight: true,
        deadTimer: 0,
        finished: false,
        activeDialog: 'sign_intro' as string | null,
        activeInGameQuiz: null as string | null,
        isCrouching: false,
        isPushing: false,
        jumpCooldown: 0,
        coyoteTimer: 0,
        isMoving: false,
        runCycle: 0,
        squashY: 1,
        starsCollected: 0,
        totalStars: 0,
        enemiesDefeated: 0,
    };

    state: 'playing' | 'gameover' | 'quiz' | 'history' = 'playing';
    doorBodies = new Map<string, Matter.Body>();
    mechGates = new Map<string, Matter.Body>();
    openedGates = new Set<string>();
    spawnX = 240;
    spawnY = 680;
    levelEndX = 4500;

    signs: { id: string; x: number; y: number; w: number; h: number; triggered: boolean }[] = [];
    collectibles: { id: string; x: number; y: number; collected: boolean }[] = [];
    particles: Particle[] = [];
    rockTrail: { x: number; y: number }[] = [];

    // =========================================================================
    // ⚙️ WHEEL PARAMETERS
    // =========================================================================
    wheelSides = 4;

    // =========================================================================
    // ⚖️ ANGRY BIRDS LEVER PARAMETERS
    // =========================================================================
    leverClass: 1 | 2 | 3 = 1;
    leverPivotX = 220;
    leverPivotY = 580;
    isAiming = false;
    aimDragX = 220;
    aimDragY = 580;
    leverShotsRemaining = 4;
    leverScore = 0;
    leverEnemiesRemaining = 3;
    activeProjectile: Matter.Body | null = null;
    castleWave = 1;

    // =========================================================================
    // 📐 INCLINED PLANE PARAMETERS
    // =========================================================================
    ramp2Length = 400;

    // =========================================================================
    // 🏗️ HARBOR CRANE PULLEY PARAMETERS
    // =========================================================================
    craneTrolleyX = 420;
    craneCableY = 460;
    pulleyStrands: 1 | 2 | 4 | 8 = 1;
    cargoLoadBody: Matter.Body | null = null;
    cargoMassKg = 800;
    cargoHooked = false;
    cargoDelivered = false;
    craneHookBody!: Matter.Body;

    elapsedTime = 0;
    windStrength = 1.0;

    constructor(machineId: MachineType) {
        this.machineId = machineId;
        this.engine = Matter.Engine.create({
            gravity: { x: 0, y: 1.4, scale: 0.001 },
            positionIterations: 8,
            velocityIterations: 8,
        });
        this.reset();
    }

    spawnParticles(
        x: number,
        y: number,
        count: number,
        color: string,
        speed = 3,
        radius = 4,
        gravity = 0.08
    ) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = (0.3 + Math.random() * 0.7) * speed;
            const maxLife = 300 + Math.random() * 450;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - Math.random() * 1.5,
                radius: radius * (0.6 + Math.random() * 0.6),
                color,
                alpha: 1,
                life: maxLife,
                maxLife,
                gravity,
            });
        }
    }

    reset() {
        Matter.World.clear(this.engine.world, false);
        Matter.Engine.clear(this.engine);

        this.playerState = {
            isGrounded: false,
            wasGrounded: false,
            facingRight: true,
            deadTimer: 0,
            finished: false,
            activeDialog: 'sign_intro',
            activeInGameQuiz: null,
            isCrouching: false,
            isPushing: false,
            jumpCooldown: 0,
            coyoteTimer: 0,
            isMoving: false,
            runCycle: 0,
            squashY: 1,
            starsCollected: 0,
            totalStars: 0,
            enemiesDefeated: 0,
        };

        this.signs = [];
        this.collectibles = [];
        this.particles = [];
        this.rockTrail = [];
        this.doorBodies.clear();
        this.mechGates.clear();
        this.openedGates.clear();
        this.activeProjectile = null;

        if (this.machineId === 'lever') {
            this.initAngryBirdsLever();
        } else if (this.machineId === 'pulley') {
            this.initHarborCranePulley();
        } else {
            this.initPlatformerLevel();
        }

        Matter.Events.on(this.engine, 'collisionStart', this.handleCollisions.bind(this));
        this.state = 'playing';
    }

    // =========================================================================
    // ⚖️ ANGRY BIRDS LEVER GAME MODE
    // =========================================================================
    initAngryBirdsLever() {
        const world = this.engine.world;
        this.levelEndX = 1200;
        this.leverShotsRemaining = 4;
        this.leverScore = 0;
        this.leverPivotX = 220;
        this.leverPivotY = 570;
        this.aimDragX = 220;
        this.aimDragY = 570;
        this.isAiming = false;
        this.playerState.activeDialog = 'sign_intro';

        const ground = Matter.Bodies.rectangle(700, 770, 1600, 240, {
            isStatic: true,
            label: 'cement',
            friction: 0.8,
        });

        const launcherBase = Matter.Bodies.rectangle(220, 650, 90, 80, {
            isStatic: true,
            label: 'wood',
            friction: 0.9,
        });

        this.spawnX = 110;
        this.spawnY = 680;
        this.playerBody = Matter.Bodies.rectangle(this.spawnX, this.spawnY, 26, 40, {
            label: 'player',
            isStatic: true,
            isSensor: true,
        });

        Matter.World.add(world, [ground, launcherBase, this.playerBody]);
        this.buildCastleFortress();
    }

    buildCastleFortress() {
        const world = this.engine.world;
        const oldCastle = Matter.Composite.allBodies(world).filter(
            b => b.label.startsWith('castle_') || b.label === 'enemy_pig'
        );
        Matter.World.remove(world, oldCastle);

        const castleStartX = 780;
        const groundY = 650;
        const bodies: Matter.Body[] = [];
        this.leverEnemiesRemaining = 0;

        for (let col = 0; col < 3; col++) {
            const px = castleStartX + col * 110;
            bodies.push(
                Matter.Bodies.rectangle(px, groundY - 45, 24, 90, {
                    label: 'castle_stone',
                    density: 0.0035,
                    friction: 0.7,
                    restitution: 0.05,
                })
            );
        }

        bodies.push(
            Matter.Bodies.rectangle(castleStartX + 110, groundY - 95, 260, 18, {
                label: 'castle_wood',
                density: 0.0018,
                friction: 0.5,
                restitution: 0.1,
            }),
            Matter.Bodies.rectangle(castleStartX + 110, groundY - 40, 42, 42, {
                label: 'castle_tnt',
                density: 0.002,
                friction: 0.6,
                plugin: { exploded: false },
            })
        );

        [castleStartX + 45, castleStartX + 175].forEach(ex => {
            const pig = Matter.Bodies.circle(ex, groundY - 30, 22, {
                label: 'enemy_pig',
                density: 0.0012,
                restitution: 0.25,
                plugin: { alive: true, points: 500 },
            });
            bodies.push(pig);
            this.leverEnemiesRemaining++;
        });

        bodies.push(
            Matter.Bodies.rectangle(castleStartX + 50, groundY - 145, 20, 80, {
                label: 'castle_ice',
                density: 0.0012,
                friction: 0.05,
            }),
            Matter.Bodies.rectangle(castleStartX + 170, groundY - 145, 20, 80, {
                label: 'castle_ice',
                density: 0.0012,
                friction: 0.05,
            }),
            Matter.Bodies.rectangle(castleStartX + 110, groundY - 190, 180, 16, {
                label: 'castle_wood',
                density: 0.0018,
                friction: 0.5,
            })
        );

        const king = Matter.Bodies.circle(castleStartX + 110, groundY - 220, 26, {
            label: 'enemy_pig',
            density: 0.0012,
            restitution: 0.3,
            plugin: { alive: true, points: 1000, isKing: true },
        });
        bodies.push(king);
        this.leverEnemiesRemaining++;

        Matter.World.add(world, bodies);
    }

    setLeverClass(grade: 1 | 2 | 3) {
        this.leverClass = grade;
        this.playerState.activeDialog = `sign_${grade}`;
        this.spawnParticles(this.leverPivotX, this.leverPivotY, 14, '#f59e0b', 3.5, 4);
    }

    startAiming(x: number, y: number) {
        this.isAiming = true;
        this.updateAiming(x, y);
    }

    updateAiming(x: number, y: number) {
        if (!this.isAiming) return;
        const maxPull = 120;
        const dx = x - this.leverPivotX;
        const dy = y - this.leverPivotY;
        const dist = Math.hypot(dx, dy);
        if (dist > maxPull) {
            this.aimDragX = this.leverPivotX + (dx / dist) * maxPull;
            this.aimDragY = this.leverPivotY + (dy / dist) * maxPull;
        } else {
            this.aimDragX = x;
            this.aimDragY = y;
        }
    }

    releaseAiming() {
        if (!this.isAiming) return;
        this.isAiming = false;

        const pullX = this.leverPivotX - this.aimDragX;
        const pullY = this.leverPivotY - this.aimDragY;
        const pullDist = Math.hypot(pullX, pullY);

        if (pullDist > 15) {
            const pullPower = pullDist / 120;
            const angleRad = Math.atan2(pullY, pullX);
            this.fireLeverProjectile(angleRad, pullPower);
        }

        this.aimDragX = this.leverPivotX;
        this.aimDragY = this.leverPivotY;
    }

    fireLeverProjectile(angleRad: number, power: number) {
        if (this.leverShotsRemaining <= 0) return;
        this.leverShotsRemaining--;
        this.rockTrail = [];

        const world = this.engine.world;
        const grade = this.leverClass;

        let radius = 20;
        let density = 0.003;
        let speedMult = 1.0;
        let color = '#94a3b8';
        let projType = 'rock';

        if (grade === 1) {
            radius = 20;
            density = 0.003;
            speedMult = 1.05;
            color = '#f59e0b';
            projType = 'balanced_rock';
        } else if (grade === 2) {
            radius = 26;
            density = 0.012;
            speedMult = 0.78;
            color = '#334155';
            projType = 'heavy_boulder';
        } else {
            radius = 16;
            density = 0.0015;
            speedMult = 1.55;
            color = '#ef4444';
            projType = 'speed_bomb';
        }

        const baseSpeed = 19 * speedMult * Math.max(0.3, power);
        const vx = Math.cos(angleRad) * baseSpeed;
        const vy = Math.sin(angleRad) * baseSpeed;

        const proj = Matter.Bodies.circle(this.leverPivotX + 15, this.leverPivotY - 15, radius, {
            label: `projectile:${projType}`,
            density,
            restitution: 0.2,
            friction: 0.5,
            plugin: { grade, color, projType },
        });

        Matter.Body.setVelocity(proj, { x: vx, y: vy });
        Matter.World.add(world, proj);
        this.activeProjectile = proj;

        this.spawnParticles(this.leverPivotX, this.leverPivotY, 20, color, 4.5, 5);
    }

    explodeTNT(tnt: Matter.Body) {
        if (!tnt.plugin || tnt.plugin.exploded) return;
        tnt.plugin.exploded = true;

        const world = this.engine.world;
        const pos = tnt.position;
        const blastRadius = 180;
        const blastForce = 0.075;

        this.spawnParticles(pos.x, pos.y, 45, '#f97316', 7, 7, 0.02);
        this.spawnParticles(pos.x, pos.y, 35, '#facc15', 6, 6, 0.02);

        const allBodies = Matter.Composite.allBodies(world);
        for (const b of allBodies) {
            if (b.isStatic || b === tnt) continue;
            const dx = b.position.x - pos.x;
            const dy = b.position.y - pos.y;
            const dist = Math.hypot(dx, dy);
            if (dist < blastRadius && dist > 1) {
                const f = ((blastRadius - dist) / blastRadius) * blastForce;
                Matter.Body.applyForce(b, pos, {
                    x: (dx / dist) * f,
                    y: (dy / dist) * f - 0.03,
                });
            }
        }

        Matter.World.remove(world, tnt);
        this.leverScore += 400;
    }

    // =========================================================================
    // 🏗️ HARBOR CRANE PULLEY SIMULATOR MODE
    // =========================================================================
    initHarborCranePulley() {
        const world = this.engine.world;
        this.levelEndX = 1200;
        this.craneTrolleyX = 420;
        this.craneCableY = 460;
        this.pulleyStrands = 1;
        this.cargoHooked = false;
        this.cargoDelivered = false;
        this.cargoMassKg = 800;
        this.playerState.activeDialog = 'sign_intro';

        const leftQuay = Matter.Bodies.rectangle(140, 750, 280, 240, {
            isStatic: true,
            label: 'cement',
            friction: 0.9,
        });

        const waterBed = Matter.Bodies.rectangle(490, 810, 420, 120, {
            isStatic: true,
            label: 'water',
            isSensor: true,
        });

        const rightQuay = Matter.Bodies.rectangle(960, 750, 480, 240, {
            isStatic: true,
            label: 'cement',
            friction: 0.9,
        });

        const landingSensor = Matter.Bodies.rectangle(960, 620, 160, 16, {
            isStatic: true,
            isSensor: true,
            label: 'barge_drop_zone',
        });

        this.craneHookBody = Matter.Bodies.rectangle(this.craneTrolleyX, this.craneCableY, 44, 22, {
            isStatic: true,
            label: 'crane_hook',
            friction: 0.8,
        });

        this.cargoLoadBody = Matter.Bodies.rectangle(420, 580, 72, 72, {
            label: 'cargo_container',
            density: 0.008,
            friction: 0.8,
            restitution: 0.05,
            plugin: { massKg: this.cargoMassKg, hooked: false, delivered: false },
        });

        this.spawnX = 140;
        this.spawnY = 620;
        this.playerBody = Matter.Bodies.rectangle(this.spawnX, this.spawnY, 26, 40, {
            label: 'player',
            isStatic: true,
            isSensor: true,
        });

        Matter.World.add(world, [
            leftQuay,
            waterBed,
            rightQuay,
            landingSensor,
            this.craneHookBody,
            this.cargoLoadBody,
            this.playerBody,
        ]);
    }

    setPulleyStrands(strands: 1 | 2 | 4 | 8) {
        this.pulleyStrands = strands;
        const msgKey = strands === 1 ? 'sign_1' : strands === 2 ? 'sign_2' : 'sign_3';
        this.playerState.activeDialog = msgKey;
        if (this.craneHookBody) {
            this.spawnParticles(this.craneHookBody.position.x, this.craneHookBody.position.y, 14, '#38bdf8', 3, 4);
        }
    }

    moveCraneTrolley(dir: number) {
        const speed = 4;
        const minX = 260;
        const maxX = 980;
        this.craneTrolleyX = Math.max(minX, Math.min(maxX, this.craneTrolleyX + dir * speed));
        if (this.craneHookBody) {
            Matter.Body.setPosition(this.craneHookBody, {
                x: this.craneTrolleyX,
                y: this.craneCableY,
            });
        }
        if (this.cargoHooked && this.cargoLoadBody) {
            Matter.Body.setPosition(this.cargoLoadBody, {
                x: this.craneTrolleyX,
                y: this.craneCableY + 52,
            });
            Matter.Body.setVelocity(this.cargoLoadBody, { x: 0, y: 0 });
        }
    }

    hoistCrane(dir: number) {
        const speed = 3;
        const minY = 240;
        const maxY = 590;

        const tension = (this.cargoMassKg * 10) / this.pulleyStrands;
        if (dir < 0 && this.cargoHooked && tension > 2500) {
            if (this.craneHookBody) {
                this.spawnParticles(this.craneHookBody.position.x, this.craneHookBody.position.y - 15, 8, '#ef4444', 3, 3);
            }
            return false;
        }

        this.craneCableY = Math.max(minY, Math.min(maxY, this.craneCableY + dir * speed));
        if (this.craneHookBody) {
            Matter.Body.setPosition(this.craneHookBody, {
                x: this.craneTrolleyX,
                y: this.craneCableY,
            });
        }
        if (this.cargoHooked && this.cargoLoadBody) {
            Matter.Body.setPosition(this.cargoLoadBody, {
                x: this.craneTrolleyX,
                y: this.craneCableY + 52,
            });
            Matter.Body.setVelocity(this.cargoLoadBody, { x: 0, y: 0 });
        }
        return true;
    }

    toggleCargoLatch() {
        if (!this.cargoLoadBody || !this.craneHookBody) return;
        if (this.cargoHooked) {
            this.cargoHooked = false;
            Matter.Body.setStatic(this.cargoLoadBody, false);

            if (
                this.cargoLoadBody.position.x >= 860 &&
                this.cargoLoadBody.position.x <= 1060 &&
                this.cargoLoadBody.position.y >= 580
            ) {
                this.cargoDelivered = true;
                this.spawnParticles(this.cargoLoadBody.position.x, this.cargoLoadBody.position.y, 40, '#22c55e', 5, 5);
                this.state = 'gameover';
            }
        } else {
            const dx = Math.abs(this.craneHookBody.position.x - this.cargoLoadBody.position.x);
            const dy = Math.abs(this.craneHookBody.position.y - (this.cargoLoadBody.position.y - 52));
            if (dx < 45 && dy < 45) {
                this.cargoHooked = true;
                Matter.Body.setStatic(this.cargoLoadBody, true);
                this.spawnParticles(this.cargoLoadBody.position.x, this.cargoLoadBody.position.y - 35, 16, '#facc15', 3, 4);
            }
        }
    }

    // =========================================================================
    // ⚙️ & 📐 CLASSIC PLATFORMER LEVELS (WHEEL & INCLINED PLANE)
    // =========================================================================
    initPlatformerLevel() {
        const world = this.engine.world;
        const bodies: Matter.Body[] = [];

        let groundLabel = 'cement';
        let groundFriction = 0.8;
        if (this.machineId === 'inclined_plane') {
            groundLabel = 'sand';
            groundFriction = 0.25;
        }

        let groundSegments: { start: number; end: number }[] = [{ start: -1000, end: 8000 }];

        const addPit = (startX: number, width: number, hazardType: 'water' | 'lava' = 'water') => {
            const pitEnd = startX + width;
            const newSegs: { start: number; end: number }[] = [];
            for (const seg of groundSegments) {
                if (seg.end <= startX || seg.start >= pitEnd) {
                    newSegs.push(seg);
                } else {
                    if (seg.start < startX) newSegs.push({ start: seg.start, end: startX });
                    if (seg.end > pitEnd) newSegs.push({ start: pitEnd, end: seg.end });
                }
            }
            groundSegments = newSegs;
            bodies.push(
                Matter.Bodies.rectangle(startX + width / 2, 830, width, 80, {
                    isStatic: true,
                    isSensor: true,
                    label: hazardType,
                })
            );
        };

        const addSign = (id: string, x: number, y = 730) => {
            this.signs.push({ id, x, y, w: 60, h: 60, triggered: id === 'sign_intro' });
            bodies.push(
                Matter.Bodies.rectangle(x, y, 44, 44, {
                    isStatic: true,
                    isSensor: true,
                    label: `sign:${id}`,
                })
            );
        };

        const addStar = (x: number, y: number) => {
            const id = `star_${this.collectibles.length}`;
            this.collectibles.push({ id, x, y, collected: false });
            this.playerState.totalStars++;
        };

        const addEnemy = (x: number, y: number, range = 140, speed = 0.0022) => {
            bodies.push(
                Matter.Bodies.circle(x, y, 20, {
                    isStatic: true,
                    isSensor: true,
                    label: 'enemy',
                    plugin: { origX: x, origY: y, range, speed, dir: 1, alive: true },
                })
            );
        };

        const addQuizDoor = (doorIndex: number, x: number) => {
            const doorId = `quiz_door_${doorIndex}`;
            this.signs.push({ id: doorId, x: x - 50, y: 730, w: 80, h: 80, triggered: false });
            bodies.push(
                Matter.Bodies.rectangle(x - 50, 730, 50, 50, {
                    isStatic: true,
                    isSensor: true,
                    label: `sign:${doorId}`,
                })
            );
            const doorBody = Matter.Bodies.rectangle(x, 630, 32, 240, {
                isStatic: true,
                label: `quiz_door:${doorId}`,
            });
            this.doorBodies.set(doorId, doorBody);
            bodies.push(doorBody);
        };

        const addMechGate = (gateId: string, x: number, labelText = 'PORTA MECÀNICA') => {
            const gateBody = Matter.Bodies.rectangle(x, 635, 28, 230, {
                isStatic: true,
                label: `mech_gate:${gateId}`,
                plugin: { gateId, labelText, origY: 635 },
            });
            this.mechGates.set(gateId, gateBody);
            bodies.push(gateBody);
        };

        const addSteppingGap = (startX: number) => {
            const width = 440;
            addPit(startX, width, 'water');
            bodies.push(
                Matter.Bodies.rectangle(startX + 135, 705, 105, 24, {
                    isStatic: true,
                    label: groundLabel,
                    friction: 0.9,
                }),
                Matter.Bodies.rectangle(startX + 305, 675, 105, 24, {
                    isStatic: true,
                    label: groundLabel,
                    friction: 0.9,
                })
            );
            addStar(startX + 135, 645);
            addStar(startX + 305, 615);
            addEnemy(startX + width + 130, 730, 95, 0.0024);
            return startX + width;
        };

        if (this.machineId === 'wheel') {
            addSign('sign_intro', 420);
            addStar(560, 660);

            addSign('sign_1', 720);
            bodies.push(
                Matter.Bodies.rectangle(1360, 744, 110, 14, {
                    isStatic: true,
                    isSensor: true,
                    label: 'goal_plate:gate_1',
                    plugin: { gateId: 'gate_1', title: 'Placa 1' },
                })
            );
            addMechGate('gate_1', 1520, 'ESTACIÓ 1');
            addStar(1150, 640);
            addEnemy(1020, 730, 90, 0.0022);

            addSteppingGap(1640);

            addSign('sign_2', 2440);
            const poly2 = Matter.Bodies.polygon(2620, 700, 12, 38, {
                label: 'wheel_poly',
                friction: 0.06,
                density: 0.008,
                plugin: { sides: 12, station: 2 },
            });
            bodies.push(poly2);

            for (let r = 0; r < 3; r++) {
                bodies.push(
                    Matter.Bodies.rectangle(2840, 730 - r * 32, 28, 30, {
                        label: 'stone',
                        density: 0.0006,
                        friction: 0.4,
                    })
                );
            }
            bodies.push(
                Matter.Bodies.rectangle(3000, 744, 110, 14, {
                    isStatic: true,
                    isSensor: true,
                    label: 'goal_plate:gate_2',
                    plugin: { gateId: 'gate_2', title: 'Placa 2' },
                })
            );
            addMechGate('gate_2', 3150, 'ESTACIÓ 2');
            addStar(2840, 600);
            addQuizDoor(0, 3350);
            addEnemy(3520, 730, 90, 0.0025);

            addSign('sign_3', 3680);
            const bigWheel = Matter.Bodies.circle(3840, 705, 42, {
                label: 'wheel',
                friction: 0.01,
                density: 0.006,
                plugin: { sides: 0, station: 3 },
            });
            bodies.push(bigWheel);
            bodies.push(
                Matter.Bodies.rectangle(4160, 744, 120, 14, {
                    isStatic: true,
                    isSensor: true,
                    label: 'goal_plate:gate_3',
                    plugin: { gateId: 'gate_3', title: 'Placa 3' },
                })
            );
            addMechGate('gate_3', 4320, 'ESTACIÓ 3');
            addStar(4000, 640);
            this.levelEndX = 4660;
        } else if (this.machineId === 'inclined_plane') {
            addSign('sign_intro', 400);
            addStar(550, 660);

            const buildFlushRamp = (
                startX: number,
                w: number,
                h: number,
                massKg: number,
                gateId: string,
                rampId: string
            ) => {
                const topW = 220;
                const descW = 220;
                const length = Math.sqrt(w * w + h * h);
                const angle = -Math.atan2(h, w);
                const thickness = 28;
                const midX = startX + w / 2;
                const midY = 750 - h / 2 + (thickness / 2) * Math.cos(angle);

                const rampBody = Matter.Bodies.rectangle(midX, midY, length, thickness, {
                    isStatic: true,
                    angle,
                    label: 'ramp',
                    friction: 0.04,
                    plugin: { startX, w, h, l: length, topW, descW, rampId },
                });

                const plateau = Matter.Bodies.rectangle(
                    startX + w + topW / 2,
                    750 - h + thickness / 2,
                    topW + 20,
                    thickness,
                    { isStatic: true, label: 'stone', friction: 0.2 }
                );

                const descLength = Math.sqrt(descW * descW + h * h);
                const descAngle = Math.atan2(h, descW);
                const descBody = Matter.Bodies.rectangle(
                    startX + w + topW + descW / 2,
                    750 - h / 2 + (thickness / 2) * Math.cos(descAngle),
                    descLength,
                    thickness,
                    { isStatic: true, angle: descAngle, label: 'stone', friction: 0.2 }
                );

                const box = Matter.Bodies.rectangle(startX - 45, 720, 44, 44, {
                    label: 'physics_box',
                    friction: 0.015,
                    density: 0.002,
                    plugin: {
                        mass: massKg,
                        h: +(h / 100).toFixed(1),
                        l: +(length / 100).toFixed(1),
                        gateId,
                        rampId,
                    },
                });

                const goal = Matter.Bodies.circle(startX + w + topW / 2, 750 - h - 22, 24, {
                    isStatic: true,
                    isSensor: true,
                    label: 'goal_circle',
                    plugin: { gateId, rampId },
                });

                bodies.push(rampBody, plateau, descBody, box, goal);
                addStar(startX + w / 2, 750 - h / 2 - 60);
                return startX + w + topW + descW;
            };

            addSign('sign_1', 650);
            const end1 = buildFlushRamp(860, 640, 160, 60, 'gate_1', 'ramp_1');
            addMechGate('gate_1', end1 + 120, 'RAMPA 1');
            addQuizDoor(0, end1 + 320);
            addEnemy(end1 + 460, 730, 80, 0.0022);

            const st2Start = end1 + 600;
            addSign('sign_2', st2Start);
            (this as any).ramp2StartX = st2Start + 240;
            addMechGate('gate_2', st2Start + 1380, 'RAMPA 2');

            const st3Start = st2Start + 1540;
            addSign('sign_3', st3Start);
            const end3 = buildFlushRamp(st3Start + 220, 720, 120, 90, 'gate_3', 'ramp_3');
            addMechGate('gate_3', end3 + 120, 'RAMPA 3');
            this.levelEndX = end3 + 460;
        }

        for (const seg of groundSegments) {
            const w = seg.end - seg.start;
            if (w > 0) {
                bodies.push(
                    Matter.Bodies.rectangle(seg.start + w / 2, 950, w, 400, {
                        isStatic: true,
                        label: groundLabel,
                        friction: groundFriction,
                    })
                );
            }
        }

        bodies.push(
            Matter.Bodies.rectangle(this.levelEndX, 600, 90, 320, {
                isStatic: true,
                label: 'finish',
                isSensor: true,
            })
        );
        this.signs.push({ id: 'finish', x: this.levelEndX, y: 730, w: 60, h: 60, triggered: false });

        this.spawnX = 240;
        this.spawnY = 690;
        this.playerBody = Matter.Bodies.rectangle(this.spawnX, this.spawnY, 26, 40, {
            label: 'player',
            density: 0.025,
            inertia: Infinity,
            friction: 0.04,
            chamfer: { radius: 8 },
        });
        bodies.push(this.playerBody);

        Matter.World.add(world, bodies);

        if (this.machineId === 'wheel') {
            this.setWheelSides(this.wheelSides);
        } else if (this.machineId === 'inclined_plane') {
            this.setRampLength(this.ramp2Length);
        }
    }

    setWheelSides(sides: number) {
        this.wheelSides = sides;
        const world = this.engine.world;
        const old = Matter.Composite.allBodies(world).filter(b => b.plugin && b.plugin.station === 1);
        Matter.World.remove(world, old);

        const x = 920;
        const radius = 38;
        let body: Matter.Body;
        if (sides === 0 || sides > 16) {
            body = Matter.Bodies.circle(x, 750 - radius, radius, {
                label: 'wheel',
                friction: 0.012,
                density: 0.005,
                restitution: 0.25,
                plugin: { sides: 0, station: 1 },
            });
        } else {
            const apothem = radius * Math.cos(Math.PI / sides);
            const f = sides <= 4 ? 0.95 : sides <= 6 ? 0.35 : 0.1;
            body = Matter.Bodies.polygon(x, 750 - apothem - 2, sides, radius, {
                label: 'wood',
                friction: f,
                density: 0.006,
                angle: Math.PI / 2 - Math.PI / sides,
                plugin: { sides, station: 1 },
            });
        }
        Matter.World.add(world, body);
        this.spawnParticles(x, 710, 12, '#facc15', 3.5, 4);
    }

    pushWheelTest() {
        const bodies = Matter.Composite.allBodies(this.engine.world);
        for (const b of bodies) {
            if (b.label === 'wheel' || b.label === 'wood' || b.label === 'wheel_poly') {
                if (Math.abs(b.position.x - this.playerBody.position.x) < 650) {
                    const sides = b.plugin?.sides ?? 0;
                    const mult = sides === 0 ? 1.0 : sides >= 8 ? 0.85 : sides >= 6 ? 0.6 : 0.22;
                    Matter.Body.setVelocity(b, { x: 9.8 * mult, y: -1.5 });
                    Matter.Body.setAngularVelocity(b, 0.24 * mult);
                    this.spawnParticles(b.position.x - 20, b.bounds.max.y - 5, 14, '#fbbf24', 4, 4);
                }
            }
        }
    }

    setRampLength(lengthPx: number) {
        this.ramp2Length = Math.max(300, Math.min(850, lengthPx));
        if (this.machineId !== 'inclined_plane') return;

        const world = this.engine.world;
        const toRem = Matter.Composite.allBodies(world).filter(
            b => b.plugin && b.plugin.rampId === 'ramp_2'
        );
        Matter.World.remove(world, toRem);

        const startX = (this as any).ramp2StartX || 2350;
        const h = 180;
        const w = this.ramp2Length;
        const topW = 200;
        const descW = 200;
        const length = Math.sqrt(w * w + h * h);
        const angle = -Math.atan2(h, w);
        const thickness = 28;

        const rampBody = Matter.Bodies.rectangle(
            startX + w / 2,
            750 - h / 2 + (thickness / 2) * Math.cos(angle),
            length,
            thickness,
            { isStatic: true, angle, label: 'ramp', friction: 0.04, plugin: { rampId: 'ramp_2' } }
        );

        const plateau = Matter.Bodies.rectangle(
            startX + w + topW / 2,
            750 - h + thickness / 2,
            topW + 20,
            thickness,
            { isStatic: true, label: 'stone', friction: 0.2, plugin: { rampId: 'ramp_2' } }
        );

        const descLength = Math.sqrt(descW * descW + h * h);
        const descAngle = Math.atan2(h, descW);
        const descBody = Matter.Bodies.rectangle(
            startX + w + topW + descW / 2,
            750 - h / 2 + (thickness / 2) * Math.cos(descAngle),
            descLength,
            thickness,
            { isStatic: true, angle: descAngle, label: 'stone', friction: 0.2, plugin: { rampId: 'ramp_2' } }
        );

        const box = Matter.Bodies.rectangle(startX - 45, 720, 44, 44, {
            label: 'physics_box',
            friction: 0.015,
            density: 0.002,
            plugin: { mass: 80, h: +(h / 100).toFixed(1), l: +(length / 100).toFixed(1), gateId: 'gate_2', rampId: 'ramp_2' },
        });

        const goal = Matter.Bodies.circle(startX + w + topW / 2, 750 - h - 22, 24, {
            isStatic: true,
            isSensor: true,
            label: 'goal_circle',
            plugin: { gateId: 'gate_2', rampId: 'ramp_2' },
        });

        Matter.World.add(world, [rampBody, plateau, descBody, box, goal]);
    }

    pushActiveBox() {
        const boxes = Matter.Composite.allBodies(this.engine.world).filter(
            b => b.label === 'physics_box' && !b.isStatic
        );
        for (const box of boxes) {
            if (Math.abs(box.position.x - this.playerBody.position.x) < 750) {
                const weight = (box.plugin?.mass || 60) * 10;
                const h = box.plugin?.h || 1.8;
                const l = box.plugin?.l || 6.0;
                const reqForce = weight * (h / l);
                if (reqForce <= 300) {
                    Matter.Body.setVelocity(box, { x: 8.8, y: -4.4 });
                    this.spawnParticles(box.position.x - 15, box.position.y + 15, 14, '#38bdf8', 3.5, 4);
                } else {
                    Matter.Body.setVelocity(box, { x: 2.2, y: -0.8 });
                    this.spawnParticles(box.position.x - 15, box.position.y + 15, 8, '#ef4444', 2.5, 3);
                }
            }
        }
    }

    openMechGate(gateId: string) {
        if (this.openedGates.has(gateId)) return;
        this.openedGates.add(gateId);
        const gate = this.mechGates.get(gateId);
        if (gate) {
            gate.isSensor = true;
            this.spawnParticles(gate.position.x, gate.position.y, 28, '#4ade80', 5, 5);
        }
    }

    openQuizDoor(doorId: string) {
        const door = this.doorBodies.get(doorId);
        if (door) {
            this.spawnParticles(door.position.x, door.position.y, 30, '#c084fc', 5, 5);
            Matter.World.remove(this.engine.world, door);
            this.doorBodies.delete(doorId);
        }
        this.signs = this.signs.filter(s => s.id !== doorId);
        this.playerState.activeInGameQuiz = null;
    }

    stepBackFromQuizDoor() {
        if (!this.playerBody) return;
        Matter.Body.setPosition(this.playerBody, {
            x: this.playerBody.position.x - 95,
            y: this.playerBody.position.y,
        });
        this.playerState.activeInGameQuiz = null;
    }

    getTelemetry(): MachineTelemetry {
        if (this.machineId === 'lever') {
            const grade = this.leverClass;
            if (grade === 1) {
                return {
                    title: "Palanca de 1r Grau: Fulcre al Mig (Catapulta)",
                    subtitle: "Fulcre ▲ entre Força i Càrrega | Trajectòria equilibrada",
                    formula: "F₁ · d₁ = F₂ · d₂  ⇒  AM = d₁ / d₂ = 2.0x",
                    effortForce: 150,
                    loadForce: 300,
                    mechanicalAdvantage: 2.0,
                    efficiencyNote: "Equilibri òptim de força i alçada parabòlica",
                    canOperate: true,
                    statusMessage: `Tirs restants: ${this.leverShotsRemaining} | Punts: ${this.leverScore} | Objectius: ${this.leverEnemiesRemaining}`,
                };
            }
            if (grade === 2) {
                return {
                    title: "Palanca de 2n Grau: Càrrega al Mig (Ariet Pesant)",
                    subtitle: "Càrrega ● entre Fulcre i Força | Massa gegant (200 kg)",
                    formula: "AM = d_força / d_càrrega = 3.5x  (AM > 1 SEMPRE)",
                    effortForce: 570,
                    loadForce: 2000,
                    mechanicalAdvantage: 3.5,
                    efficiencyNote: "Multiplica la força bruta: demolidor de murs de pedra",
                    canOperate: true,
                    statusMessage: `Tirs restants: ${this.leverShotsRemaining} | Punts: ${this.leverScore} | Objectius: ${this.leverEnemiesRemaining}`,
                };
            }
            return {
                title: "Palanca de 3r Grau: Força al Mig (Trabuquet Ràpid)",
                subtitle: "Força ⚡ entre Fulcre i Càrrega | Multiplica la Velocitat!",
                formula: "v = ω · d₂  |  AM = 0.4x (sacrifica força per velocitat)",
                effortForce: 600,
                loadForce: 240,
                mechanicalAdvantage: 0.4,
                efficiencyNote: "Velocitat màxima de sortida i tir rasant llarg",
                canOperate: true,
                statusMessage: `Tirs restants: ${this.leverShotsRemaining} | Punts: ${this.leverScore} | Objectius: ${this.leverEnemiesRemaining}`,
            };
        }

        if (this.machineId === 'pulley') {
            const n = this.pulleyStrands;
            const loadN = this.cargoMassKg * 10;
            const effortN = Math.round(loadN / n);
            const safe = effortN <= 2500;
            return {
                title: n === 1 ? "Politja Fixa Simple (N = 1)" : n === 2 ? "Politja Mòbil (N = 2)" : `Polispast Industrial (N = ${n})`,
                subtitle: `Càrrega = ${this.cargoMassKg} kg (${loadN} N) | Cable = ${n} ramals`,
                formula: `F_cable = P / N = ${loadN} N / ${n} = ${effortN} N`,
                effortForce: effortN,
                loadForce: loadN,
                mechanicalAdvantage: n,
                efficiencyNote: `Recollir cable: ${n} metres per cada metre elevat`,
                canOperate: safe,
                statusMessage: safe
                    ? `✓ Tensió segura (${effortN} N ≤ 2500 N): Hissament autoritzat!`
                    : `⚠️ SOBRECARGA AL CABLE (${effortN} N > 2500 N)! Selecciona N = 4 o 8 per dividir el pes!`,
            };
        }

        if (this.machineId === 'wheel') {
            const sides = this.wheelSides;
            const mu = sides === 0 ? 0.02 : sides >= 12 ? 0.06 : sides >= 8 ? 0.12 : sides >= 6 ? 0.22 : 0.5;
            const load = 500;
            const effort = Math.round(load * mu);
            const am = +(load / Math.max(1, effort)).toFixed(1);
            return {
                title: sides === 0 ? 'Roda Perfecta (∞ costats)' : `Polígon regular de ${sides} costats`,
                subtitle: `Coeficient de fregament efectiu μ ≈ ${mu}`,
                formula: `F = μ · N = ${mu} × ${load} N = ${effort} N`,
                effortForce: effort,
                loadForce: load,
                mechanicalAdvantage: am,
                efficiencyNote: sides === 0 ? 'Mínim fregament per contacte tangent!' : 'Fricció de lliscament',
                canOperate: sides === 0 || sides >= 6,
                statusMessage: sides === 0 || sides >= 6 ? '✓ Roda amb gran facilitat!' : "⚠️ Molta fricció!",
            };
        }

        const h = 1.8;
        const w = this.ramp2Length / 100;
        const l = +Math.sqrt(w * w + h * h).toFixed(1);
        const load = 800;
        const effort = Math.round(load * (h / l));
        const am = +(l / h).toFixed(2);
        const ok = effort <= 300;
        return {
            title: 'Pla Inclinat Ajustable',
            subtitle: `Alçada h = ${h} m | Longitud L = ${l} m`,
            formula: `F = P × (h / L) = ${load} N × (${h} / ${l}) = ${effort} N`,
            effortForce: effort,
            loadForce: load,
            mechanicalAdvantage: am,
            efficiencyNote: `Conservació del treball: W = ${Math.round(load * h)} J`,
            canOperate: ok,
            statusMessage: ok ? '✓ Pendent suau (F ≤ 300 N)!' : '⚠️ Rampa massa dreta: allarga la rampa!',
        };
    }

    handleCollisions(event: Matter.IEventCollision<Matter.Engine>) {
        for (const pair of event.pairs) {
            const { bodyA, bodyB } = pair;

            if (this.machineId === 'lever') {
                if (bodyA.label === 'castle_tnt' || bodyB.label === 'castle_tnt') {
                    const tnt = bodyA.label === 'castle_tnt' ? bodyA : bodyB;
                    const other = bodyA === tnt ? bodyB : bodyA;
                    const speed = Math.hypot(other.velocity.x, other.velocity.y);
                    if (speed > 1.8 || other.label.startsWith('projectile:')) {
                        this.explodeTNT(tnt);
                    }
                }

                if (bodyA.label === 'enemy_pig' || bodyB.label === 'enemy_pig') {
                    const pig = bodyA.label === 'enemy_pig' ? bodyA : bodyB;
                    const other = bodyA === pig ? bodyB : bodyA;
                    const speed = Math.hypot(other.velocity.x, other.velocity.y);
                    if (pig.plugin && pig.plugin.alive && (speed > 2.5 || other.label.startsWith('projectile:'))) {
                        pig.plugin.alive = false;
                        this.leverScore += pig.plugin.points || 500;
                        this.leverEnemiesRemaining = Math.max(0, this.leverEnemiesRemaining - 1);
                        this.playerState.enemiesDefeated++;
                        this.spawnParticles(pig.position.x, pig.position.y, 25, '#22c55e', 4.5, 5);
                        Matter.World.remove(this.engine.world, pig);
                        if (this.leverEnemiesRemaining <= 0) {
                            this.state = 'gameover';
                        }
                    }
                }
            }

            if (this.playerBody) {
                if (bodyA === this.playerBody || bodyB === this.playerBody) {
                    const other = bodyA === this.playerBody ? bodyB : bodyA;
                    if (other.label === 'water' || other.label === 'lava' || other.label === 'void_floor') {
                        this.spawnParticles(this.playerBody.position.x, this.playerBody.position.y, 18, other.label === 'lava' ? '#f97316' : '#38bdf8', 4, 4);
                        this.killPlayer();
                    } else if (other.label === 'finish' && !this.playerState.finished) {
                        this.playerState.finished = true;
                        this.spawnParticles(other.position.x, 580, 40, '#facc15', 6, 5);
                        this.state = 'history';
                    }
                }
            }
        }
    }

    killPlayer() {
        if (this.playerState.deadTimer > 0) return;
        this.playerState.deadTimer = 450;
        Matter.Body.setVelocity(this.playerBody, { x: 0, y: 0 });
    }

    update(delta: number, input: InputState) {
        if (this.state !== 'playing') return;

        this.elapsedTime += delta;
        this.windStrength = 0.8 + Math.sin(this.elapsedTime / 1800) * 0.4;
        const allBodies = Matter.Composite.allBodies(this.engine.world);

        // Update particle physics
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity ?? 0.08;
            p.life -= delta;
            p.alpha = Math.max(0, p.life / p.maxLife);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Active projectile trail & bounds
        if (this.activeProjectile) {
            const pos = this.activeProjectile.position;
            const speed = Math.hypot(this.activeProjectile.velocity.x, this.activeProjectile.velocity.y);
            if (speed > 1.2) {
                if (
                    this.rockTrail.length === 0 ||
                    Math.hypot(
                        pos.x - this.rockTrail[this.rockTrail.length - 1].x,
                        pos.y - this.rockTrail[this.rockTrail.length - 1].y
                    ) > 16
                ) {
                    this.rockTrail.push({ x: pos.x, y: pos.y });
                    if (this.rockTrail.length > 50) this.rockTrail.shift();
                }
            }
            if (pos.y > 850 || pos.x > 1500) {
                this.activeProjectile = null;
            }
        }

        // Harbor Crane Pulley continuous loop
        if (this.machineId === 'pulley') {
            if (input.left) this.moveCraneTrolley(-1);
            if (input.right) this.moveCraneTrolley(1);
            if (input.up) this.hoistCrane(-1);
            if (input.down) this.hoistCrane(1);
        }

        // Classic Platformer physics
        if (this.machineId === 'wheel' || this.machineId === 'inclined_plane') {
            this.updatePlatformer(input, delta, allBodies);
        }

        Matter.Engine.update(this.engine, delta);
    }

    updatePlatformer(input: InputState, delta: number, allBodies: Matter.Body[]) {
        if (this.playerState.deadTimer > 0) {
            this.playerState.deadTimer -= delta;
            if (this.playerState.deadTimer <= 0) {
                Matter.Body.setPosition(this.playerBody, { x: this.spawnX, y: this.spawnY });
                Matter.Body.setVelocity(this.playerBody, { x: 0, y: 0 });
            }
            return;
        }

        // Check nearby signs
        let activeQuiz: string | null = null;
        for (const sign of this.signs) {
            const dx = this.playerBody.position.x - sign.x;
            const dy = this.playerBody.position.y - sign.y;
            if (Math.abs(dx) < 95 && Math.abs(dy) < 130) {
                if (sign.id.startsWith('quiz_door_')) {
                    activeQuiz = sign.id;
                } else if (sign.id !== 'finish') {
                    this.playerState.activeDialog = sign.id;
                    sign.triggered = true;
                    this.spawnX = sign.x;
                    this.spawnY = 660;
                }
            }
        }
        this.playerState.activeInGameQuiz = activeQuiz;

        if (this.playerBody.position.y > 1250) {
            this.killPlayer();
        }

        // Ground check
        const bounds = this.playerBody.bounds;
        const groundedNow = Matter.Query.region(allBodies, {
            min: { x: bounds.min.x + 3, y: bounds.max.y - 2 },
            max: { x: bounds.max.x - 3, y: bounds.max.y + 8 },
        }).some(b => !b.isSensor && b !== this.playerBody);

        // Landing impact squash & stretch
        if (groundedNow && !this.playerState.wasGrounded && this.playerBody.velocity.y > 1.8) {
            this.playerState.squashY = 0.78;
            this.spawnParticles(this.playerBody.position.x, this.playerBody.bounds.max.y, 7, '#cbd5e1', 2.2, 3, 0.04);
        }
        this.playerState.wasGrounded = groundedNow;
        this.playerState.isGrounded = groundedNow;

        // Relax squash/stretch back to 1.0
        this.playerState.squashY += (1 - this.playerState.squashY) * 0.18;

        // Player lateral movement
        this.playerState.isCrouching = input.down && this.playerState.isGrounded;
        const maxSpeed = 6.0;
        const accel = this.playerState.isGrounded ? 1.15 : 0.55;

        if (input.left && !this.playerState.isCrouching) {
            const targetVx = Math.max(this.playerBody.velocity.x - accel, -maxSpeed);
            Matter.Body.setVelocity(this.playerBody, { x: targetVx, y: this.playerBody.velocity.y });
            this.playerState.facingRight = false;
            this.playerState.isMoving = true;
            this.playerState.runCycle += delta * 0.016;
        } else if (input.right && !this.playerState.isCrouching) {
            const targetVx = Math.min(this.playerBody.velocity.x + accel, maxSpeed);
            Matter.Body.setVelocity(this.playerBody, { x: targetVx, y: this.playerBody.velocity.y });
            this.playerState.facingRight = true;
            this.playerState.isMoving = true;
            this.playerState.runCycle += delta * 0.016;
        } else {
            this.playerState.isMoving = false;
            const damping = this.playerState.isGrounded ? 0.72 : 0.94;
            Matter.Body.setVelocity(this.playerBody, {
                x: this.playerBody.velocity.x * damping,
                y: this.playerBody.velocity.y,
            });
        }

        // Footstep running dust
        if (this.playerState.isGrounded && this.playerState.isMoving && Math.random() < 0.22) {
            this.spawnParticles(
                this.playerBody.position.x - (this.playerState.facingRight ? 10 : -10),
                this.playerBody.bounds.max.y - 2,
                1,
                'rgba(226, 232, 240, 0.7)',
                1.2,
                2.5,
                -0.01
            );
        }

        if (input.up && this.playerState.isGrounded && this.playerState.jumpCooldown <= 0) {
            this.playerState.squashY = 1.25;
            this.spawnParticles(this.playerBody.position.x, this.playerBody.bounds.max.y, 8, '#e2e8f0', 2.6, 3);
            Matter.Body.setVelocity(this.playerBody, { x: this.playerBody.velocity.x, y: -11.2 });
            this.playerState.isGrounded = false;
            this.playerState.jumpCooldown = 220;
        }
        if (this.playerState.jumpCooldown > 0) this.playerState.jumpCooldown -= delta;

        // Collect stars
        for (const star of this.collectibles) {
            if (!star.collected) {
                const dx = this.playerBody.position.x - star.x;
                const dy = this.playerBody.position.y - star.y;
                if (dx * dx + dy * dy < 44 * 44) {
                    star.collected = true;
                    this.playerState.starsCollected++;
                    this.spawnParticles(star.x, star.y, 18, '#facc15', 4.5, 4);
                }
            }
        }

        // Patrolling Enemies & Pushing Detection
        let pushingNow = false;
        for (const body of allBodies) {
            if (body.label === 'enemy' && body.plugin && body.plugin.alive) {
                const p = body.plugin;
                const prevX = body.position.x;
                const offset = Math.sin(this.elapsedTime * p.speed) * p.range;
                const nextX = p.origX + offset;
                p.dir = nextX >= prevX ? 1 : -1;
                Matter.Body.setPosition(body, { x: nextX, y: p.origY });

                if (this.playerState.deadTimer <= 0 && Matter.Collision.collides(this.playerBody, body)) {
                    // Check top bounce stomp!
                    if (this.playerBody.velocity.y > 0.5 || this.playerBody.bounds.max.y < body.position.y + 8) {
                        p.alive = false;
                        this.playerState.enemiesDefeated++;
                        Matter.Body.setVelocity(this.playerBody, { x: this.playerBody.velocity.x, y: -9.8 });
                        this.spawnParticles(body.position.x, body.position.y, 24, '#ef4444', 5, 5);
                        Matter.World.remove(this.engine.world, body);
                    } else {
                        this.spawnParticles(this.playerBody.position.x, this.playerBody.position.y, 16, '#ef4444', 4, 4);
                        this.killPlayer();
                    }
                }
            } else if (body.label.startsWith('goal_plate:')) {
                const gateId = body.plugin?.gateId;
                for (const other of allBodies) {
                    if (
                        (other.label === 'wheel' || other.label === 'wood' || other.label === 'wheel_poly') &&
                        Matter.Collision.collides(body, other)
                    ) {
                        if (gateId) this.openMechGate(gateId);
                    }
                }
            } else if (body.label === 'goal_circle') {
                const gateId = body.plugin?.gateId;
                for (const other of allBodies) {
                    if (other.label === 'physics_box' && Matter.Collision.collides(body, other)) {
                        Matter.Body.setStatic(other, true);
                        Matter.Body.setPosition(other, { x: body.position.x, y: body.position.y });
                        if (gateId) this.openMechGate(gateId);
                    }
                }
            } else if (
                body.label === 'wheel' ||
                body.label === 'wood' ||
                body.label === 'wheel_poly' ||
                body.label === 'physics_box'
            ) {
                const dx = body.position.x - this.playerBody.position.x;
                const dy = Math.abs(body.position.y - this.playerBody.position.y);
                if (Math.abs(dx) < 62 && dy < 55 && this.playerState.isMoving) {
                    pushingNow = true;
                }
            }
        }
        this.playerState.isPushing = pushingNow;

        // Smoothly animate opened gates upwards
        for (const [gateId, gateBody] of this.mechGates.entries()) {
            if (this.openedGates.has(gateId)) {
                const targetY = (gateBody.plugin?.origY || 635) - 210;
                if (gateBody.position.y > targetY) {
                    Matter.Body.setPosition(gateBody, {
                        x: gateBody.position.x,
                        y: gateBody.position.y - delta * 0.35,
                    });
                }
            }
        }
    }
}
