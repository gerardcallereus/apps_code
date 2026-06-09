import React, { useEffect, useRef } from 'react';

interface ParticleSimProps {
  temperature: number; // 0 to 100
  state: 'solid' | 'liquid' | 'gas';
}

const ParticleSim: React.FC<ParticleSimProps> = ({ temperature, state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const numParticles = state === 'solid' ? 64 : state === 'liquid' ? 50 : 30;

    // Initialize particles
    const init = () => {
      particles.length = 0;
      const cols = Math.ceil(Math.sqrt(numParticles));
      const spacing = canvas.width / (cols + 1);

      for (let i = 0; i < numParticles; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        let x, y;
        if (state === 'solid') {
          x = (col + 1) * spacing * 0.5 + canvas.width * 0.25;
          y = (row + 1) * spacing * 0.5 + canvas.height * 0.25;
        } else {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        }

        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 6,
        });
      }
    };

    init();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Speed multiplier based on temperature
      const speedScale = 0.5 + (temperature / 100) * 4;

      particles.forEach((p, i) => {
        // Apply movement
        if (state === 'solid') {
          // Vibration around initial position
          const homeX = particles[i].x; // This is a bit simplified, ideally store home positions
          p.x += (Math.random() - 0.5) * speedScale * 0.5;
          p.y += (Math.random() - 0.5) * speedScale * 0.5;
          
          // Constrain to small area
          const limit = 5;
          // In a real sim we'd store anchors, here we just let them wiggle
        } else {
          p.x += p.vx * speedScale;
          p.y += p.vy * speedScale;

          // Liquid container effect (settle at bottom)
          if (state === 'liquid') {
            p.vy += 0.05; // gravity
            if (p.y > canvas.height - p.radius) {
              p.y = canvas.height - p.radius;
              p.vy *= -0.2;
            }
          }

          // Wall collisions
          if (p.x < p.radius || p.x > canvas.width - p.radius) {
             p.vx *= -1;
             p.x = p.x < p.radius ? p.radius : canvas.width - p.radius;
          }
          if (p.y < p.radius || p.y > canvas.height - p.radius) {
             p.vy *= -1;
             p.y = p.y < p.radius ? p.radius : canvas.height - p.radius;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = temperature > 60 ? '#ef4444' : temperature > 30 ? '#3b82f6' : '#94a3b8';
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.fill();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [temperature, state]);

  return (
    <div className="relative w-full aspect-square bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-inner">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded text-white text-xs font-mono">
        TCM SIMULATOR v1.0
      </div>
    </div>
  );
};

export default ParticleSim;
