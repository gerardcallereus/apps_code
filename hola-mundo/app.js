// Greeting translations database
const greetings = {
  es: { text: '¡Hola Mundo!', name: 'Español', code: 'es', note: 'A4', pitch: 440 },
  en: { text: 'Hello World!', name: 'English', code: 'en', note: 'B4', pitch: 494 },
  fr: { text: 'Bonjour le Monde!', name: 'Français', code: 'fr', note: 'C5', pitch: 523 },
  de: { text: 'Hallo Welt!', name: 'Deutsch', code: 'de', note: 'D5', pitch: 587 },
  it: { text: 'Ciao Mondo!', name: 'Italiano', code: 'it', note: 'E5', pitch: 659 },
  pt: { text: 'Olá Mundo!', name: 'Português', code: 'pt', note: 'F5', pitch: 698 },
  ja: { text: 'ハローワールド!', name: '日本語', code: 'ja', note: 'G5', pitch: 784 },
  zh: { text: '你好，世界!', name: '中文', code: 'zh', note: 'A5', pitch: 880 },
  ru: { text: 'Привет, мир!', name: 'Русский', code: 'ru', note: 'B5', pitch: 988 },
  ar: { text: 'أهلاً بالعالم!', name: 'العربية', code: 'ar', note: 'C6', pitch: 1047, rtl: true },
  hi: { text: 'नमस्ते दुनिया!', name: 'हिन्दी', code: 'hi', note: 'D6', pitch: 1175 },
  ko: { text: '안녕하세요 월드!', name: '한국어', code: 'ko', note: 'E6', pitch: 1319 }
};

// Web Audio API Synthesizer for click interaction
let audioCtx = null;

function playSynthNote(pitch) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume if suspended (browser security policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Subtle sci-fi sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, audioCtx.currentTime + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (error) {
    console.warn('Audio feedback failed or not supported:', error);
  }
}

// Particle Background System
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  init() {
    this.resize();
    const particleCount = Math.min(65, Math.floor((this.canvas.width * this.canvas.height) / 18000));
    
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? 'hsla(275, 100%, 65%, 0.45)' : 
               i % 3 === 1 ? 'hsla(195, 100%, 50%, 0.45)' : 
                             'hsla(330, 100%, 60%, 0.45)'
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Update coordinates
      p.x += p.vx;
      p.y += p.vy;
      
      // Screen edge collision
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interactive force
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= dx / dist * force * 0.6;
          p.y -= dy / dist * force * 0.6;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Inter-particle links
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (110 - dist) / 110 * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(180, 200, 255, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// App Logic
document.addEventListener('DOMContentLoaded', () => {
  const greetingEl = document.getElementById('greeting-text');
  const gridContainer = document.getElementById('languages-grid');
  const countEl = document.getElementById('click-counter');
  const glowToggle = document.getElementById('toggle-glow');

  let clickCount = 0;
  let activeLang = 'es';
  let dynamicGlow = false;

  // Initialize Canvas
  const canvas = document.getElementById('particle-canvas');
  new ParticleSystem(canvas);

  // Generate Buttons Dynamically
  Object.keys(greetings).forEach(key => {
    const lang = greetings[key];
    const button = document.createElement('button');
    button.className = `lang-btn${key === activeLang ? ' active' : ''}`;
    button.setAttribute('data-lang', key);
    button.setAttribute('aria-label', `Cambiar saludo a ${lang.name}`);
    
    button.innerHTML = `
      <span class="lang-name">${lang.name}</span>
      <span class="lang-code">${lang.code}</span>
    `;

    button.addEventListener('click', () => switchLanguage(key));
    gridContainer.appendChild(button);
  });

  function switchLanguage(langKey) {
    if (langKey === activeLang && clickCount > 0) {
      // Just play sound if already active
      playSynthNote(greetings[langKey].pitch);
      return;
    }

    const nextGreeting = greetings[langKey];
    
    // Play synth note
    playSynthNote(nextGreeting.pitch);

    // Update Counter
    clickCount++;
    countEl.textContent = clickCount;

    // Remove active class from old, add to new
    document.querySelector('.lang-btn.active')?.classList.remove('active');
    document.querySelector(`[data-lang="${langKey}"]`)?.classList.add('active');

    activeLang = langKey;

    // Smooth Morph Animation
    greetingEl.classList.add('changing');
    
    setTimeout(() => {
      // Set new text
      greetingEl.textContent = nextGreeting.text;
      
      // Set text direction if RTL
      if (nextGreeting.rtl) {
        greetingEl.setAttribute('dir', 'rtl');
      } else {
        greetingEl.removeAttribute('dir');
      }

      // Visual accents logic
      applyGlowClass();

      // Trigger reveal
      greetingEl.classList.remove('changing');
    }, 250);
  }

  function applyGlowClass() {
    if (dynamicGlow) {
      greetingEl.classList.add('accented');
    } else {
      greetingEl.classList.remove('accented');
    }
  }

  // Neon toggle listener
  glowToggle.addEventListener('click', () => {
    dynamicGlow = !dynamicGlow;
    applyGlowClass();
    
    // Play a dual chord synth sound
    playSynthNote(dynamicGlow ? 880 : 330);
    setTimeout(() => playSynthNote(dynamicGlow ? 1320 : 220), 60);

    // Update SVG icon color/glow in UI
    glowToggle.style.color = dynamicGlow ? 'var(--accent-2)' : 'var(--text-secondary)';
    glowToggle.style.boxShadow = dynamicGlow ? '0 0 15px hsla(195, 100%, 50%, 0.3)' : 'none';
    glowToggle.style.borderColor = dynamicGlow ? 'var(--accent-2)' : 'hsla(0, 0%, 100%, 0.05)';
  });
});
