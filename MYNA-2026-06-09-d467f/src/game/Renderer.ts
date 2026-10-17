import Matter from 'matter-js';
import { GameEngine } from './Engine';

export class GameRenderer {
  ctx: CanvasRenderingContext2D;
  engine: GameEngine;

  constructor(ctx: CanvasRenderingContext2D, engine: GameEngine) {
    this.ctx = ctx;
    this.engine = engine;
  }

  private drawRoundRect(x: number, y: number, w: number, h: number, r: number) {
    const { ctx } = this;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
  }

  render() {
    const { ctx, engine } = this;
    const world = engine.engine.world;
    const bodies = Matter.Composite.allBodies(world);
    const constraints = Matter.Composite.allConstraints(world);

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const CANVAS_W = ctx.canvas.width;
    const CANVAS_H = ctx.canvas.height;
    const theme = engine.machineId;
    const time = engine.elapsedTime / 1000;

    if (theme === 'lever') {
      this.renderAngryBirdsLever(CANVAS_W, CANVAS_H, time, bodies);
      ctx.restore();
      return;
    }

    if (theme === 'pulley') {
      this.renderHarborCranePulley(CANVAS_W, CANVAS_H, time, bodies);
      ctx.restore();
      return;
    }

    // Default Platformer Rendering (Wheel & Inclined Plane)
    this.renderPlatformer(CANVAS_W, CANVAS_H, theme, time, bodies, constraints);
    ctx.restore();
  }

  // ===========================================================================
  // ⚖️ ANGRY BIRDS LEVER RENDERER (Full Visuals & Siege Physics)
  // ===========================================================================
  private renderAngryBirdsLever(CANVAS_W: number, CANVAS_H: number, time: number, bodies: Matter.Body[]) {
    const { ctx, engine } = this;

    // Atmospheric Sunset Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    skyGrad.addColorStop(0, '#1e1b4b');
    skyGrad.addColorStop(0.35, '#b45309');
    skyGrad.addColorStop(0.7, '#f97316');
    skyGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Glowing Sunset Sun
    const sunX = CANVAS_W * 0.8;
    const sunY = 180;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 160);
    sunGlow.addColorStop(0, '#fffbeb');
    sunGlow.addColorStop(0.3, 'rgba(251, 146, 60, 0.6)');
    sunGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Floating Volumetric Clouds
    for (let i = 0; i < 6; i++) {
      const speed = 8 + (i % 3) * 5;
      const cx = ((i * 350 + time * speed) % (CANVAS_W + 400)) - 150;
      const cy = 40 + (i % 3) * 45;
      const scale = 0.75 + (i % 3) * 0.2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.fillStyle = 'rgba(254, 215, 170, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.arc(28, -10, 40, 0, Math.PI * 2);
      ctx.arc(64, -4, 34, 0, Math.PI * 2);
      ctx.arc(92, 6, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Flocks of birds
    for (let b = 0; b < 5; b++) {
      const bx = ((b * 320 + time * (35 + b * 8)) % (CANVAS_W + 300)) - 100;
      const by = 90 + (b % 3) * 28 + Math.sin(time * 2.5 + b) * 8;
      const flap = Math.sin(time * 9 + b * 1.7) * 7;
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(bx - 10, by - flap);
      ctx.quadraticCurveTo(bx - 5, by - 3, bx, by);
      ctx.quadraticCurveTo(bx + 5, by - 3, bx + 10, by - flap);
      ctx.stroke();
    }

    // Distant mountain silhouettes
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_H);
    for (let x = 0; x <= CANVAS_W; x += 80) {
      const my = CANVAS_H - 190 - Math.sin(x * 0.005) * 60;
      ctx.lineTo(x, my);
    }
    ctx.lineTo(CANVAS_W, CANVAS_H);
    ctx.fill();

    // Ground platform
    const groundY = 650;
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, CANVAS_H);
    groundGrad.addColorStop(0, '#15803d');
    groundGrad.addColorStop(0.12, '#78350f');
    groundGrad.addColorStop(1, '#271c19');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, CANVAS_W, CANVAS_H - groundY);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, groundY, CANVAS_W, 10);

    // Pine trees in background
    [70, 400, 1100].forEach((px) => {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(px - 5, groundY - 25, 10, 25);
      for (let t = 0; t < 3; t++) {
        const ty = groundY - 20 - t * 24;
        const tw = 32 - t * 8;
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.moveTo(px - tw, ty);
        ctx.lineTo(px, ty - 38);
        ctx.lineTo(px + tw, ty);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Catapult / Slingshot Stand & Pivot Fulcrum (▲)
    const pivotX = engine.leverPivotX;
    const pivotY = engine.leverPivotY;

    // Wooden A-Frame Stand
    ctx.fillStyle = '#78350f';
    ctx.fillRect(pivotX - 16, pivotY, 32, groundY - pivotY);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.strokeRect(pivotX - 16, pivotY, 32, groundY - pivotY);

    // Cross brace
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pivotX - 16, groundY);
    ctx.lineTo(pivotX + 16, pivotY + 20);
    ctx.moveTo(pivotX + 16, groundY);
    ctx.lineTo(pivotX - 16, pivotY + 20);
    ctx.stroke();

    // Triangular Fulcrum (▲)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY - 14);
    ctx.lineTo(pivotX - 16, pivotY + 12);
    ctx.lineTo(pivotX + 16, pivotY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Lever Arm Beam
    const dragX = engine.aimDragX;
    const dragY = engine.aimDragY;
    const angle = Math.atan2(dragY - pivotY, dragX - pivotX);

    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle);

    const beamLen = 140;
    const beamGrad = ctx.createLinearGradient(-beamLen / 2, -7, beamLen / 2, 7);
    beamGrad.addColorStop(0, '#f59e0b');
    beamGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = beamGrad;
    this.drawRoundRect(-beamLen / 2, -7, beamLen, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lever Fulcrum Pin at Center
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Trajectory Preview Arc (Angry Birds style dots)
    const pullX = pivotX - dragX;
    const pullY = pivotY - dragY;
    const pullDist = Math.hypot(pullX, pullY);

    if (pullDist > 12) {
      ctx.save();
      const speedMult = engine.leverClass === 1 ? 1.05 : engine.leverClass === 2 ? 0.78 : 1.55;
      const power = pullDist / 120;
      let vx = (pullX / pullDist) * power * 34 * speedMult;
      let vy = (pullY / pullDist) * power * 34 * speedMult;
      let tx = pivotX;
      let ty = pivotY;

      for (let step = 0; step < 28; step++) {
        tx += vx * 0.9;
        ty += vy * 0.9;
        vy += 1.4 * 0.9; // gravity effect
        if (ty > groundY) break;

        const dotSize = Math.max(2.5, 6 - step * 0.14);
        ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.2, 1 - step / 28)})`;
        ctx.beginPath();
        ctx.arc(tx, ty, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Elastic Band / Tension Cable
    if (pullDist > 5) {
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY - 10);
      ctx.lineTo(dragX, dragY);
      ctx.stroke();
    }

    // Render Loaded Projectile on Slingshot
    if (!engine.activeProjectile) {
      this.drawSlingshotProjectile(dragX, dragY, time);
    }

    // Little Engineer character next to the catapult
    this.drawLittleEngineer(pivotX - 55, groundY, true, time);

    // Render Physics Bodies (Projectiles, Castle Blocks, TNT, Pigs)
    bodies.forEach((body) => {
      if (body.label === 'lever_projectile') {
        this.drawActiveProjectile(body, time);
        return;
      }
      if (body.label === 'castle_wood') {
        this.drawCastleWood(body);
        return;
      }
      if (body.label === 'castle_stone') {
        this.drawCastleStone(body);
        return;
      }
      if (body.label === 'castle_ice') {
        this.drawCastleIce(body);
        return;
      }
      if (body.label === 'castle_tnt') {
        this.drawCastleTNT(body, time);
        return;
      }
      if (body.label === 'castle_enemy') {
        this.drawCastleEnemy(body, time);
        return;
      }
    });

    // Particle Bursts & Explosions
    this.drawParticles(time, 0, 0, CANVAS_W, CANVAS_H);

    // Floating Wind Embers
    for (let i = 0; i < 8; i++) {
      const ex = (CANVAS_W + 200 - ((i * 140 + time * 60) % (CANVAS_W + 300))) % CANVAS_W;
      const ey = groundY - 20 - ((i * 45 + time * 40) % 180);
      ctx.fillStyle = 'rgba(251, 146, 60, 0.7)';
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD: Level Score & Remaining Shots
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.drawRoundRect(20, 20, 280, 85, 14);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText(`🎯 PUNTUACIÓ: ${engine.leverScore}`, 35, 46);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`Tirs restants: ${'● '.repeat(engine.leverShotsRemaining)}`, 35, 68);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`Enemics pendents: ${engine.leverEnemiesRemaining}`, 35, 88);
  }

  private drawSlingshotProjectile(x: number, y: number, time: number) {
    const { ctx, engine } = this;
    ctx.save();
    ctx.translate(x, y);

    if (engine.leverClass === 1) {
      // 1r Grau: Balanced Granite Stone
      const r = 20;
      const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, r);
      grad.addColorStop(0, '#cbd5e1');
      grad.addColorStop(0.65, '#64748b');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (engine.leverClass === 2) {
      // 2n Grau: Heavy Iron Ram (200kg)
      const r = 26;
      const grad = ctx.createRadialGradient(-6, -6, 2, 0, 0, r);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#475569');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('200kg', 0, 4);
    } else {
      // 3r Grau: Speed Fire Bomb
      const r = 16;
      const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#f97316');
      grad.addColorStop(1, '#dc2626');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();
      const flameH = 9 + Math.sin(time * 16) * 4;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.quadraticCurveTo(0, -14 - flameH, 6, -12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawActiveProjectile(body: Matter.Body, time: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    const pType = body.plugin?.projectileType || 1;

    if (pType === 1) {
      const r = 20;
      const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, r);
      grad.addColorStop(0, '#cbd5e1');
      grad.addColorStop(0.65, '#64748b');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (pType === 2) {
      const r = 26;
      const grad = ctx.createRadialGradient(-6, -6, 2, 0, 0, r);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#475569');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('200kg', 0, 4);
    } else {
      const r = 16;
      const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#f97316');
      grad.addColorStop(1, '#dc2626');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();
      const flameH = 9 + Math.sin(time * 16) * 4;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.quadraticCurveTo(0, -14 - flameH, 6, -12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawCastleWood(body: Matter.Body) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    const w = body.bounds.max.x - body.bounds.min.x;
    const h = body.bounds.max.y - body.bounds.min.y;
    ctx.fillStyle = '#d97706';
    this.drawRoundRect(-w / 2, -h / 2, w, h, 3);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 5, 0);
    ctx.lineTo(w / 2 - 5, 0);
    ctx.stroke();
    ctx.restore();
  }

  private drawCastleStone(body: Matter.Body) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    const w = body.bounds.max.x - body.bounds.min.x;
    const h = body.bounds.max.y - body.bounds.min.y;
    ctx.fillStyle = '#64748b';
    this.drawRoundRect(-w / 2, -h / 2, w, h, 3);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  private drawCastleIce(body: Matter.Body) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    const w = body.bounds.max.x - body.bounds.min.x;
    const h = body.bounds.max.y - body.bounds.min.y;
    ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
    this.drawRoundRect(-w / 2, -h / 2, w, h, 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  private drawCastleTNT(body: Matter.Body, time: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    const w = body.bounds.max.x - body.bounds.min.x;
    const h = body.bounds.max.y - body.bounds.min.y;
    ctx.fillStyle = '#dc2626';
    this.drawRoundRect(-w / 2, -h / 2, w, h, 5);
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-w / 2, -8, w, 16);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TNT', 0, 4);

    const spark = Math.sin(time * 18) * 3;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, -h / 2 - 4, 3 + spark, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawCastleEnemy(body: Matter.Body, time: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    const r = (body as any).circleRadius || 22;
    const isKing = body.plugin?.isKing;

    const pigGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
    pigGrad.addColorStop(0, '#86efac');
    pigGrad.addColorStop(0.7, '#22c55e');
    pigGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = pigGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Snout
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.ellipse(3, 4, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(1, 4, 1.8, 0, Math.PI * 2);
    ctx.arc(6, 4, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5, -6, 4.5, 0, Math.PI * 2);
    ctx.arc(8, -6, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-4, -6, 2, 0, Math.PI * 2);
    ctx.arc(9, -6, 2, 0, Math.PI * 2);
    ctx.fill();

    if (isKing) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-12, -r + 2);
      ctx.lineTo(-12, -r - 12);
      ctx.lineTo(-6, -r - 5);
      ctx.lineTo(0, -r - 15);
      ctx.lineTo(6, -r - 5);
      ctx.lineTo(12, -r - 12);
      ctx.lineTo(12, -r + 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    void time;
    ctx.restore();
  }

  // Little Engineer Character for static scenes
  private drawLittleEngineer(x: number, y: number, facingRight: boolean, time: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y - 10);
    ctx.scale(facingRight ? 1 : -1, 1);

    // Boots
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-8, 3, 7, 7);
    ctx.fillRect(1, 3, 7, 7);

    // Torso / Overalls
    ctx.fillStyle = '#2563eb';
    this.drawRoundRect(-8, -14, 16, 18, 4);
    ctx.fill();

    // Toolbelt
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-8, -2, 16, 3);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -22, 9, 0, Math.PI * 2);
    ctx.fill();

    // Hardhat
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -25, 10, Math.PI, 0);
    ctx.lineTo(12, -25);
    ctx.lineTo(-11, -25);
    ctx.closePath();
    ctx.fill();

    // Goggles
    ctx.fillStyle = '#38bdf8';
    this.drawRoundRect(2, -30, 7, 4, 2);
    ctx.fill();

    // Backpack
    ctx.fillStyle = '#d97706';
    this.drawRoundRect(-13, -12, 6, 14, 3);
    ctx.fill();

    void time;
    ctx.restore();
  }

  // ===========================================================================
  // 🏗️ HARBOR CRANE PULLEY SIMULATOR RENDERER
  // ===========================================================================
  private renderHarborCranePulley(CANVAS_W: number, CANVAS_H: number, time: number, bodies: Matter.Body[]) {
    const { ctx, engine } = this;

    // Atmospheric Seaport Twilight Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    skyGrad.addColorStop(0, '#0c4a6e');
    skyGrad.addColorStop(0.4, '#075985');
    skyGrad.addColorStop(0.75, '#0284c7');
    skyGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Distant harbor skyline silhouettes
    ctx.fillStyle = '#0f172a';
    for (let i = 0; i < 12; i++) {
      const bx = i * 110;
      const bh = 60 + ((i * 37) % 75);
      ctx.fillRect(bx, 640 - bh, 80, bh);
      // Window lights
      ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
      for (let wy = 640 - bh + 14; wy < 630; wy += 20) {
        for (let wx = bx + 12; wx < bx + 70; wx += 20) {
          ctx.fillRect(wx, wy, 8, 10);
        }
      }
      ctx.fillStyle = '#0f172a';
    }

    // Clouds
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 320 + time * 12) % (CANVAS_W + 300)) - 100;
      const cy = 40 + (i % 3) * 35;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.arc(cx + 24, cy - 8, 32, 0, Math.PI * 2);
      ctx.arc(cx + 52, cy - 2, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    // Seagulls
    for (let b = 0; b < 4; b++) {
      const bx = ((b * 300 + time * (30 + b * 10)) % (CANVAS_W + 200)) - 50;
      const by = 80 + (b % 3) * 25;
      const flap = Math.sin(time * 8 + b) * 6;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - 9, by - flap);
      ctx.quadraticCurveTo(bx - 4, by - 3, bx, by);
      ctx.quadraticCurveTo(bx + 4, by - 3, bx + 9, by - flap);
      ctx.stroke();
    }

    // Harbor Water with Wave Reflections
    const groundY = 650;
    const waterGrad = ctx.createLinearGradient(0, groundY + 10, 0, CANVAS_H);
    waterGrad.addColorStop(0, '#0284c7');
    waterGrad.addColorStop(0.3, '#0369a1');
    waterGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.moveTo(280, CANVAS_H);
    ctx.lineTo(280, groundY + 20);
    for (let x = 280; x <= 720; x += 25) {
      const wave = Math.sin(x * 0.04 + time * 3.5) * 5;
      ctx.lineTo(x, groundY + 20 + wave);
    }
    ctx.lineTo(720, CANVAS_H);
    ctx.closePath();
    ctx.fill();

    // Quayside concrete piers
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, groundY, 280, CANVAS_H - groundY);
    ctx.fillRect(720, groundY, CANVAS_W - 720, CANVAS_H - groundY);
    ctx.fillStyle = '#f59e0b';
    for (let x = 0; x < 280; x += 28) {
      ctx.fillRect(x, groundY, 14, 8);
    }
    for (let x = 720; x < CANVAS_W; x += 28) {
      ctx.fillRect(x, groundY, 14, 8);
    }

    // Cargo Barge on the right (Landing Zone)
    const bargeX = 860;
    ctx.fillStyle = '#1e293b';
    this.drawRoundRect(bargeX, groundY - 15, 200, 35, 6);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Target Drop Zone Marker with Pulsing Beacon
    const beaconPulse = Math.sin(time * 6) * 4;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    this.drawRoundRect(bargeX + 20, groundY - 12, 160, 28, 4);
    ctx.fill();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚓ ZONA DE DESCÀRREGA', bargeX + 100, groundY + 6);

    // Giant Gantry Crane Structure
    const towerX = 140;
    const boomY = 160;
    ctx.fillStyle = '#eab308';
    ctx.fillRect(towerX - 22, boomY, 44, groundY - boomY);

    // Steel truss cross-bracing
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    for (let y = boomY; y < groundY; y += 45) {
      ctx.beginPath();
      ctx.moveTo(towerX - 22, y);
      ctx.lineTo(towerX + 22, y + 45);
      ctx.moveTo(towerX + 22, y);
      ctx.lineTo(towerX - 22, y + 45);
      ctx.stroke();
    }

    // Operator's Cabin
    ctx.fillStyle = '#0f172a';
    this.drawRoundRect(towerX - 40, boomY + 30, 40, 50, 6);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.fillRect(towerX - 35, boomY + 40, 20, 20);

    // Horizontal Boom Girder spanning across harbor
    ctx.fillStyle = '#eab308';
    this.drawRoundRect(80, boomY - 18, 920, 36, 6);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Motorized Winch Drum on Boom
    const trolleyX = engine.craneTrolleyX;
    const hookY = engine.craneCableY;

    // Trolley moving along the boom
    ctx.fillStyle = '#1e293b';
    this.drawRoundRect(trolleyX - 32, boomY + 12, 64, 26, 6);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Multi-strand Pulley Rigging (N = 1, 2, 4, 8)
    const n = engine.pulleyStrands;
    const spacing = Math.min(14, 48 / Math.max(1, n - 1));
    const startOffset = -((n - 1) * spacing) / 2;

    for (let s = 0; s < n; s++) {
      const ox = startOffset + s * spacing;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(trolleyX + ox, boomY + 32);
      ctx.lineTo(trolleyX + ox, hookY - 12);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }

    // Rotating Sheaves at Trolley & Hook
    this.drawSheave(trolleyX, boomY + 28, 16, time * 3);
    if (n > 1) {
      this.drawSheave(trolleyX, hookY - 14, 14, -time * 3);
    }

    // Heavy Crane Hook & Spreader Beam
    ctx.fillStyle = '#334155';
    this.drawRoundRect(trolleyX - 26, hookY - 8, 52, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Curved Steel Hook
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(trolleyX, hookY + 14, 10, -Math.PI / 2, Math.PI / 2, false);
    ctx.quadraticCurveTo(trolleyX - 12, hookY + 20, trolleyX - 4, hookY + 10);
    ctx.stroke();

    // Little Engineer supervisor on the left pier
    this.drawLittleEngineer(70, groundY, true, time);

    // Render Physics Bodies (Cargo Containers, Hook Sensor)
    bodies.forEach((body) => {
      if (body.label === 'cargo_container') {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        const w = 72;
        const h = 72;
        ctx.fillStyle = '#0284c7';
        this.drawRoundRect(-w / 2, -h / 2, w, h, 6);
        ctx.fill();
        ctx.strokeStyle = '#075985';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 2;
        for (let rx = -w / 2 + 10; rx < w / 2; rx += 14) {
          ctx.beginPath();
          ctx.moveTo(rx, -h / 2 + 4);
          ctx.lineTo(rx, h / 2 - 4);
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('800 kg', 0, 4);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.fillText('8000 N', 0, 18);
        ctx.restore();
      }
    });

    // Render Water Splashes & Mechanical Sparks
    this.drawParticles(time, 0, 0, CANVAS_W, CANVAS_H);

    // ANALOG TENSION DIAL METER (HUD)
    const tensionN = Math.round((engine.cargoMassKg * 10) / engine.pulleyStrands);
    const isOverload = tensionN > 2500;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    this.drawRoundRect(20, 20, 330, 95, 16);
    ctx.fill();
    ctx.strokeStyle = isOverload ? '#ef4444' : '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`⚡ MONITOR DE TENSIÓ DEL CABLE`, 35, 44);

    const pct = Math.min(100, Math.round((tensionN / 8000) * 100));
    ctx.fillStyle = '#1e293b';
    this.drawRoundRect(35, 54, 210, 14, 6);
    ctx.fill();

    const barGrad = ctx.createLinearGradient(35, 0, 245, 0);
    barGrad.addColorStop(0, '#22c55e');
    barGrad.addColorStop(0.35, '#eab308');
    barGrad.addColorStop(0.7, '#f97316');
    barGrad.addColorStop(1, '#ef4444');
    ctx.fillStyle = barGrad;
    this.drawRoundRect(35, 54, (210 * pct) / 100, 14, 6);
    ctx.fill();

    ctx.fillStyle = isOverload ? '#f87171' : '#4ade80';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`${tensionN} N`, 255, 66);

    ctx.fillStyle = isOverload ? '#fca5a5' : '#94a3b8';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(
      isOverload ? '⚠️ SOBRECÀRREGA: Augmenta a N = 4 o 8!' : `✓ Tensió segura (${n} cordes: P / ${n})`,
      35,
      95
    );
  }

  // ===========================================================================
  // ⚙️ & 📐 CLASSIC PLATFORMER SCENERY (Rich Nature, Animals, Enemies, Character)
  // ===========================================================================
  private renderPlatformer(
    CANVAS_W: number,
    CANVAS_H: number,
    theme: string,
    time: number,
    bodies: Matter.Body[],
    constraints: Matter.Constraint[]
  ) {
    const { ctx, engine } = this;
    const GROUND_SURFACE_Y = 750;

    // 1. Rich Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    if (theme === 'wheel') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.28, '#0284c7');
      skyGrad.addColorStop(0.68, '#7dd3fc');
      skyGrad.addColorStop(1, '#fef08a');
    } else {
      // Inclined plane / desert twilight
      skyGrad.addColorStop(0, '#451a03');
      skyGrad.addColorStop(0.3, '#b45309');
      skyGrad.addColorStop(0.68, '#fb923c');
      skyGrad.addColorStop(1, '#fde68a');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Camera Tracking
    let camX = 0;
    if (engine.playerBody) {
      const targetCamX = engine.playerBody.position.x - CANVAS_W / 3;
      const maxCamX = Math.max(0, engine.levelEndX + 350 - CANVAS_W);
      camX = Math.max(0, Math.min(targetCamX, maxCamX));
    }
    const camY = GROUND_SURFACE_Y - (CANVAS_H - 120);

    // 2. Parallax Atmospheric & Living Background (Sun, God Rays, Clouds, Mountains, Birds)
    this.drawLivingAtmosphere(camX, CANVAS_W, CANVAS_H, theme, time);

    ctx.translate(-camX, -camY);

    // 3. World Scenery (Swaying Trees, Grass, Hopping Rabbits, Camels, Butterflies)
    this.drawWorldScenery(theme, time, GROUND_SURFACE_Y);

    // 4. Collectibles (Floating Energy Stars)
    this.drawCollectibles(time);

    // 5. Constraints
    this.drawConstraints(constraints, time);

    // 6. Render Physics Bodies
    bodies.forEach((body) => {
      if (body === engine.playerBody || body.label === 'boundary' || body.label === 'void_floor') {
        return;
      }
      if (body.label.startsWith('sign:')) {
        this.drawSign(body, time);
        return;
      }
      if (body.label === 'finish') {
        this.drawGoal(body, time);
        return;
      }
      if (body.label === 'goal_circle') {
        this.drawTarget(body, time);
        return;
      }
      if (body.label === 'enemy') {
        this.drawEnemy(body, time);
        return;
      }
      if (body.label === 'water' || body.label === 'lava') {
        const minX = body.bounds.min.x;
        const maxX = body.bounds.max.x;
        this.drawLiquidPit(
          minX,
          maxX,
          GROUND_SURFACE_Y + 8,
          body.label === 'lava' ? '#991b1b' : '#0369a1',
          body.label === 'lava' ? '#fbbf24' : '#38bdf8',
          time,
          body.label === 'lava'
        );
        return;
      }

      this.drawBody(body, theme, time);
    });

    // 7. Render Articulated Player with full animations & squash/stretch
    if (engine.playerBody) {
      this.drawPlayer(engine.playerBody, time);
    }

    // 8. Render Particles & Wind Streaks in World Space
    this.drawParticles(time, camX, camY, CANVAS_W, CANVAS_H);

    // 9. Force Vectors Overlay
    this.drawForceVectors(bodies);
  }

  // ===========================================================================
  // LIVING ATMOSPHERE & BACKGROUND (Sun, God Rays, Aurora, Clouds, Distant Hills, Birds)
  // ===========================================================================
  private drawLivingAtmosphere(camX: number, CANVAS_W: number, CANVAS_H: number, theme: string, time: number) {
    const { ctx } = this;
    ctx.save();

    if (theme === 'wheel') {
      const sunX = CANVAS_W * 0.78 - camX * 0.025;
      const sunY = 90;
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(time * 0.05);
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        const rayGrad = ctx.createLinearGradient(0, 0, 0, 260);
        rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.16)');
        rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(18, 0);
        ctx.lineTo(55, 260);
        ctx.lineTo(-55, 260);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 14, sunX, sunY, 115);
      sunGlow.addColorStop(0, '#fef9c3');
      sunGlow.addColorStop(0.35, 'rgba(253, 224, 71, 0.55)');
      sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 115, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme === 'inclined_plane') {
      const sunX = CANVAS_W * 0.74 - camX * 0.025;
      const sunY = 115;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 22, sunX, sunY, 150);
      sunGlow.addColorStop(0, '#fffbeb');
      sunGlow.addColorStop(0.4, 'rgba(251, 146, 60, 0.65)');
      sunGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
      ctx.fill();
    }

    // Parallax Volumetric Clouds
    for (let i = 0; i < 8; i++) {
      const speed = 10 + (i % 3) * 6;
      const cx = ((i * 390 + time * speed - camX * 0.08) % (CANVAS_W + 500)) - 200;
      const cy = 50 + (i % 4) * 36;
      const scale = 0.7 + (i % 3) * 0.24;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.arc(28, -10, 40, 0, Math.PI * 2);
      ctx.arc(64, -4, 34, 0, Math.PI * 2);
      ctx.arc(92, 6, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const horizonY = CANVAS_H - 120;

    if (theme === 'wheel') {
      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H);
      for (let x = 0; x <= CANVAS_W + 100; x += 80) {
        const wx = x + camX * 0.12;
        const y = horizonY - 135 - Math.sin(wx * 0.0025) * 60 - Math.cos(wx * 0.006) * 28;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(CANVAS_W, CANVAS_H);
      ctx.fill();

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H);
      for (let x = 0; x <= CANVAS_W + 100; x += 60) {
        const wx = x + camX * 0.26;
        const y = horizonY - 62 - Math.sin(wx * 0.004 + 1) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(CANVAS_W, CANVAS_H);
      ctx.fill();

      // Animated Windmills on distant hills
      for (let w = 0; w < 4; w++) {
        const wmx = 320 + w * 880 - camX * 0.26;
        const wmy = horizonY - 62 - Math.sin((320 + w * 880) * 0.004 + 1) * 40;
        if (wmx > -100 && wmx < CANVAS_W + 100) {
          ctx.save();
          ctx.translate(wmx, wmy);
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-6, -46);
          ctx.lineTo(6, -46);
          ctx.lineTo(10, 0);
          ctx.closePath();
          ctx.fill();
          ctx.translate(0, -42);
          ctx.rotate(time * 1.2 + w);
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.5;
          for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -26);
            ctx.stroke();
            ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
            ctx.fillRect(0, -24, 7, 18);
          }
          ctx.restore();
        }
      }
    } else if (theme === 'inclined_plane') {
      // Desert dunes & Egyptian Pyramids
      for (let i = 0; i < 5; i++) {
        const px = 200 + i * 720 - camX * 0.16;
        const ph = 175 + (i % 2) * 50;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(px, horizonY);
        ctx.lineTo(px + ph, horizonY - ph);
        ctx.lineTo(px + ph * 1.15, horizonY);
        ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.moveTo(px + ph, horizonY - ph);
        ctx.lineTo(px + ph * 2.1, horizonY);
        ctx.lineTo(px + ph * 1.15, horizonY);
        ctx.fill();
      }
    }

    // Animated Flocks of Birds in Sky
    for (let b = 0; b < 6; b++) {
      const bx = ((b * 330 + time * (38 + (b % 3) * 12) - camX * 0.25) % (CANVAS_W + 300)) - 100;
      const by = 80 + (b % 3) * 32 + Math.sin(time * 2.5 + b) * 10;
      const flap = Math.sin(time * 9 + b * 1.7) * 8;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(bx - 11, by - flap);
      ctx.quadraticCurveTo(bx - 5, by - 4, bx, by);
      ctx.quadraticCurveTo(bx + 5, by - 4, bx + 11, by - flap);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ===========================================================================
  // WORLD SCENERY (Swaying Trees, Rabbits, Butterflies, Camels, Grass)
  // ===========================================================================
  private drawWorldScenery(theme: string, time: number, groundY: number) {
    const { ctx, engine } = this;
    ctx.save();

    const windSway = Math.sin(time * 2.4) * 8 + Math.cos(time * 1.1) * 4;

    if (theme === 'wheel') {
      const treePositions = [150, 520, 1180, 2180, 3260, 3980, 4520];
      treePositions.forEach((tx, idx) => {
        const treeH = 125 + (idx % 3) * 22;
        const sway = windSway * (0.8 + (idx % 2) * 0.4);
        const trunkGrad = ctx.createLinearGradient(tx - 12, groundY - treeH, tx + 12, groundY);
        trunkGrad.addColorStop(0, '#78350f');
        trunkGrad.addColorStop(1, '#451a03');
        ctx.fillStyle = trunkGrad;
        ctx.beginPath();
        ctx.moveTo(tx - 14, groundY);
        ctx.quadraticCurveTo(tx - 6 + sway * 0.3, groundY - treeH * 0.5, tx - 6 + sway, groundY - treeH);
        ctx.lineTo(tx + 6 + sway, groundY - treeH);
        ctx.quadraticCurveTo(tx + 6 + sway * 0.3, groundY - treeH * 0.5, tx + 14, groundY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(tx + sway - 22, groundY - treeH + 12, 34, 0, Math.PI * 2);
        ctx.arc(tx + sway + 22, groundY - treeH + 12, 34, 0, Math.PI * 2);
        ctx.arc(tx + sway, groundY - treeH - 18, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(tx + sway - 10, groundY - treeH - 22, 28, 0, Math.PI * 2);
        ctx.arc(tx + sway + 14, groundY - treeH - 8, 25, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hopping Meadow Rabbits
      [560, 2320, 3600].forEach((rx, idx) => {
        const hopPhase = (time * 2.6 + idx * 2.1) % (Math.PI * 2);
        const hopY = Math.max(0, Math.sin(hopPhase)) * 18;
        const moveX = rx + Math.sin(time * 0.9 + idx) * 55;
        const dir = Math.cos(time * 0.9 + idx) >= 0 ? 1 : -1;
        this.drawRabbit(moveX, groundY - hopY, dir, '#f8fafc', '#fca5a5');
      });

      // Fluttering Butterflies
      for (let b = 0; b < 9; b++) {
        const bx = 300 + b * 460 + Math.sin(time * 1.8 + b) * 45;
        const by = groundY - 45 - Math.abs(Math.cos(time * 2.4 + b)) * 40;
        const wing = Math.abs(Math.sin(time * 14 + b)) * 7;
        ctx.fillStyle = b % 2 === 0 ? '#fbbf24' : '#f472b6';
        ctx.beginPath();
        ctx.ellipse(bx - 4, by, wing, 5, -0.3, 0, Math.PI * 2);
        ctx.ellipse(bx + 4, by, wing, 5, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'inclined_plane') {
      // Swaying Desert Date Palms
      const palmPositions = [220, 720, 2100, 3600, 4800];
      palmPositions.forEach((px, idx) => {
        const sway = windSway * 1.1;
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, groundY);
        ctx.quadraticCurveTo(px + 18, groundY - 70, px + 26 + sway, groundY - 135);
        ctx.stroke();

        const topX = px + 26 + sway;
        const topY = groundY - 135;
        ctx.fillStyle = '#15803d';
        for (let f = -2; f <= 2; f++) {
          ctx.save();
          ctx.translate(topX, topY);
          ctx.rotate(f * 0.45 + Math.sin(time * 2 + idx + f) * 0.08);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(28, -14, 58, 12);
          ctx.quadraticCurveTo(28, 2, 0, 0);
          ctx.fill();
          ctx.restore();
        }
      });

      // Walking Desert Camels
      [500, 2250, 3900].forEach((cx, idx) => {
        const walkX = cx + Math.sin(time * 0.45 + idx) * 65;
        const dir = Math.cos(time * 0.45 + idx) >= 0 ? 1 : -1;
        this.drawCamel(walkX, groundY, dir, time);
      });
    }

    // Wind-swaying grass blades
    if (theme === 'wheel') {
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      for (let gx = 60; gx < engine.levelEndX; gx += 32) {
        if (gx > 1630 && gx < 2130) continue;
        const bladeH = 10 + (gx % 7);
        const bladeSway = Math.sin(time * 3.2 + gx * 0.05) * 6 + 3;
        ctx.beginPath();
        ctx.moveTo(gx, groundY);
        ctx.quadraticCurveTo(gx + bladeSway * 0.5, groundY - bladeH * 0.6, gx + bladeSway, groundY - bladeH);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  private drawRabbit(x: number, y: number, dir: number, furColor: string, earColor: string) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(0, -10, 13, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-13, -10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -16, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -27, 2.8, 8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(12, -26, 2.8, 8, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(8, -27, 1.4, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(13, -17, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawCamel(x: number, y: number, dir: number, time: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    const legSwing = Math.sin(time * 3.5) * 5;
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    [-14, -6, 8, 16].forEach((lx, i) => {
      const swing = i % 2 === 0 ? legSwing : -legSwing;
      ctx.beginPath();
      ctx.moveTo(lx, -26);
      ctx.lineTo(lx + swing, -2);
      ctx.stroke();
    });
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, -32, 24, 13, 0, 0, Math.PI * 2);
    ctx.arc(-2, -44, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(18, -32);
    ctx.quadraticCurveTo(30, -45, 28, -58);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(33, -59, 9, 5.5, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawLiquidPit(x1: number, x2: number, y: number, deepColor: string, surfaceColor: string, time: number, isLava: boolean) {
    const { ctx } = this;
    ctx.save();
    const grad = ctx.createLinearGradient(0, y, 0, y + 80);
    grad.addColorStop(0, surfaceColor);
    grad.addColorStop(1, deepColor);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x1, y + 80);
    for (let x = x1; x <= x2; x += 20) {
      const waveY = y + Math.sin(x * 0.04 + time * 4) * 4;
      ctx.lineTo(x, waveY);
    }
    ctx.lineTo(x2, y + 80);
    ctx.closePath();
    ctx.fill();

    if (isLava) {
      for (let i = 0; i < 8; i++) {
        const bx = x1 + 20 + ((i * 67 + time * 25) % Math.max(40, x2 - x1 - 40));
        const by = y - ((time * 30 + i * 19) % 35);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawCollectibles(time: number) {
    const { ctx, engine } = this;
    ctx.save();
    engine.collectibles.forEach((star, idx) => {
      if (star.collected) return;
      const bob = Math.sin(time * 4 + idx) * 6;
      const x = star.x;
      const y = star.y + bob;

      const glow = ctx.createRadialGradient(x, y, 2, x, y, 22);
      glow.addColorStop(0, 'rgba(250, 204, 21, 0.9)');
      glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(outerAngle) * 12;
        const py = y + Math.sin(outerAngle) * 12;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  }

  private drawConstraints(constraints: Matter.Constraint[], time: number) {
    const { ctx } = this;
    constraints.forEach((c) => {
      if (c.render && c.render.visible === false) return;
      const pA = c.bodyA ? Matter.Vector.add(c.bodyA.position, c.pointA) : c.pointA;
      const pB = c.bodyB ? Matter.Vector.add(c.bodyB.position, c.pointB) : c.pointB;
      if (!pA || !pB) return;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4.5;
      ctx.stroke();
      ctx.restore();
    });
    void time;
  }

  private drawSheave(x: number, y: number, r: number, rot: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.rotate(rot);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(-r + 3, 0);
      ctx.lineTo(r - 3, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Patrolling Armored Beetle Enemy with animated legs & glowing visor
  private drawEnemy(body: Matter.Body, time: number) {
    const { ctx } = this;
    const pos = body.position;
    const dir = body.plugin?.dir ?? 1;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(dir, 1);

    // Animated mechanical legs
    const walk = Math.sin(time * 14) * 5;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    [-12, 0, 12].forEach((lx, i) => {
      const offset = i % 2 === 0 ? walk : -walk;
      ctx.beginPath();
      ctx.moveTo(lx, 6);
      ctx.lineTo(lx + offset, 20);
      ctx.stroke();
    });

    // Armored Spiky Beetle Shell
    const shellGrad = ctx.createRadialGradient(-4, -6, 4, 0, 0, 24);
    shellGrad.addColorStop(0, '#f43f5e');
    shellGrad.addColorStop(0.7, '#be123c');
    shellGrad.addColorStop(1, '#4c0519');
    ctx.fillStyle = shellGrad;
    ctx.beginPath();
    ctx.arc(0, 4, 20, Math.PI, 0, false);
    ctx.lineTo(20, 11);
    ctx.lineTo(-20, 11);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fecdd3';
    ctx.stroke();

    // Glowing Eye Visor
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(11, -1, 6, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(13, -1, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // ▼ SALTA Indicator
    ctx.scale(dir, 1);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    this.drawRoundRect(-28, -32, 56, 15, 4);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▼ SALTA', 0, -22);
    ctx.restore();
  }

  private drawSign(body: Matter.Body, time: number) {
    const { ctx, engine } = this;
    const signId = body.label.replace('sign:', '');
    const isActive = engine.playerState.activeDialog === signId;
    const x = body.position.x;
    const y = body.position.y;

    ctx.save();
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 5, y - 5, 10, 32);

    ctx.translate(x, y - 16);
    if (isActive) {
      const pulse = 1 + Math.sin(time * 6) * 0.04;
      ctx.scale(pulse, pulse);
    }

    const boardGrad = ctx.createLinearGradient(-32, -20, 32, 20);
    if (isActive) {
      boardGrad.addColorStop(0, '#f59e0b');
      boardGrad.addColorStop(1, '#b45309');
    } else {
      boardGrad.addColorStop(0, '#92400e');
      boardGrad.addColorStop(1, '#78350f');
    }
    ctx.fillStyle = boardGrad;
    this.drawRoundRect(-30, -18, 60, 34, 7);
    ctx.fill();
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.strokeStyle = isActive ? '#fef08a' : '#451a03';
    ctx.stroke();

    ctx.fillStyle = '#fffbeb';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isActive ? '📖 ACTIU' : '🪧 CARTELL', 0, 4);
    ctx.restore();
  }

  private drawGoal(body: Matter.Body, time: number) {
    const { ctx } = this;
    const x = body.position.x;
    const y = 690;

    ctx.save();
    const portalGlow = ctx.createRadialGradient(x, y, 10, x, y, 80);
    portalGlow.addColorStop(0, 'rgba(16, 185, 129, 0.75)');
    portalGlow.addColorStop(0.5, 'rgba(52, 211, 153, 0.25)');
    portalGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - 4, y - 75, 8, 135);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y - 78, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 72);
    for (let fx = 0; fx <= 64; fx += 8) {
      const wave = Math.sin(time * 6 + fx * 0.1) * 5;
      ctx.lineTo(x + 4 + fx, y - 72 + fx * 0.2 + wave);
    }
    for (let fx = 64; fx >= 0; fx -= 8) {
      const wave = Math.sin(time * 6 + fx * 0.1) * 5;
      ctx.lineTo(x + 4 + fx, y - 32 + fx * 0.2 + wave);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('META!', x + 34, y - 46);
    ctx.restore();
  }

  private drawTarget(body: Matter.Body, time: number) {
    const { ctx } = this;
    const x = body.position.x;
    const y = body.position.y;
    const pulse = Math.sin(time * 5) * 3;

    ctx.save();
    const colors = ['#10b981', '#ffffff', '#10b981', '#fbbf24'];
    [26, 19, 12, 5].forEach((r, idx) => {
      ctx.fillStyle = colors[idx];
      ctx.beginPath();
      ctx.arc(x, y, r + (idx === 0 ? pulse : 0), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 META CAIXA', x, y - 34);
    ctx.restore();
  }

  private drawBody(body: Matter.Body, theme: string, time: number) {
    const { ctx } = this;
    ctx.save();

    const isGround =
      body.isStatic &&
      (body.label === 'cement' || body.label === 'sand' || body.label === 'snow') &&
      body.position.y >= 740 &&
      body.bounds.max.x - body.bounds.min.x > 200;

    const isCircle = Boolean((body as any).circleRadius && (body as any).circleRadius > 5);

    if (isGround) {
      const minX = body.bounds.min.x;
      const maxX = body.bounds.max.x;
      const minY = body.bounds.min.y;
      const maxY = body.bounds.max.y;
      const w = maxX - minX;
      const h = maxY - minY;

      const groundGrad = ctx.createLinearGradient(0, minY, 0, maxY);
      if (theme === 'wheel') {
        groundGrad.addColorStop(0, '#3f6212');
        groundGrad.addColorStop(0.18, '#5c4033');
        groundGrad.addColorStop(1, '#271c19');
      } else {
        groundGrad.addColorStop(0, '#d97706');
        groundGrad.addColorStop(0.25, '#92400e');
        groundGrad.addColorStop(1, '#451a03');
      }
      ctx.fillStyle = groundGrad;
      ctx.fillRect(minX, minY, w, h);

      ctx.fillStyle = theme === 'wheel' ? '#22c55e' : '#fbbf24';
      ctx.fillRect(minX, minY, w, 14);
      ctx.restore();
      return;
    }

    if (isCircle) {
      const r = (body as any).circleRadius;
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);

      if (body.label === 'wheel') {
        const tireGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
        tireGrad.addColorStop(0, '#fde047');
        tireGrad.addColorStop(0.72, '#b45309');
        tireGrad.addColorStop(0.85, '#334155');
        tireGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = tireGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = Math.max(3, r * 0.12);
        for (let s = 0; s < 8; s++) {
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, r * 0.82);
          ctx.stroke();
        }
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const rockGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
        rockGrad.addColorStop(0, '#94a3b8');
        rockGrad.addColorStop(0.7, '#475569');
        rockGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = rockGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // Polygon / Rectangular Bodies
    ctx.beginPath();
    const verts = body.vertices;
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let j = 1; j < verts.length; j++) {
      ctx.lineTo(verts[j].x, verts[j].y);
    }
    ctx.closePath();

    // Rich Material Color by Label
    let fill = '#64748b';
    if (body.label === 'wood' || body.label === 'wheel_poly' || body.label === 'lever1_beam') {
      fill = '#d97706';
    } else if (body.label === 'ramp') {
      fill = '#f59e0b';
    } else if (body.label.startsWith('mech_gate:')) {
      fill = '#334155';
    } else if (body.label.startsWith('quiz_door:')) {
      fill = '#7e22ce';
    } else if (body.label.startsWith('goal_plate:') || body.label.startsWith('btn:')) {
      fill = '#10b981';
    } else if (body.label === 'physics_box' || body.label === 'lever1_load') {
      fill = '#0284c7';
    } else if (body.label === 'lever1_fulcrum') {
      fill = '#ef4444';
    }

    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.stroke();

    const cx = body.position.x;
    const cy = body.position.y;

    if (body.label === 'physics_box' || body.label === 'lever1_load') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(body.angle);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      const mass = body.plugin?.mass || 100;
      ctx.fillText(`${mass} kg`, 0, 4);
      ctx.restore();
    } else if (body.label.startsWith('mech_gate:')) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(body.plugin?.labelText || 'PORTA', 0, 4);
      ctx.restore();
    } else if (body.label.startsWith('quiz_door:')) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#f3e8ff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('🧠 CONTROL FÍSIC', 0, 4);
      ctx.restore();
    } else if (body.label === 'wood' || body.label === 'wheel_poly') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#fffbeb';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      const sides = body.plugin?.sides || 4;
      ctx.fillText(`${sides} costats`, 0, 4);
      ctx.restore();
    }

    void time;
    ctx.restore();
  }

  // ===========================================================================
  // ARTICULATED PLAYER RENDERING (Arm/Leg Cycle, Backpack, Hardhat, Squash/Stretch)
  // ===========================================================================
  private drawPlayer(player: Matter.Body, time: number) {
    const { ctx, engine } = this;
    const pos = player.position;
    const vel = player.velocity;
    const state = engine.playerState;
    const dir = state.facingRight ? 1 : -1;
    const speed = Math.abs(vel.x);
    const isMoving = speed > 0.35;

    ctx.save();
    ctx.translate(pos.x, pos.y);

    // Ground Shadow
    if (state.isGrounded) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, 21, 16, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Squash & Stretch based on landing and jumping
    const scaleY = state.squashY * (state.isCrouching ? 0.78 : 1);
    const scaleX = (2 - state.squashY) * dir;
    ctx.scale(scaleX, scaleY);

    // Dynamic Body Lean
    const leanAngle = state.isPushing ? 0.22 : isMoving ? Math.min(0.14, speed * 0.022) : 0;
    ctx.rotate(leanAngle);

    // Articulated Running / Pushing Swing
    const runPhase = state.runCycle;
    const legSwing = isMoving && state.isGrounded ? Math.sin(runPhase) * 10 : !state.isGrounded ? 6 : 0;
    const armSwing = state.isPushing ? 13 : isMoving ? -Math.sin(runPhase) * 9 : Math.sin(time * 2.5) * 2;
    const bobY = isMoving && state.isGrounded ? Math.abs(Math.cos(runPhase)) * -3 : 0;

    ctx.translate(0, bobY - 6);

    // Back Arm
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(state.isPushing ? 16 : -armSwing, state.isPushing ? -2 : 7);
    ctx.stroke();

    // Back Leg
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(-2, 10);
    ctx.lineTo(-legSwing, 23);
    ctx.stroke();
    ctx.fillStyle = '#78350f'; // Leather boot
    this.drawRoundRect(-legSwing - 4, 21, 10, 5.5, 2.5);
    ctx.fill();

    // Engineer Backpack
    ctx.fillStyle = '#d97706';
    this.drawRoundRect(-16, -13, 9, 20, 4);
    ctx.fill();

    // Torso / Overalls
    const torsoGrad = ctx.createLinearGradient(-9, -14, 9, 12);
    torsoGrad.addColorStop(0, '#3b82f6');
    torsoGrad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = torsoGrad;
    this.drawRoundRect(-9, -14, 18, 25, 6);
    ctx.fill();

    // Utility Toolbelt
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-9, 5, 18, 3.5);

    // Front Leg
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(2, 10);
    ctx.lineTo(legSwing, 23);
    ctx.stroke();
    ctx.fillStyle = '#92400e'; // Front boot
    this.drawRoundRect(legSwing - 4, 21, 10, 5.5, 2.5);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -22, 10.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(4.5, -22, 2, 0, Math.PI * 2);
    ctx.fill();

    // Hardhat Helmet & Goggles
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -25, 11.5, Math.PI, 0, false);
    ctx.lineTo(14, -25);
    ctx.lineTo(-13, -25);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    this.drawRoundRect(2, -31, 8, 4.5, 2);
    ctx.fill();

    // Front Arm
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(2, -6);
    ctx.lineTo(state.isPushing ? 17 : armSwing, state.isPushing ? -4 : 7);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(state.isPushing ? 17 : armSwing, state.isPushing ? -4 : 7, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ===========================================================================
  // PARTICLES & WIND STREAKS (Snow, Leaves, Sand, Sparks, Footsteps)
  // ===========================================================================
  private drawParticles(time: number, camX: number, camY: number, CANVAS_W: number, CANVAS_H: number) {
    const { ctx, engine } = this;
    ctx.save();

    // 1. Dynamic Physics Burst Particles
    engine.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 2. Ambient Floating Wind Elements in Platformer
    if (engine.machineId === 'wheel' || engine.machineId === 'inclined_plane') {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const wx = camX + ((i * 190 + time * 140) % CANVAS_W);
        const wy = camY + 80 + ((i * 83 + Math.sin(time * 2 + i) * 35) % (CANVAS_H - 180));

        if (engine.machineId === 'wheel') {
          // Floating green leaves
          ctx.fillStyle = i % 2 === 0 ? 'rgba(74, 222, 128, 0.7)' : 'rgba(250, 204, 21, 0.7)';
          ctx.beginPath();
          ctx.ellipse(wx, wy, 5, 2.5, time * 2 + i, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Desert sand streaks
          ctx.strokeStyle = 'rgba(253, 230, 138, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wx, wy);
          ctx.lineTo(wx + 28, wy + 2);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  // ===========================================================================
  // FORCE VECTORS OVERLAY
  // ===========================================================================
  private drawForceVectors(bodies: Matter.Body[]) {
    const { ctx } = this;
    ctx.save();
    bodies.forEach((b) => {
      if (b.label === 'physics_box' || b.label === 'lever1_load') {
        this.drawArrow(b.position.x, b.position.y, b.position.x, b.position.y + 45, '#ef4444', 'Pes (P)');
      }
    });
    ctx.restore();
  }

  private drawArrow(x1: number, y1: number, x2: number, y2: number, color: string, label: string) {
    const { ctx } = this;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 9 * Math.cos(angle - Math.PI / 6), y2 - 9 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - 9 * Math.cos(angle + Math.PI / 6), y2 - 9 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, (x1 + x2) / 2 + 28, (y1 + y2) / 2);
    ctx.restore();
  }
}

export function render(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  const r = new GameRenderer(ctx, engine);
  r.render();
}
