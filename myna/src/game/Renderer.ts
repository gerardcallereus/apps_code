import Matter from 'matter-js';
import { GameEngine } from './Engine';
import { CANVAS_W, CANVAS_H, TEXTS } from './constants';

export function render(ctx: CanvasRenderingContext2D, engine: GameEngine) {
    if (!engine.playerBody) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_W, CANVAS_H);
    ctx.clip();
    
    // Smooth camera tracking
    const targetCamX = engine.playerBody.position.x - CANVAS_W / 2.5; 
    const targetCamY = engine.playerBody.position.y - CANVAS_H * 0.6;
    
    // Lerp could be here but for this retro style exact follow is fine on X, fixed on Y if grounded
    const camX = Math.max(-200, targetCamX); // prevent extreme backwards tracking
    const camY = Math.min(200, Math.max(-200, targetCamY)); // keep Y somewhat stable
    
    ctx.translate(-camX, -camY);

    drawGameForViewport(ctx, engine, camX, camY);
    ctx.restore();
}

function drawGameForViewport(ctx: CanvasRenderingContext2D, engine: GameEngine, camX: number, camY: number) {
    const time = Date.now();
    const isWheel = engine.machineId === 'wheel' || (engine.machineId as string) === 'editor_temp';
    const isLever = engine.machineId === 'lever';
    const isPlane = engine.machineId === 'inclined_plane';
    const isPulley = engine.machineId === 'pulley';

    // Sky colors
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    if (isLever) {
        skyGrad.addColorStop(0, '#ea580c'); // orange-600
        skyGrad.addColorStop(0.5, '#f59e0b'); // amber-500
        skyGrad.addColorStop(1, '#fef08a'); // yellow-200
    } else if (isPlane) {
        skyGrad.addColorStop(0, '#1e3a8a'); // blue-900
        skyGrad.addColorStop(0.5, '#3b82f6'); // blue-500
        skyGrad.addColorStop(1, '#e0f2fe'); // sky-100
    } else if (isPulley) {
        skyGrad.addColorStop(0, '#0f172a'); // slate-900
        skyGrad.addColorStop(0.5, '#475569'); // slate-600
        skyGrad.addColorStop(1, '#cbd5e1'); // slate-300
    } else {
        skyGrad.addColorStop(0, '#0ea5e9'); // sky-500
        skyGrad.addColorStop(0.5, '#7dd3fc'); // sky-300
        skyGrad.addColorStop(1, '#e0f2fe'); // sky-100
    }

    // 1. Sky and Sun
    ctx.save();
    ctx.translate(camX, camY);
    
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); 
    
    if (isPlane) {
        // Stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            // Pseudo-random based on index
            let starX = (camX * 0.05 + i * 137) % CANVAS_W;
            let starY = (i * 97) % (CANVAS_H * 0.6);
            let twinkle = Math.sin(time / (200 + i * 10)) > 0 ? 1 : 0.4;
            ctx.globalAlpha = twinkle;
            ctx.beginPath();
            ctx.arc(starX, starY, (i % 3 === 0) ? 1.5 : 1, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    // The Sun / Moon
    ctx.save();
    ctx.translate(CANVAS_W - 150, 150);
    if (isPlane) { // Moon
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc'; 
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, -10, 40, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6'; // Cutout for crescent
        ctx.fill();
    } else {
        // Sun rays
        for(let r=0; r<12; r++) {
            ctx.rotate((Math.PI * 2) / 12 + (time / 10000));
            ctx.fillStyle = isLever ? 'rgba(255, 237, 213, 0.4)' : 'rgba(253, 224, 71, 0.4)'; 
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(20, -150); ctx.lineTo(-20, -150);
            ctx.fill();
        }
        // Sun body
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fillStyle = isLever ? '#fdba74' : '#fde047'; 
        ctx.fill();
        ctx.fillStyle = isLever ? '#fed7aa' : '#fef08a'; 
        ctx.beginPath();
        ctx.arc(-10, -10, 30, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Birds in the sky (skip in night/plane)
    if (!isPlane) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
        for(let i=0; i<8; i++) {
            let s = 0.6 + (i % 3) * 0.4;
            let bx = ((i * 450 + (time / 20) + (i*123)) % (CANVAS_W + 1000)) - 500;
            let by = 150 + Math.sin(time / 800 + i) * 60 + (i * 25);
            let wingY = Math.sin(time / 150 + i) * 12 * s;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.quadraticCurveTo(bx - 10 * s, by - 5 * s + wingY, bx - 20 * s, by - 10 * s);
            ctx.quadraticCurveTo(bx - 10 * s, by + 5 * s, bx, by);
            ctx.quadraticCurveTo(bx + 10 * s, by - 5 * s + wingY, bx + 20 * s, by - 10 * s);
            ctx.quadraticCurveTo(bx + 10 * s, by + 5 * s, bx, by);
            ctx.fill();
        }
    }
    
    // High Parallax Clouds
    const cStartX = camX * 0.05;
    const cStartI = Math.floor(cStartX / 600) - 1;
    const cEndI = Math.ceil((cStartX + CANVAS_W) / 600) + 1;
    for (let i = cStartI; i <= cEndI; i++) {
        let cloudX = i * 600 + camX * 0.95 + (time / 40);
        let cloudY = 80 + (Math.sin(i * 123) * 50);
        
        ctx.fillStyle = isLever ? 'rgba(255, 237, 213, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 50, 0, Math.PI * 2);
        ctx.arc(cloudX + 40, cloudY - 20, 60, 0, Math.PI * 2);
        ctx.arc(cloudX + 80, cloudY, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = isLever ? 'rgba(253, 186, 116, 0.5)' : 'rgba(241, 245, 249, 0.5)';
        ctx.beginPath();
        ctx.arc(cloudX + 10, cloudY + 10, 40, 0, Math.PI * 2);
        ctx.arc(cloudX + 70, cloudY + 10, 40, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // 2. Terrain Backgrounds
    const GROUND_SURFACE_Y = 750;

    // Distant Mountains or City
    ctx.save();
    if (isPulley) {
        // Distant City
        ctx.fillStyle = '#1e293b'; // slate-800
        const mStartX = camX * 0.15;
        const mStartI = Math.floor(mStartX / 150) - 1;
        const mEndI = Math.ceil((mStartX + CANVAS_W) / 150) + 1;
        for (let i = mStartI; i <= mEndI; i++) {
            let bX = i * 150 + camX * 0.85;
            // pseudo-random heights
            let bH = 150 + Math.abs(Math.sin(i * 987)) * 250;
            let bW = 80 + Math.abs(Math.sin(i * 123)) * 60;
            ctx.fillRect(bX, GROUND_SURFACE_Y - bH, bW, bH);
            
            // windows
            ctx.fillStyle = '#fef08a';
            for(let wx = 10; wx < bW - 20; wx += 25) {
                for(let wy = 20; wy < bH - 20; wy += 35) {
                    if (Math.sin(wx * wy + i) > 0.3) {
                         ctx.fillRect(bX + wx, GROUND_SURFACE_Y - bH + wy, 10, 15);
                    }
                }
            }
            ctx.fillStyle = '#1e293b';
        }
    } else {
        ctx.fillStyle = isLever ? '#7c2d12' : (isPlane ? '#334155' : '#64748b'); 
        const mStartX = camX * 0.15;
        const mStartI = Math.floor(mStartX / 500) - 1;
        const mEndI = Math.ceil((mStartX + CANVAS_W) / 500) + 1;
        for (let i = mStartI; i <= mEndI; i++) {
            let pX = i * 500 + camX * 0.85;
            ctx.beginPath();
            ctx.moveTo(pX, GROUND_SURFACE_Y + 150);
            ctx.lineTo(pX + 300, GROUND_SURFACE_Y - 250);
            ctx.lineTo(pX + 600, GROUND_SURFACE_Y + 150);
            ctx.fill();
            
            // Mountain snow peak
            ctx.fillStyle = isLever ? '#9a3412' : '#cbd5e1'; 
            ctx.beginPath();
            ctx.moveTo(pX + 220, GROUND_SURFACE_Y - 143);
            ctx.lineTo(pX + 300, GROUND_SURFACE_Y - 250);
            ctx.lineTo(pX + 380, GROUND_SURFACE_Y - 143);
            ctx.lineTo(pX + 330, GROUND_SURFACE_Y - 120);
            ctx.lineTo(pX + 300, GROUND_SURFACE_Y - 150);
            ctx.lineTo(pX + 270, GROUND_SURFACE_Y - 110);
            ctx.fill();
            ctx.fillStyle = isLever ? '#7c2d12' : (isPlane ? '#334155' : '#64748b');
        }
    }
    
    // Closer Hills
    ctx.fillStyle = isLever ? '#b45309' : (isPlane ? '#cbd5e1' : '#16a34a'); 
    const hStartX = camX * 0.3;
    const hStartI = Math.floor(hStartX / 400) - 1;
    const hEndI = Math.ceil((hStartX + CANVAS_W) / 400) + 1;
    for (let i = hStartI; i <= hEndI; i++) {
        let pX = i * 400 + camX * 0.7;
        ctx.beginPath();
        ctx.arc(pX + 200, GROUND_SURFACE_Y + 100, 300, Math.PI, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(pX + 150, GROUND_SURFACE_Y + 100, 280, Math.PI, 1.5 * Math.PI);
        ctx.fill();
        ctx.fillStyle = isLever ? '#b45309' : (isPlane ? '#cbd5e1' : '#16a34a');
    }

    drawScenarioElements(ctx, time, camX, camY, engine.machineId, engine);

    ctx.restore();

    // ---- GAME OBJECTS ----
    const allBodies = Matter.Composite.allBodies(engine.engine.world);
    const sunWorldX = camX + CANVAS_W - 150;
    const sunWorldY = camY + 150;

    // Helper to draw static layout (ground, signs, scenery)
    const drawStatic = (body: Matter.Body) => {
        if (body.label.startsWith('sign:')) {
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 4;
            
            ctx.fillStyle = '#78350f'; 
            ctx.fillRect(body.bounds.min.x + 16, body.bounds.min.y, 8, body.bounds.max.y - body.bounds.min.y); 
            ctx.fillStyle = '#b45309'; 
            ctx.fillRect(body.bounds.min.x, body.bounds.min.y - 20, 40, 30);
            
            ctx.shadowColor = 'transparent'; // Reset inner elements shadow
            ctx.fillStyle = '#fef3c7'; 
            ctx.fillRect(body.bounds.min.x + 6, body.bounds.min.y - 12, 28, 4);
            ctx.fillRect(body.bounds.min.x + 6, body.bounds.min.y - 4, 20, 4);
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.strokeRect(body.bounds.min.x, body.bounds.min.y - 20, 40, 30);
            ctx.restore();
        } else if (body.label === 'finish') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(body.bounds.min.x, body.bounds.min.y, body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);
            ctx.fillStyle = '#fff';
            ctx.fillRect(body.bounds.min.x, body.bounds.min.y, 20, body.bounds.max.y - body.bounds.min.y);
            ctx.fillStyle = '#111';
            for (let i = body.bounds.min.y; i < body.bounds.max.y; i += 20) {
                 if (Math.abs(Math.floor((i - body.bounds.min.y) / 20)) % 2 === 0) {
                     ctx.fillRect(body.bounds.min.x, i, 20, 20);
                 }
            }
        } else if (body.label.startsWith('crane_')) {
            ctx.fillStyle = '#f59e0b'; // amber-500
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 3;
            ctx.beginPath();
            const verts = body.vertices;
            ctx.moveTo(verts[0].x, verts[0].y);
            for (let j = 1; j < verts.length; j++) {
                ctx.lineTo(verts[j].x, verts[j].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Draw industrial truss pattern
            ctx.save();
            ctx.clip();
            ctx.strokeStyle = '#d97706'; // amber-600 pattern
            ctx.lineWidth = 2;
            ctx.beginPath();
            const w = body.bounds.max.x - body.bounds.min.x;
            const h = body.bounds.max.y - body.bounds.min.y;
            if (h > w) {
                 for (let y = body.bounds.min.y; y < body.bounds.max.y; y += w) {
                     ctx.moveTo(body.bounds.min.x, y);
                     ctx.lineTo(body.bounds.max.x, y + w);
                     ctx.moveTo(body.bounds.max.x, y);
                     ctx.lineTo(body.bounds.min.x, y + w);
                 }
            } else {
                 for (let x = body.bounds.min.x; x < body.bounds.max.x; x += h) {
                     ctx.moveTo(x, body.bounds.min.y);
                     ctx.lineTo(x + h, body.bounds.max.y);
                     ctx.moveTo(x + h, body.bounds.min.y);
                     ctx.lineTo(x, body.bounds.max.y);
                 }
            }
            ctx.stroke();
            ctx.restore();
            
        } else if (body.label === 'ramp') {
            ctx.fillStyle = '#1e293b'; // slate-800
            ctx.strokeStyle = '#0f172a'; // slate-900
            ctx.lineWidth = 2;
            ctx.beginPath();
            const verts = body.vertices;
            ctx.moveTo(verts[0].x, verts[0].y);
            for (let j = 1; j < verts.length; j++) {
                ctx.lineTo(verts[j].x, verts[j].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw dimension lines
            if (body.plugin && body.plugin.w && body.plugin.h) {
                const startX = body.plugin.startX;
                const w = body.plugin.w;
                const h = body.plugin.h;
                
                ctx.save();
                ctx.strokeStyle = '#38bdf8'; // Blue for dimensions
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);

                // Vertical height line (at startX + w)
                ctx.beginPath();
                ctx.moveTo(startX + w + 15, 750);
                ctx.lineTo(startX + w + 15, 750 - h);
                ctx.stroke();
                
                // Horizontal length line (at 750) But underneath
                ctx.beginPath();
                ctx.moveTo(startX, 750 + 15);
                ctx.lineTo(startX + w, 750 + 15);
                ctx.stroke();

                ctx.setLineDash([]);
                
                // Text
                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(`Alçada: ${Math.round(h/100)}m`, startX + w + 25, 750 - h/2);
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(`Base: ${Math.round(w/100)}m`, startX + w/2, 750 + 25);
                
                ctx.restore();
            }
        } else if (body.label === 'pulley_weight') {
            ctx.fillStyle = '#64748b'; // slate-500
            ctx.strokeStyle = '#334155'; // slate-700
            ctx.lineWidth = 4;
            
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            
            const w = body.bounds.max.x - body.bounds.min.x;
            const h = body.bounds.max.y - body.bounds.min.y;
            
            ctx.beginPath();
            ctx.roundRect(-w/2, -h/2, w, h, 8);
            ctx.fill();
            ctx.stroke();

            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.roundRect(-w/2 + 4, -h/2 + 4, w - 8, h/2, 4);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${body.plugin.mass}kg`, 0, 0);

            // Elaborate Pulley Systems Drawing
            ctx.restore();

            const armY = 100;
            const btnX = body.position.x - 400; // The button is at x-400 relative to weight!
            const n = body.plugin.n || 1;
            
            const drawWheel = (x: number, y: number, r: number) => {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = '#64748b'; // slate-500
                ctx.fill();
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#94a3b8'; // slate-400
                ctx.stroke();
                
                // inner rim
                ctx.beginPath();
                ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = '#1e293b';
                ctx.fill();
            }

            ctx.strokeStyle = '#e5e7eb'; // light rope
            ctx.lineWidth = 4;
            
            if (n === 1) {
                // Fixed Pulley (1 roda simple a dalt)
                const whX = body.position.x;
                const whY = armY + 20;
                
                // Ropes
                ctx.beginPath();
                // Rope straight down to the center of weight
                ctx.moveTo(whX, body.position.y);
                ctx.lineTo(whX, whY - 15);
                // Turn around wheel to fall down
                ctx.arc(whX, whY, 15, -Math.PI / 2, Math.PI, true);
                // Down to player button
                ctx.lineTo(btnX, 740); 
                ctx.stroke();
                
                drawWheel(whX, whY, 15);
                
                // Connection holding wheel to arm
                ctx.fillStyle = '#333';
                ctx.fillRect(whX - 4, armY, 8, 20);
                
            } else if (n === 2) {
                // Movable Pulley
                const topWhX = body.position.x;
                const topWhY = armY + 20;
                
                ctx.beginPath();
                ctx.moveTo(body.position.x, body.position.y);
                ctx.lineTo(topWhX, topWhY - 15);
                ctx.arc(topWhX, topWhY, 15, -Math.PI/2, Math.PI, true);
                ctx.lineTo(btnX, 740);
                ctx.stroke();
                
                ctx.fillStyle = '#333';
                ctx.fillRect(topWhX - 4, armY, 8, 20);
                drawWheel(topWhX, topWhY, 15);
                
            } else if (n >= 4) {
                // Polispast simplification: directly down to center
                const topWhY = armY + 25;
                
                ctx.beginPath();
                ctx.moveTo(body.position.x, body.position.y);
                ctx.lineTo(body.position.x, topWhY - 10);
                
                // Line falling to player
                ctx.arc(body.position.x, topWhY, 15, -Math.PI/2, Math.PI, true);
                ctx.lineTo(btnX, 740);
                ctx.stroke();
                
                // Top block
                ctx.fillStyle = '#334155';
                ctx.fillRect(body.position.x - 20, armY, 40, 30);
                drawWheel(body.position.x - 10, topWhY, 10);
                drawWheel(body.position.x + 10, topWhY, 10);
                
                // Connection holding top wheel to arm
                ctx.fillStyle = '#333';
                ctx.fillRect(body.position.x - 4, armY, 8, 20);
            }
            
            const reqForce = (body.plugin.mass * 10) / n; // F=P/n, where P = mass*10 N
            const weightForce = body.plugin.mass * 10;
            
            // Draw Vectors
            ctx.save();
            ctx.lineWidth = 4;
            // Gravity (Weight)
            let vLen = Math.min(200, weightForce * 0.1); 
            ctx.strokeStyle = '#ef4444'; ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(body.position.x, body.position.y);
            ctx.lineTo(body.position.x, body.position.y + vLen);
            ctx.stroke();
            ctx.beginPath(); // arrowhead
            ctx.moveTo(body.position.x, body.position.y + vLen);
            ctx.lineTo(body.position.x - 6, body.position.y + vLen - 12);
            ctx.lineTo(body.position.x + 6, body.position.y + vLen - 12);
            ctx.fill();

            // Tension
            let tLen = Math.min(200, reqForce * 0.1);
            ctx.strokeStyle = '#3b82f6'; ctx.fillStyle = '#3b82f6';
            
            ctx.beginPath();
            ctx.moveTo(body.position.x, body.position.y);
            ctx.lineTo(body.position.x, body.position.y - tLen);
            ctx.stroke();
            ctx.beginPath(); // arrowhead
            ctx.moveTo(body.position.x, body.position.y - tLen);
            ctx.lineTo(body.position.x - 6, body.position.y - tLen + 12);
            ctx.lineTo(body.position.x + 6, body.position.y - tLen + 12);
            ctx.fill();

            // Labels
            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('Pes (P)', body.position.x + 15, body.position.y + vLen / 2);
            ctx.fillStyle = '#60a5fa';
            ctx.fillText('Tensió (T)', body.position.x - 40, body.bounds.min.y - tLen / 2 - 10);

            ctx.restore();

            ctx.save();
            ctx.translate(body.position.x + 110, body.position.y - h/2 - 20);
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.beginPath();
            ctx.roundRect(-80, -40, 160, 80, 8);
            ctx.fill();
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`N = ${n} cordes`, 0, -20);
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`P = ${weightForce} N`, 0, 0);
            ctx.fillStyle = '#60a5fa';
            ctx.fillText(`T = ${Math.round(reqForce)} N`, 0, 20);
            ctx.restore();

        } else if (body.label.startsWith('btn:')) {
            ctx.fillStyle = '#ef4444'; // Red button
            ctx.strokeStyle = '#b91c1c';
            ctx.lineWidth = 2;
            const w = body.bounds.max.x - body.bounds.min.x;
            const h = body.bounds.max.y - body.bounds.min.y;
            ctx.beginPath();
            ctx.roundRect(body.bounds.min.x, body.bounds.min.y, w, h, 4);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PUSH', body.position.x, body.position.y);
            
        } else if (body.label === 'goal_circle') {
            const r = body.bounds.max.x - body.position.x;
            ctx.fillStyle = 'rgba(74, 222, 128, 0.3)'; // green-400 transparent
            ctx.strokeStyle = '#22c55e'; // green-500
            ctx.lineWidth = 4;
            
            ctx.beginPath();
            ctx.arc(body.position.x, body.position.y, r, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();

            // Inner circle
            ctx.beginPath();
            ctx.arc(body.position.x, body.position.y, r * 0.5, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();
            
        } else if (body.label === 'physics_box') {
            ctx.fillStyle = '#fef08a'; // yellow-200
            ctx.strokeStyle = '#a16207'; // yellow-800
            ctx.lineWidth = 3;
            ctx.beginPath();
            const verts = body.vertices;
            ctx.moveTo(verts[0].x, verts[0].y);
            for (let j = 1; j < verts.length; j++) {
                ctx.lineTo(verts[j].x, verts[j].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw physics data text floating above the box
            if (body.plugin) {
                const mass = body.plugin.mass || 50;
                const h = body.plugin.h || 2;
                const l = body.plugin.l || 10;
                
                // Force calc
                // Formula: F = W * (h / l)
                const weight = mass * 10;
                const ratio = l !== 0 ? (h / l) : 1;
                const forceNeeded = Math.round(weight * ratio);
                
                ctx.save();
                // Move HUD floating higher to not obscure the box
                ctx.translate(body.position.x, body.position.y - 150);
                
                // Box background
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.roundRect(-130, -50, 260, 130, 12);
                ctx.fill();
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                
                // Show height and length numbers
                ctx.fillText(`Massa: ${mass}kg`, 0, -26);
                ctx.fillStyle = '#38bdf8';
                ctx.fillText(`Alçada: ${Math.round(h)}m | Llarg: ${Math.round(l)}m`, 0, -2);
                
                ctx.fillStyle = '#ef4444';
                ctx.fillText(`Pes (P): ${weight} N`, 0, 18);
                
                ctx.fillStyle = '#22c55e'; // Green for F to match the arrow
                ctx.fillText(`F = ${forceNeeded} N`, 0, 36);
                
                // Visual fraction: h/l
                ctx.fillStyle = '#a3e635';
                ctx.fillText(`F = P × (${Math.round(h)}/${Math.round(l)})`, 0, 56);

                ctx.restore();
                
                // --- Draw Clean Vectors directly on the box ---
                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                
                // 1. Draw Weight vector (straight down, gravity)
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 50); // Weight down
                ctx.strokeStyle = '#ef4444'; // Red
                ctx.lineWidth = 3;
                ctx.stroke();
                // arrow head for weight
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(-6, 42);
                ctx.lineTo(6, 42);
                ctx.lineTo(0, 50);
                ctx.fill();
                
                // Label P
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText('P', 8, 45);
                
                ctx.restore();
                
                // Rotate to match the block's current angle on the ramp
                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                ctx.rotate(body.angle);

                // Required push force vector (parallel to plane, pointing upwards)
                // Since the slope goes up to the right and local X aligns with the ramp
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(40, 0); 
                ctx.strokeStyle = '#22c55e'; // Green
                ctx.lineWidth = 3;
                ctx.stroke();
                // arrow head
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.moveTo(32, -6);
                ctx.lineTo(32, 6);
                ctx.lineTo(40, 0);
                ctx.fill();
                
                // Label F
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('F', 35, -8);
                
                ctx.restore();
            }
        } 
        else if (body.label.startsWith('c_blocker:') || ['cement', 'sand', 'snow', 'stone', 'void_floor', 'wall', 'catapult_base', 'catapult_arm', 'catapult_weight', 'catapult_rock', 'castle_block', 'castle_king', 'moving_platform', 'lava', 'water'].includes(body.label)) {
            ctx.beginPath();
            const verts = body.vertices;
            ctx.moveTo(verts[0].x, verts[0].y);
            for (let j = 1; j < verts.length; j++) {
                ctx.lineTo(verts[j].x, verts[j].y);
            }
            ctx.closePath();
            
            let fill = '#fff', stroke = '#000', lineWidth = 0;
            if (body.label === 'cement') { 
                fill = '#64748b'; stroke = '#334155'; lineWidth = 4;
            } else if (body.label === 'sand') { 
                fill = '#fcd34d'; stroke = '#d97706'; lineWidth = 4;
            } else if (body.label === 'snow') { 
                fill = '#f8fafc'; stroke = '#cbd5e1'; lineWidth = 4;
            } else if (body.label === 'stone') { 
                fill = '#9ca3af'; stroke = '#4b5563'; lineWidth = 3; 
            } else if (body.label === 'void_floor') { 
                fill = 'transparent'; stroke = 'transparent'; 
            } else if (body.label === 'wall' || body.label.startsWith('c_blocker:')) { 
                fill = '#111827'; stroke = '#000'; lineWidth = 6; 
            } else if (body.label === 'catapult_base') {
                fill = '#78350f'; stroke = '#451a03'; lineWidth = 4;
            } else if (body.label === 'catapult_arm' || body.label === 'catapult_arm_lip') {
                fill = '#b45309'; stroke = '#78350f'; lineWidth = 3;
            } else if (body.label === 'catapult_weight') {
                fill = '#64748b'; stroke = '#334155'; lineWidth = 4;
            } else if (body.label === 'catapult_rock') {
                fill = '#475569'; stroke = '#1e293b'; lineWidth = 3;
                
                // Draw distance text above rock
                const catX = (engine as any).catapultX || 1800;
                const startX = catX + 550; 
                if (body.position.x > startX + 10) {
                    const dist = ((body.position.x - startX) / 100).toFixed(1);
                    ctx.save();
                    ctx.fillStyle = '#111';
                    ctx.translate(body.position.x, body.bounds.min.y - 10);
                    
                    ctx.beginPath();
                    ctx.roundRect(-30, -30, 60, 24, 6);
                    ctx.fill();
                    
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${dist}m`, 0, -18);
                    ctx.restore();
                }
            } else if (body.label === 'castle_block') {
                fill = '#d1d5db'; stroke = '#9ca3af'; lineWidth = 2; // brick gray
            } else if (body.label === 'castle_king') {
                fill = '#22c55e'; stroke = '#14532d'; lineWidth = 4; // green like the pig
            } else if (body.label === 'moving_platform') {
                fill = '#94a3b8'; stroke = '#475569'; lineWidth = 4;
            } else if (body.label === 'lava') {
                fill = '#f97316'; stroke = '#ea580c'; lineWidth = 2; // orange
                // anim
                ctx.globalAlpha = 0.8 + Math.sin(time / 200) * 0.2;
            } else if (body.label === 'water') {
                fill = '#3b82f6'; stroke = '#2563eb'; lineWidth = 2; // blue
                ctx.globalAlpha = 0.7;
            }

            ctx.fillStyle = fill;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            if (lineWidth > 0) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = stroke;
                if (body.label === 'stone' || body.label.startsWith('catapult_') || body.label.startsWith('castle_')) {
                    ctx.save();
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetY = 4;
                    ctx.stroke();
                    ctx.restore();
                } else {
                    ctx.stroke();
                }
            }
            
            if (body.label === 'castle_block') {
                 // little brick lines
                 ctx.fillStyle = '#9ca3af';
                 ctx.beginPath();
                 ctx.arc(body.bounds.min.x + 10, body.bounds.min.y + 10, 2, 0, Math.PI*2);
                 ctx.fill();
            }

            if (body.label === 'castle_king') {
                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                ctx.rotate(body.angle);
                // face relative to center
                ctx.fillStyle = '#166534';
                ctx.beginPath();
                ctx.arc(-7, -5, 4, 0, Math.PI*2);
                ctx.arc(7, -5, 4, 0, Math.PI*2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, 5, 6, 0.2, Math.PI - 0.2); // Mouth
                ctx.stroke();
                ctx.restore();
            }
            
            if (body.label === 'catapult_weight') {
                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                ctx.rotate(body.angle);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('2000kg', 0, -10);
                if (body.plugin && body.plugin.dist) {
                     ctx.fillStyle = '#facc15';
                     ctx.font = '14px sans-serif';
                     ctx.fillText(`d=${body.plugin.dist / 100}m`, 0, 10);
                }
                ctx.restore();
            }
            
            if (body.label === 'cement' || body.label === 'sand' || body.label === 'snow') {
                 let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                 for (let v of body.vertices) {
                     let dx = v.x - body.position.x;
                     let dy = v.y - body.position.y;
                     let localX = dx * Math.cos(-body.angle) - dy * Math.sin(-body.angle);
                     let localY = dx * Math.sin(-body.angle) + dy * Math.cos(-body.angle);
                     if (localX < minX) minX = localX;
                     if (localX > maxX) maxX = localX;
                     if (localY < minY) minY = localY;
                     if (localY > maxY) maxY = localY;
                 }
                 
                 ctx.save();
                 ctx.translate(body.position.x, body.position.y);
                 ctx.rotate(body.angle);

                 // Generate bushes and vegetation on cement (BEFORE drawing platform so it is behind)
                 if (body.label === 'cement') {
                     // We use the object's body id to seed deterministic placement
                     const s1 = body.id * 12.34;
                     
                     // 1. Bushes
                     for (let lx = minX + 40; lx < maxX - 40; lx += 120) {
                         let rx = lx + Math.sin(lx * 45.1 + s1) * 30; // some pseudo random drift
                         if (rx < minX + 20 || rx > maxX - 20) continue; // keep on platform
                         ctx.fillStyle = '#15803d'; // green-700
                         ctx.beginPath();
                         ctx.arc(rx, minY - 5, 30 + Math.abs(Math.sin(rx*1.2))*10, 0, Math.PI * 2);
                         ctx.arc(rx + 25, minY - 20, 35 + Math.abs(Math.sin(rx*2.3))*15, 0, Math.PI * 2);
                         ctx.arc(rx + 50, minY - 5, 25 + Math.abs(Math.sin(rx*3.4))*10, 0, Math.PI * 2);
                         ctx.fill();
                     }

                     // 2. Grass tufts & Flowers
                     for (let lx = minX + 15; lx < maxX - 15; lx += 40) {
                         let wind = Math.sin((time / 1000) + lx) * 10;
                         let height = 15 + Math.abs(Math.sin(lx * 123 + s1) * 15);
                         ctx.strokeStyle = '#22c55e';
                         ctx.lineWidth = 4;
                         ctx.beginPath();
                         ctx.moveTo(lx, minY);
                         ctx.quadraticCurveTo(lx + wind, minY - (height / 2), lx + wind * 1.5, minY - height);
                         ctx.stroke();

                         if (Math.abs(Math.sin(lx * 89 + s1)) > 0.7) { // Random chance for flower
                             let fly = minY;
                             ctx.strokeStyle = '#16a34a'; // grass for flower
                             ctx.lineWidth = 3;
                             ctx.beginPath();
                             ctx.moveTo(lx + 15, fly);
                             ctx.quadraticCurveTo(lx + 15 + wind, fly - (height), lx + 15 + wind * 2, fly - height * 1.5);
                             ctx.stroke();
                             
                             let colorHash = Math.abs(Math.sin(lx * 91 + s1));
                             ctx.fillStyle = colorHash > 0.6 ? '#ef4444' : (colorHash > 0.3 ? '#facc15' : '#c084fc'); 
                             ctx.beginPath();
                             ctx.arc(lx + 15 + wind * 2, fly - height * 1.5, 7, 0, Math.PI * 2);
                             ctx.fill();
                             ctx.fillStyle = '#fff';
                             ctx.beginPath();
                             ctx.arc(lx + 15 + wind * 2, fly - height * 1.5, 3, 0, Math.PI * 2);
                             ctx.fill();
                         }
                     }
                 }

                 // Main solid base
                 ctx.fillStyle = body.label === 'sand' ? '#fcd34d' : body.label === 'snow' ? '#f1f5f9' : '#334155';
                 ctx.fillRect(minX, minY + 5, maxX - minX, maxY - minY - 5);

                 if (body.label === 'cement') ctx.fillStyle = '#22c55e'; // Grass
                 if (body.label === 'sand') ctx.fillStyle = '#fbbf24'; // Sand ridge
                 if (body.label === 'snow') ctx.fillStyle = '#ffffff'; // Snow ridge
                 
                 ctx.beginPath();
                 ctx.roundRect(minX - 2, minY - 2, maxX - minX + 4, 18, 4);
                 ctx.fill();
                 
                 ctx.fillStyle = 'rgba(0,0,0,0.1)';
                 for(let k = 0; k < (maxX - minX) / 40; k++) {
                     if (k % 2 === 0) {
                         ctx.fillRect(minX + k * 40 + 10, minY + 30, 20, 10);
                         ctx.fillRect(minX + k * 40, minY + 60, 25, 12);
                     }
                 }
                 
                 ctx.restore();
            }
        }
    };

    const drawDynamic = (body: Matter.Body) => {
        if (body.label === 'player') {
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            drawPlayerAtOrigin(ctx, body, engine.playerState);
            ctx.restore();
        } else if (body.label === 'wheel') {
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            const radius = (body.bounds.max.x - body.bounds.min.x)/2;
            
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2*Math.PI);
            ctx.fillStyle = '#374151'; // gray-700 Tire
            ctx.fill();
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.5, 0, 2*Math.PI);
            ctx.fillStyle = '#d1d5db'; 
            ctx.fill();
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-radius*0.5, 0); ctx.lineTo(radius*0.5, 0);
            ctx.moveTo(0, -radius*0.5); ctx.lineTo(0, radius*0.5);
            ctx.stroke();
            
            ctx.restore();
            
            if (body.bounds.max.y > 750 - 8) {
                // For the wheel, draw a tiny point at the bottom to show minimal friction in absolute coords
                ctx.beginPath();
                ctx.arc(body.position.x, body.bounds.max.y, 7, 0, 2*Math.PI);
                ctx.fillStyle = '#ef4444';
                ctx.fill();
            }
        } else if (body.label === 'wood') {
             ctx.save();
             
             // Matter.js vertices are in absolute world coordinates and already account
             // for position and rotation. So we just draw them directly!
             ctx.beginPath();
             ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
             for (let j = 1; j < body.vertices.length; j++) {
                 ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
             }
             ctx.closePath();
             
             ctx.fillStyle = '#b45309'; 
             ctx.fill();
             ctx.strokeStyle = '#78350f'; 
             ctx.lineWidth = 4;
             ctx.stroke();
             
             // Wood grain texture
             ctx.clip();
             ctx.translate(body.position.x, body.position.y);
             ctx.rotate(body.angle);
             
             ctx.strokeStyle = '#92400e';
             ctx.lineWidth = 2;
             for(let k = -100; k < 100; k+=15) {
                 ctx.beginPath();
                 ctx.moveTo(-100, k);
                 ctx.quadraticCurveTo(0, k + 10, 100, k);
                 ctx.stroke();
             }
             ctx.restore();

             // Dynamic Friction Highlight (Red)
             const GROUND_Y = 750;
             let touchingFloor = false;
             
             if (body.vertices) {
                 for (let j = 0; j < body.vertices.length; j++) {
                      const v1 = body.vertices[j];
                      const v2 = body.vertices[(j+1)%body.vertices.length];
                      
                      if (v1.y > GROUND_Y - 8 && v2.y > GROUND_Y - 8) {
                          ctx.beginPath();
                          ctx.moveTo(v1.x, v1.y);
                          ctx.lineTo(v2.x, v2.y);
                          ctx.strokeStyle = '#ef4444'; // Red for friction length!
                          ctx.lineWidth = 2;
                          ctx.lineCap = 'round';
                          ctx.stroke();
                          touchingFloor = true;
                      }
                 }
                 // Fallback for single vertex touching slightly (tipping)
                 if (!touchingFloor && body.bounds.max.y > GROUND_Y - 8) {
                      for (let j = 0; j < body.vertices.length; j++) {
                          if (body.vertices[j].y > GROUND_Y - 8) {
                              ctx.beginPath();
                              ctx.arc(body.vertices[j].x, body.vertices[j].y, 7, 0, 2*Math.PI);
                              ctx.fillStyle = '#ef4444';
                              ctx.fill();
                          }
                      }
                 }
             }
        } else if (body.label === 'enemy') {
            // Determine direction based on movement
            const isMovingRight = body.velocity.x > 0;
            
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            
            if (!isMovingRight) {
                ctx.scale(-1, 1); // Flip horizontally if moving left
            }
            
            // Add slight hover bob
            const bob = Math.sin(time / 150) * 2;
            ctx.translate(0, bob);

            // Legs walking animation
            const legSwing = Math.sin(time / 100) * 8;
            ctx.fillStyle = '#f59e0b'; // orange legs
            // Back leg
            ctx.beginPath();
            ctx.roundRect(-10 + legSwing*0.5, 12, 6, 10, 3);
            ctx.fill();
            // Front leg
            ctx.beginPath();
            ctx.roundRect(4 - legSwing*0.5, 12, 6, 10, 3);
            ctx.fill();

            // Shell (Red for visibility!)
            ctx.fillStyle = '#ef4444'; // red-500
            ctx.beginPath();
            ctx.arc(0, 0, 18, Math.PI, 0); // Top half dome
            ctx.quadraticCurveTo(-20, 14, -4, 16); // Shell bottom
            ctx.lineTo(4, 16);
            ctx.quadraticCurveTo(20, 14, 18, 0);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff'; // White outline to pop
            ctx.stroke();
            
            // Shell pattern (lines)
            ctx.strokeStyle = '#991b1b'; // dark red
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-10, -5); ctx.lineTo(-6, -15);
            ctx.moveTo(0, -2); ctx.lineTo(4, -17);
            ctx.moveTo(12, -5); ctx.lineTo(16, -10);
            ctx.stroke();

            // Body border
            ctx.strokeStyle = '#eab308'; // yellow shell bottom edge
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-20, 2);
            ctx.quadraticCurveTo(0, 6, 20, 2);
            ctx.stroke();

            // Head
            ctx.fillStyle = '#fcd34d'; // skin color
            ctx.beginPath();
            ctx.arc(18, -2, 12, 0, Math.PI * 2);
            ctx.fill();

            // Eye (Angry)
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(22, -4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(18, -8);
            ctx.lineTo(24, -6);
            ctx.stroke();

            ctx.restore();
        }
    };

    // Pass 1: Static elements
    for (const body of allBodies) {
        if (body.bounds.max.x < camX - 300 || body.bounds.min.x > camX + CANVAS_W + 300 || 
            body.bounds.max.y < camY - 300 || body.bounds.min.y > camY + CANVAS_H + 300) continue;
            
        if (!['player', 'wheel', 'wood', 'enemy'].includes(body.label) && !body.label.startsWith('sign:')) {
            drawStatic(body);
        }
    }

    // Pass 1.5: Signs (drawn on top of static elements, behind players)
    for (const body of allBodies) {
        if (body.label.startsWith('sign:')) {
            if (body.bounds.max.x < camX - 300 || body.bounds.min.x > camX + CANVAS_W + 300 || 
                body.bounds.max.y < camY - 300 || body.bounds.min.y > camY + CANVAS_H + 300) continue;
            drawStatic(body);
        }
    }

    // Pass 2: Shadows for Dynamic elements
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    const groundY = 750; // Approximated ground level based on cement bodies
    for (const body of allBodies) {
        if (['player', 'wheel', 'wood', 'stone'].includes(body.label) || body.label.startsWith('sign:')) {
            if (body.bounds.max.x < camX - 300 || body.bounds.min.x > camX + CANVAS_W + 300 || 
                body.bounds.max.y < camY - 300 || body.bounds.min.y > camY + CANVAS_H + 300) continue;

            const objWidth = body.bounds.max.x - body.bounds.min.x;
            
            // Distance from the bottom of the object to the ground
            const distToGround = Math.max(0, groundY - body.bounds.max.y);
            
            // The shadow gets smaller and fainter the higher the object is
            const shadowScale = Math.max(0.2, 1 - (distToGround / 500));
            
            // Shadow X offset based on sun horizontal position relative to the object
            // The higher in the air, the further the shadow moves horizontally away from the light
            const dx = body.position.x - sunWorldX;
            const shadowXOffset = Math.sign(dx) * Math.min(Math.abs(dx * 0.5), distToGround * 1.5);
            
            ctx.save();
            ctx.globalAlpha = shadowScale;
            ctx.beginPath();
            
            // If the object is on the ground, use its shape somewhat roughly, else use an ellipse
            if (distToGround < 5) {
                const shadowShear = (dx / (CANVAS_W/2)) * 0.5; // Shear ground shadow slightly
                ctx.translate(body.position.x, body.bounds.max.y);
                ctx.transform(1, 0, shadowShear, 1, 0, 0); // Shearing 
                ctx.scale(1, 0.3); // squashed
                
                if (body.label === 'player') {
                     ctx.roundRect(-objWidth/2, -34, 24, 34, 4);
                } else if (body.label === 'wheel') {
                     ctx.arc(0, -objWidth/2, objWidth/2, 0, 2*Math.PI);
                } else if (body.label.startsWith('sign:')) {
                     ctx.translate(-body.position.x, -body.position.y);
                     ctx.rect(body.bounds.min.x + 16, body.bounds.min.y, 8, body.bounds.max.y - body.bounds.min.y); 
                     ctx.rect(body.bounds.min.x, body.bounds.min.y - 20, 40, 30);
                } else {
                     ctx.translate(-body.position.x, -body.position.y);
                     ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
                     for (let j = 1; j < body.vertices.length; j++) {
                         ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
                     }
                }
            } else {
                ctx.ellipse(
                    body.position.x + shadowXOffset, 
                    groundY, 
                    (objWidth / 2) * shadowScale, 
                    (objWidth / 6) * shadowScale, 
                    0, 0, 2*Math.PI
                );
            }
            
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Pass 3: Dynamic elements
    for (const body of allBodies) {
        if (['player', 'wheel', 'wood', 'enemy'].includes(body.label)) {
            if (body.bounds.max.x < camX - 300 || body.bounds.min.x > camX + CANVAS_W + 300 || 
                body.bounds.max.y < camY - 300 || body.bounds.min.y > camY + CANVAS_H + 300) continue;
            drawDynamic(body);
        }
    }
}

function drawPlayerAtOrigin(ctx: CanvasRenderingContext2D, body: Matter.Body, state: any) {
    if (state.deadTimer > 0 && Math.floor(state.deadTimer / 100) % 2 === 0) return;

    ctx.save();
    
    const speed = state.isMoving ? 3 : Math.abs(body.velocity.x);
    const isCrouching = state.isCrouching === true;
    const bob = state.isGrounded && speed > 0.5 && !isCrouching ? Math.sin(Date.now() / 60) * 2.5 : 0;
    
    if (!state.facingRight) {
        ctx.scale(-1, 1);
    }

    ctx.translate(0, bob);
    
    if (isCrouching) {
        ctx.translate(0, 10);
    }

    // Legs
    ctx.fillStyle = '#1e3a8a'; // blue-900 pants
    const legSwing = state.isGrounded && speed > 0.5 && !isCrouching ? Math.sin(Date.now() / 80) * 8 : 0;
    
    // Back leg
    ctx.beginPath();
    if (isCrouching) {
        ctx.roundRect(-10, 8, 14, 6, 3); // crouched leg
    } else if (!state.isGrounded) {
        // Jumping/Falling pose - leg tucked back
        ctx.roundRect(-12, 4, 12, 6, 3);
    } else {
        ctx.roundRect(-6 + legSwing*0.8, 8, 6, 12, 3);
    }
    ctx.fill();
    
    // Front leg
    ctx.beginPath();
    if (isCrouching) {
        ctx.roundRect(-4, 8, 12, 6, 3); // crouched leg
    } else if (!state.isGrounded) {
        // Jumping/Falling pose - leg extended forward slightly
        ctx.roundRect(2, 6, 6, 10, 3);
    } else {
        ctx.roundRect(0 - legSwing, 8, 6, 12, 3);
    }
    ctx.fill();

    // Backpack
    ctx.fillStyle = '#0284c7'; // sky-600
    ctx.beginPath();
    ctx.roundRect(-16, isCrouching ? -4 : -10, 10, isCrouching ? 14 : 20, 4);
    ctx.fill();

    // Body (T-Shirt)
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.beginPath();
    ctx.roundRect(-8, isCrouching ? -6 : -12, 16, isCrouching ? 16 : 22, 6);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fcd34d'; // amber-300 skin tone
    ctx.beginPath();
    ctx.arc(isCrouching ? 4 : 0, isCrouching ? -14 : -20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#451a03'; // dark brown
    ctx.beginPath();
    ctx.arc(isCrouching ? 4 : 0, isCrouching ? -16 : -22, 13, Math.PI * 0.9, Math.PI * 2.2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(isCrouching ? 8 : 4, isCrouching ? -14 : -20, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Arm
    ctx.fillStyle = '#fcd34d'; // skin
    ctx.beginPath();
    if (isCrouching) {
        ctx.roundRect(2, -4, 12, 6, 3); // arm forward
    } else if (!state.isGrounded) {
        // Jumping pose - arm raised up
        ctx.save();
        ctx.translate(2, -8);
        ctx.rotate(-Math.PI / 1.5);
        ctx.roundRect(0, 0, 6, 14, 3);
        ctx.restore();
    } else {
        ctx.roundRect(0, -8, 6, 14, 3);
    }
    ctx.fill();
    
    // Sleeve
    ctx.fillStyle = '#b91c1c'; // dark red sleeve
    ctx.beginPath();
    if (isCrouching) {
        ctx.roundRect(2, -4, 7, 6, 2);
    } else if (!state.isGrounded) {
        // Jumping pose - sleeve follows arm
        ctx.save();
        ctx.translate(2, -8);
        ctx.rotate(-Math.PI / 1.5);
        ctx.roundRect(0, 0, 7, 7, 2);
        ctx.restore();
    } else {
        ctx.roundRect(0, -8, 7, 7, 2);
    }
    ctx.fill();

    ctx.restore();
}

function drawScenarioElements(ctx: CanvasRenderingContext2D, time: number, camX: number, camY: number, machineId: string, engine: any) {
    const GROUND_SURFACE_Y = 750;
    const isLever = machineId === 'lever';
    const isPlane = machineId === 'inclined_plane';
    const isPulley = machineId === 'pulley';
    const isWheel = machineId === 'wheel' || (machineId as string) === 'editor_temp';

    const getSurfaceY = (x: number): number => {
        const bodies = Matter.Composite.allBodies(engine.engine.world);
        let highestY = GROUND_SURFACE_Y;
        for (const b of bodies) {
            if (!b.isSensor && !b.label.includes('sign') && !b.label.includes('goal') && !b.label.includes('player') && b.bounds.max.y > 600) {
                if (x >= b.bounds.min.x && x <= b.bounds.max.x) {
                    if (b.bounds.min.y < highestY) {
                        highestY = b.bounds.min.y;
                    }
                }
            }
        }
        return highestY;
    };

    const loopX = (start: number, spacing: number, cb: (i: number, x: number) => void) => {
        const startX = camX;
        const startI = Math.floor(startX / spacing) - 4;
        const endI = Math.ceil((startX + CANVAS_W) / spacing) + 4;
        for (let i = startI; i <= endI; i++) {
            cb(i, i * spacing);
        }
    };

    if (isWheel || (!isLever && !isPlane && !isPulley)) {
        // Birds and Floating Pollen
        loopX(150, 150, (i, bxBase) => {
            let s = 0.6 + (i % 3) * 0.4;
            let bX = i * 150 + camX * 0.4 + (time / 30) * (i % 2 === 0 ? 1 : -1);
            let bY = GROUND_SURFACE_Y - 50 - Math.sin((time / 400) + i) * 80 - (i * 15);
            let flap = Math.abs(Math.sin((time / 100) + i * 123)) * s; 
            
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3 * s;
            ctx.beginPath();
            ctx.moveTo(bX - 10 * s, bY - 5 * flap);
            ctx.quadraticCurveTo(bX - 5 * s, bY + 5 * flap, bX, bY);
            ctx.quadraticCurveTo(bX + 5 * s, bY + 5 * flap, bX + 10 * s, bY - 5 * flap);
            ctx.stroke();
            
            let pX = i * 80 + camX * 0.2 + (time / 40);
            let pY = GROUND_SURFACE_Y - 150 + Math.sin(time / 500 + i) * 100;
            ctx.fillStyle = 'rgba(253, 224, 71, 0.6)';
            ctx.beginPath();
            ctx.arc(pX, pY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

    }

    if (isLever) { // Desert
        // 0. Cacti with Red Flowers
        loopX(450, 450, (i, cxBase) => {
            let cX = i * 450 + camX * 0.9;
            let cSize = 0.4 + Math.abs(Math.sin(i * 123)) * 0.5; // smaller and varied
            
            ctx.save();
            ctx.translate(cX, GROUND_SURFACE_Y);
            ctx.scale(cSize, cSize);
            
            ctx.fillStyle = '#15803d'; // Green cactus
            ctx.strokeStyle = '#14532d'; 
            ctx.lineWidth = 3;
            
            // Main stem
            ctx.beginPath();
            ctx.roundRect(-10, -80, 20, 80, 10);
            ctx.fill();
            ctx.stroke();
            
            // Left arm
            ctx.beginPath();
            ctx.roundRect(-25, -50, 25, 12, 6);
            ctx.roundRect(-25, -70, 12, 32, 6);
            ctx.fill();
            ctx.stroke();
            
            // Right arm
            ctx.beginPath();
            ctx.roundRect(10, -40, 20, 12, 6);
            ctx.roundRect(20, -55, 12, 25, 6);
            ctx.fill();
            ctx.stroke();
            
            // Tiny Red Flowers (just simple circles)
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, -82, 5, 0, Math.PI * 2);
            ctx.arc(-19, -72, 4, 0, Math.PI * 2);
            ctx.arc(26, -57, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });

        // 1. Tumbleweeds
        loopX(300, 300, (i, txBase) => {
            let tX = (i * 300 + time / 10 + Math.sin(time / 2000 + i) * 50) % 5000 + camX * 0.1;
            let r = 15 + Math.abs(Math.sin(i * 45)) * 10;
            let rot = tX / r;
            let tY = GROUND_SURFACE_Y - r - Math.abs(Math.sin(tX / 60) * 15);
            ctx.save();
            ctx.translate(tX, tY);
            ctx.rotate(rot);
            ctx.strokeStyle = '#a16207'; // yellow-800
            ctx.lineWidth = 2;
            for(let a=0; a<Math.PI*2; a+=Math.PI/(2 + i%3)){
                ctx.beginPath();
                ctx.ellipse(0, 0, r, r*0.7, a, 0, Math.PI*2);
                ctx.stroke();
            }
            ctx.restore();
        });
        
        // 2. Dust clouds
        ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
        loopX(400, 400, (i, dxBase) => {
            let dX = i * 400 + camX * 0.5 + (time / 15);
            let dY = GROUND_SURFACE_Y - 30;
            ctx.beginPath();
            ctx.ellipse(dX, dY, 100 + Math.sin(time/400)*20, 40, 0, 0, Math.PI*2);
            ctx.fill();
        });
        
        // 3. Vultures/Eagles
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        loopX(500, 500, (i, vxBase) => {
            let vX = i * 500 + camX * 0.7 - (time / 45); 
            let vY = 200 + Math.sin(time/1000 + i)*50;
            let flap = Math.cos((time/300) + i); // slower flap
            ctx.beginPath();
            ctx.moveTo(vX - 20, vY - 10 * flap);
            ctx.quadraticCurveTo(vX - 10, vY + 5, vX, vY);
            ctx.quadraticCurveTo(vX + 10, vY + 5, vX + 20, vY - 10 * flap);
            ctx.stroke();
        });
    }

    if (isPlane) { // Snow
        // 1. Random Falling snow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        loopX(30, 30, (i, sXBase) => {
            let pX = i * 30 + camX * 0.2 + Math.sin(time/2000 + i)*20 + Math.sin(i * 123) * 50;
            // More random vertical distribution, different speeds
            let pY = (GROUND_SURFACE_Y - 500 + time/(10 + Math.abs(Math.sin(i*99))*10) + i * 45) % CANVAS_H;
            ctx.beginPath();
            ctx.arc(pX, pY, 1.5 + Math.abs(Math.sin(i*77))*2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Mist / Low clouds
        ctx.fillStyle = 'rgba(248, 250, 252, 0.15)'; // sky-50
        loopX(300, 300, (i, wxBase) => {
            let wX = i * 300 + camX * 0.3 + (time / 15);
            let wY = GROUND_SURFACE_Y - 80 - (i%3)*20 - Math.sin(time/1000)*20;
            ctx.beginPath();
            ctx.ellipse(wX, wY, 200 + Math.sin(time/500)*40, 50, 0, 0, Math.PI*2);
            ctx.fill();
        });

        // 3. Snow bunnies
        loopX(400, 400, (i, bxBase) => {
            let cx = i * 400 + camX * 0.9;
            
            // Snow bunnies everywhere
            let cycle = (time / 800 + i) % (Math.PI*2);
            let jump = Math.max(0, Math.sin(cycle));
            let bX = cx + time/40;
            let bY = GROUND_SURFACE_Y - jump * 30;
            
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(bX, bY, 12, Math.PI, 0); // bunny body
            ctx.fill();
            // ears
            ctx.fillStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.ellipse(bX + (jump > 0 ? 5 : 2), bY - 15, 3, 8, jump>0?0.3:-0.3, 0, Math.PI*2);
            ctx.ellipse(bX - 2, bY - 15, 3, 8, -0.1, 0, Math.PI*2);
            ctx.fill();
        });
    }

    if (isPulley) { // City
        // 1. Smoke/Steam rising
        ctx.fillStyle = 'rgba(203, 213, 225, 0.3)'; // slate-300
        loopX(300, 300, (i, sxBase) => {
            let sX = i * 300 + camX * 0.6;
            let cycle = ((time / 20) + i * 100) % 300;
            let sY = GROUND_SURFACE_Y - 150 - cycle;
            let sR = 20 + cycle * 0.3; // expands as it rises
            ctx.beginPath();
            ctx.arc(sX + Math.sin(cycle/20)*30, sY, sR, 0, Math.PI*2);
            ctx.fill();
        });

        // 2. Traffic in background
        // Removing moving cars.

        // 3. Planes
        ctx.fillStyle = '#475569';
        loopX(600, 600, (i, pxBase) => {
            let pX = i * 600 + camX * 0.2 - (time / 25);
            let pY = 100 + (i%2)*80;
            ctx.beginPath();
            ctx.ellipse(pX, pY, 15, 3, 0, 0, Math.PI*2);
            ctx.fillStyle = Math.floor(time/300)%2===0 ? '#ef4444' : '#475569';
            ctx.fill();
            ctx.fillStyle = '#475569';
            ctx.fillRect(pX - 10, pY - 5, 2, 5);
        });
    }
}
