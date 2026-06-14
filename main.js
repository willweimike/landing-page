/* ================================================================
   Autonomy — AI Agent Framework JavaScript
   Author: Bill Liu
   ================================================================ */

'use strict';

// ── 1. DOM READY ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initParticleCanvas();
  initCounterAnimation();
  initScrollReveal();
  initTerminalAnimation();
  initScoringBars();
});

// ── 2. NAV — sticky + scroll class ───────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── 3. PARTICLE CANVAS ────────────────────────────────────────
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles, animFrameId;

  const PARTICLE_COUNT    = 80;
  const CONNECTION_RADIUS = 140;
  const PARTICLE_SPEED    = 0.35;

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * width;
      this.y  = initial ? Math.random() * height : -10;
      this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.r  = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.hue = Math.random() > 0.5 ? 195 : 258;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    const hero = document.getElementById('hero');
    width  = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
    height = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_RADIUS) {
          const alpha = (1 - dist / CONNECTION_RADIUS) * 0.25;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `hsla(195, 100%, 60%, ${alpha})`);
          grad.addColorStop(1, `hsla(258, 100%, 65%, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(tick);
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    if (animFrameId) cancelAnimationFrame(animFrameId);
    tick();
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
    });
  }, { passive: true });

  init();
}

// ── 4. COUNTER ANIMATION ──────────────────────────────────────
function initCounterAnimation() {
  const stats = document.querySelectorAll('.hero__stat-value');
  if (!stats.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 1600;
    const start = performance.now();
    const isFloat = String(target).includes('.');

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);

      el.textContent = isFloat
        ? value.toFixed(1)
        : Math.floor(value);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  const hero = document.getElementById('hero');
  if (!hero) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach(el => animateCounter(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(hero);
}

// ── 5. SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  if (CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    return;
  }

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = getComputedStyle(el).getPropertyValue('--delay') || '0ms';
        setTimeout(() => el.classList.add('visible'), parseInt(delay) || 0);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ── 6. SCORING BARS ANIMATION ─────────────────────────────────
function initScoringBars() {
  const fills = document.querySelectorAll('.score-bar__fill');
  if (!fills.length) return;

  // Start bars at 0, animate when in view
  fills.forEach(fill => {
    const target = fill.style.getPropertyValue('--pct');
    fill.style.setProperty('--pct', '0%');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            fill.style.setProperty('--pct', target);
          }, 200);
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(fill);
  });
}

// ── 7. TERMINAL ANIMATION — Real Autonomy Event Sequence ──────
function initTerminalAnimation() {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  // Real events matching AutonomyStore.record_event() call order
  const LINES = [
    { type: 'cmd',  text: '$ python -m autonomy run "為專案撰寫 API 除錯技能並驗證"' },
    { type: 'info', text: '' },
    { type: 'info', text: '◆  run_started  run_id=a3f9c2e1  step=0' },
    { type: 'info', text: '   goal: "為專案撰寫 API 除錯技能並驗證"' },
    { type: 'info', text: '   interface: run  max_steps: 12' },
    { type: 'info', text: '' },
    { type: 'step', text: '── Step 1 ──────────────────────────────────────' },
    { type: 'out',  text: '   skills_considered: [api-debugging, code-editing, systematic-debugging]' },
    { type: 'out',  text: '   skills_selected:   [api-debugging, code-editing]' },
    { type: 'out',  text: '   skills_loaded:     [api-debugging v0.3.1, code-editing v1.2.0]' },
    { type: 'out',  text: '   action_intents_generated: 3 candidates (2 from model, 1 from recipe)' },
    { type: 'out',  text: '   candidates_ranked:' },
    { type: 'out',  text: '     #1 shell.execute  score=0.742  risk=LOW   evidence=0.80' },
    { type: 'out',  text: '     #2 filesystem.read score=0.611  risk=LOW   evidence=0.65' },
    { type: 'out',  text: '     #3 web.fetch       score=0.398  risk=LOW   evidence=0.40' },
    { type: 'out',  text: '   action_selected: shell.execute  risk_level=low' },
    { type: 'out',  text: '   approval_decision: allowed=True  reason="low risk, auto-approved"' },
    { type: 'out',  text: '   observation: succeeded=True  exit_code=0' },
    { type: 'out',  text: '   outcome_evaluated: execution_ok=True  goal_status=CONTINUE  confidence=1.0' },
    { type: 'out',  text: '   candidate_recipe_learned: fingerprint=7a2f91b3  evidence_count=1' },
    { type: 'info', text: '' },
    { type: 'step', text: '── Step 2 ──────────────────────────────────────' },
    { type: 'out',  text: '   skills_loaded: [api-debugging v0.3.1]' },
    { type: 'out',  text: '   action_selected: filesystem.write  risk_level=low' },
    { type: 'out',  text: '   approval_decision: allowed=True' },
    { type: 'out',  text: '   observation: succeeded=True  evidence=["skills/api-debugging.md written"]' },
    { type: 'out',  text: '   outcome_evaluated: goal_status=ACHIEVED  confidence=0.95' },
    { type: 'info', text: '' },
    { type: 'done', text: '◆  run_finished  termination=ACHIEVED  steps_executed=2' },
    { type: 'done', text: '   reason: "deterministic goal-achieving evidence accepted"' },
    { type: 'info', text: '' },
    { type: 'learn','text': '   learning_review: NEW_SKILL  candidate_id=b1e8f2a4  confidence=0.85' },
    { type: 'learn', text: '   procedure_skill_candidate_created: api-debugging-v2.md (CANDIDATE)' },
    { type: 'learn', text: '   curator_daemon_run: merge_count=0  (no duplicates detected)' },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;
  let isTyping = false;

  function createLine(type) {
    const span = document.createElement('span');
    const classMap = {
      cmd:   'terminal__line--cmd',
      info:  'terminal__line--info',
      step:  'terminal__line--warn',
      out:   'terminal__line--out',
      done:  'terminal__line--done',
      learn: 'terminal__line--learn',
    };
    span.className = `terminal__line ${classMap[type] || 'terminal__line--info'}`;
    return span;
  }

  function typeChar() {
    if (lineIndex >= LINES.length) {
      const cursor = document.createElement('span');
      cursor.className = 'terminal__cursor';
      output.appendChild(cursor);
      return;
    }

    const { type, text } = LINES[lineIndex];

    if (charIndex === 0) {
      currentLineEl = createLine(type);
      output.appendChild(currentLineEl);
    }

    if (charIndex < text.length) {
      currentLineEl.textContent += text[charIndex];
      charIndex++;

      const delay = type === 'cmd' ? 22 : text[charIndex - 1] === '.' ? 45 : 5;
      setTimeout(typeChar, delay);
    } else {
      output.appendChild(document.createElement('br'));
      lineIndex++;
      charIndex = 0;

      const pause = type === 'cmd' ? 400 : type === 'step' ? 350 : type === 'done' ? 200 : lineIndex < 6 ? 60 : 120;
      setTimeout(typeChar, pause);
    }

    output.scrollTop = output.scrollHeight;
  }

  const demoSection = document.getElementById('demo');
  if (!demoSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isTyping) {
        isTyping = true;
        typeChar();
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(demoSection);
}
