
/* ============================================================
   KAKALI PANDA — Portfolio Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. MOBILE NAV TOGGLE ─────────────────────────────── */
  const menuIcon = document.querySelector('#menu-icon');
  const navbar   = document.querySelector('.navbar');

  menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
  };

  /* Close nav when a link is clicked */
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      menuIcon.classList.remove('bx-x');
    });
  });


  /* ── THEME TOGGLE (Light / Dark) ──────────────────────── */
  (function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const saved  = localStorage.getItem('theme');

    /* Smooth body transition for theme switching */
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

    /* Apply saved preference */
    if (saved === 'light') {
      document.body.classList.add('light-mode');
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  })();


  /* ── 2. REACT BITS DOT FIELD (Interactive Background) ─────────────── */
  (function initDotField() {
    const canvas = document.createElement('canvas');
    canvas.id = 'dot-field-canvas';
    Object.assign(canvas.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none', // Let clicks pass through
      opacity: '0.6'
    });
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];
    
    // Physics Configuration
    const SPACING = 42; // Increased spacing to reduce number of dots (better performance)
    const MOUSE_RADIUS = 130; 
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS; // Precalculate squared radius
    const REPULSION = 0.8;
    const SPRING = 0.1; 
    const FRICTION = 0.82; 

    function init() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = [];
      
      const cols = Math.floor(width / SPACING);
      const rows = Math.floor(height / SPACING);
      
      const offsetX = (width - cols * SPACING) / 2;
      const offsetY = (height - rows * SPACING) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * SPACING;
          const y = offsetY + j * SPACING;
          dots.push({ ox: x, oy: y, x: x, y: y, vx: 0, vy: 0 });
        }
      }
    }

    window.addEventListener('resize', init);
    init();

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    let isLightMode = document.body.classList.contains('light-mode');
    
    // Check for light mode periodically instead of every frame to save performance
    setInterval(() => {
        isLightMode = document.body.classList.contains('light-mode');
    }, 500);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Setup the fill style once per frame
      ctx.fillStyle = isLightMode ? '#0891b2' : '#00ffee';
      
      // Start a single path if we wanted arcs, but we'll use fillRect for massive performance boost
      // ctx.beginPath(); // Not needed for fillRect

      dots.forEach(dot => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distSq = dx * dx + dy * dy; // Use squared distance to avoid expensive Math.sqrt when far away
        
        let radius = 0.8; // Decreased base dot size as requested

        // Repel mouse only if within radius
        if (distSq < MOUSE_RADIUS_SQ) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          
          // Fast approximation instead of Math.atan2
          dot.vx += (dx / dist) * force * REPULSION * 5;
          dot.vy += (dy / dist) * force * REPULSION * 5;
          
          // Make dots slightly larger when near mouse
          radius += force * 1.2;
        }

        // Spring back to origin
        dot.vx += (dot.ox - dot.x) * SPRING;
        dot.vy += (dot.oy - dot.y) * SPRING;

        // Apply friction
        dot.vx *= FRICTION;
        dot.vy *= FRICTION;

        // Move
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Draw (fillRect is 10x faster than arc for thousands of dots)
        ctx.fillRect(dot.x - radius, dot.y - radius, radius * 2, radius * 2);
      });

      requestAnimationFrame(animate);
    }
    animate();
  })();


  /* ── 3. SCROLL-REVEAL ANIMATIONS ─────────────────────── */
  (function initScrollReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal        { opacity:0; transform:translateY(55px); transition:opacity .7s ease, transform .7s ease; }
      .reveal.from-left  { transform:translateX(-60px); }
      .reveal.from-right { transform:translateX( 60px); }
      .reveal.scale-in   { transform:scale(0.85) translateY(30px); }
      .reveal.visible    { opacity:1 !important; transform:none !important; }
      .reveal.delay-1  { transition-delay:.1s; }
      .reveal.delay-2  { transition-delay:.2s; }
      .reveal.delay-3  { transition-delay:.3s; }
      .reveal.delay-4  { transition-delay:.4s; }
      .reveal.delay-5  { transition-delay:.5s; }
    `;
    document.head.appendChild(style);

    /* Tag elements */
    const tags = [
      { sel: '.home-greeting',    cls: 'from-left delay-1' },
      { sel: '.home-title',       cls: 'from-left delay-2' },
      { sel: '.typing-text',      cls: 'from-left delay-3' },
      { sel: '.home-bio-card',    cls: 'from-left delay-4' },
      { sel: '.home-stats',       cls: 'from-left delay-5' },
      { sel: '.social-icons',     cls: 'delay-4' },
      { sel: '.btn-group',        cls: 'delay-5' },
      { sel: '.home-image',       cls: 'from-right delay-2 scale-in' },
      { sel: '.edu-section-header', cls: 'delay-1' },
      { sel: '.timeline-item',    cls: '', multi: true },
      { sel: '.services-header',  cls: 'delay-1' },
      { sel: '.service-card',     cls: 'scale-in', multi: true },
      { sel: '.skills-header',    cls: 'delay-1' },
      { sel: '.skill-card',       cls: 'scale-in', multi: true },
      { sel: '.contact-header',   cls: 'delay-1' },
      { sel: '.contact-info',     cls: 'from-left delay-2' },
      { sel: '.contact-form-card',cls: 'from-right delay-3' },
      { sel: '.footer-brand',     cls: 'from-left delay-1' },
      { sel: '.footer-links-group', cls: '', multi: true },
    ];

    tags.forEach(({ sel, cls, multi }) => {
      const els = multi ? document.querySelectorAll(sel) : [document.querySelector(sel)];
      els.forEach((el, i) => {
        if (!el) return;
        el.classList.add('reveal');
        if (cls) cls.split(' ').forEach(c => el.classList.add(c));
        if (multi && !cls.includes('delay')) el.classList.add(`delay-${Math.min(i + 1, 5)}`);
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  })();


  /* ── 4. CUSTOM GLOWING CURSOR ─────────────────────────── */
  (function initCursor() {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    const css  = document.createElement('style');
    css.textContent = `
      #cursor-dot {
        width:8px; height:8px; border-radius:50%;
        background:var(--main-color);
        position:fixed; top:0; left:0; pointer-events:none;
        z-index:99999; transform:translate(-50%,-50%);
        box-shadow:0 0 10px var(--main-color), 0 0 20px var(--main-color);
        transition:background .2s, transform .1s;
      }
      #cursor-ring {
        width:36px; height:36px; border-radius:50%;
        border:2px solid rgba(0,255,238,.5);
        position:fixed; top:0; left:0; pointer-events:none;
        z-index:99998; transform:translate(-50%,-50%);
        transition:transform .12s ease, width .25s, height .25s, border-color .25s;
      }
      a:hover ~ #cursor-ring, button:hover ~ #cursor-ring { border-color:var(--main-color); }
      body.hovering #cursor-ring { width:52px; height:52px; border-color:var(--main-color); }
      body.hovering #cursor-dot  { transform:translate(-50%,-50%) scale(1.8); }
      @media(max-width:768px){ #cursor-dot, #cursor-ring { display:none; } }
    `;
    document.head.appendChild(css);
    dot.id  = 'cursor-dot';
    ring.id = 'cursor-ring';
    document.body.append(dot, ring);

    let rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
      rx += (e.clientX - rx) * 0.12;
      ry += (e.clientY - ry) * 0.12;
    });

    function animRing() {
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button, .service-card, .skill-card, .timeline-item, .btn, .btn-1').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  })();


  /* ── 5. STAT COUNTER ANIMATION ───────────────────────── */
  (function initCounters() {
    const nums = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const target = parseInt(el.textContent) || 0;
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const step  = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => observer.observe(n));
  })();


  /* ── 6. ACTIVE NAV LINK ON SCROLL ────────────────────── */
  (function initActiveNav() {
    const sections = document.querySelectorAll('section[id], footer');
    const links    = document.querySelectorAll('.navbar a');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.navbar a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  })();


  /* ── 7. 3-D TILT ON CARDS ────────────────────────────── */
  (function initTilt() {
    const cards = document.querySelectorAll(
      '.service-card, .skill-card, .contact-form-card, .contact-info, .home-bio-card'
    );

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) *  8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        card.style.transition = 'transform .05s';
        /* inner glow follow */
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,255,238,0.06) 0%, rgba(255,255,255,0.02) 70%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform .4s ease, background .4s ease';
        card.style.background = '';
      });
    });
  })();


  /* ── 8. FLOATING DECORATION SHAPES ──────────────────── */
  (function initFloatingShapes() {
    const style = document.createElement('style');
    style.textContent = `
      .float-shape {
        position:fixed; border-radius:50%; pointer-events:none;
        z-index:0; opacity:0; filter:blur(60px);
        animation: floatAnim 12s ease-in-out infinite;
      }
      @keyframes floatAnim {
        0%   { transform:translateY(0px)   scale(1);    opacity:.12; }
        50%  { transform:translateY(-40px) scale(1.08); opacity:.2;  }
        100% { transform:translateY(0px)   scale(1);    opacity:.12; }
      }
    `;
    document.head.appendChild(style);

    const shapes = [
      { w:320, h:320, top:'10%',  left:'5%',   color:'rgba(0,255,238,0.9)',  delay:'0s',   dur:'14s' },
      { w:260, h:260, top:'60%',  right:'6%',  color:'rgba(124,92,191,0.9)', delay:'3s',   dur:'11s' },
      { w:200, h:200, top:'35%',  left:'45%',  color:'rgba(255,107,203,0.8)',delay:'6s',   dur:'16s' },
      { w:150, h:150, top:'80%',  left:'20%',  color:'rgba(0,200,255,0.8)',  delay:'1.5s', dur:'9s'  },
    ];

    shapes.forEach(s => {
      const el = document.createElement('div');
      el.className = 'float-shape';
      Object.assign(el.style, {
        width:  s.w + 'px',
        height: s.h + 'px',
        top:    s.top  || 'auto',
        left:   s.left || 'auto',
        right:  s.right || 'auto',
        background: s.color,
        animationDelay:    s.delay,
        animationDuration: s.dur,
      });
      document.body.appendChild(el);
    });
  })();


  /* ── 9. NAVBAR SHRINK + GLASS ON SCROLL ─────────────── */
  (function initNavScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.style.padding    = '1.2rem 8%';
        header.style.boxShadow  = '0 4px 30px rgba(0,0,0,0.5)';
        header.style.backdropFilter = 'blur(24px)';
      } else {
        header.style.padding    = '';
        header.style.boxShadow  = '';
        header.style.backdropFilter = '';
      }
    });
  })();


  /* ── 10. SKILL BAR ANIMATED WIDTH ON SCROLL ─────────── */
  (function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.style.getPropertyValue('--fill') || '0%';
          entry.target.style.width = fill;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => {
      b.style.width = '0%';
      observer.observe(b);
    });
  })();


  /* ── 11. GLITCH EFFECT ON NAME (hover trigger) ───────── */
  (function initGlitch() {
    const css = document.createElement('style');
    css.textContent = `
      .name-gradient {
        position: relative;
        display: inline-block;
      }
      .name-gradient::before,
      .name-gradient::after {
        content: attr(data-text);
        position: absolute; top:0; left:0;
        background: inherit;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 0;
      }
      .name-gradient:hover::before {
        opacity: .7;
        animation: glitch1 .3s steps(1) infinite;
        clip-path: polygon(0 20%, 100% 20%, 100% 45%, 0 45%);
        transform: translate(-3px, 0);
        filter: hue-rotate(90deg);
      }
      .name-gradient:hover::after {
        opacity: .7;
        animation: glitch2 .3s steps(1) infinite;
        clip-path: polygon(0 55%, 100% 55%, 100% 80%, 0 80%);
        transform: translate(3px, 0);
        filter: hue-rotate(-90deg);
      }
      @keyframes glitch1 {
        0%  { clip-path: polygon(0 10%, 100% 10%, 100% 35%, 0 35%); transform:translate(-4px,0); }
        33% { clip-path: polygon(0 50%, 100% 50%, 100% 70%, 0 70%); transform:translate(4px,0);  }
        66% { clip-path: polygon(0 25%, 100% 25%, 100% 55%, 0 55%); transform:translate(-2px,0); }
        100%{ clip-path: polygon(0 10%, 100% 10%, 100% 35%, 0 35%); transform:translate(-4px,0); }
      }
      @keyframes glitch2 {
        0%  { clip-path: polygon(0 60%, 100% 60%, 100% 85%, 0 85%); transform:translate(3px,0);  }
        33% { clip-path: polygon(0 30%, 100% 30%, 100% 55%, 0 55%); transform:translate(-3px,0); }
        66% { clip-path: polygon(0 70%, 100% 70%, 100% 90%, 0 90%); transform:translate(4px,0);  }
        100%{ clip-path: polygon(0 60%, 100% 60%, 100% 85%, 0 85%); transform:translate(3px,0);  }
      }
    `;
    document.head.appendChild(css);
    const nameEl = document.querySelector('.name-gradient');
    if (nameEl) nameEl.setAttribute('data-text', nameEl.textContent);
  })();


  /* ── 12. SECTION ENTRANCE TEXT SPLIT ─────────────────── */
  (function initTextSplit() {
    const css = document.createElement('style');
    css.textContent = `
      .char-wrap { display:inline-block; overflow:hidden; }
      .char      { display:inline-block; transform:translateY(110%); opacity:0;
                   transition: transform .5s cubic-bezier(.23,1,.32,1), opacity .5s ease; }
      .char.in   { transform:translateY(0); opacity:1; }
    `;
    document.head.appendChild(css);

    const targets = document.querySelectorAll('.contact-heading, .skills-heading');
    targets.forEach(el => {
      const text = el.innerHTML;
      el.innerHTML = text.replace(/(<[^>]*>)|([^<])/g, (m, tag, char) => {
        if (tag) return tag;
        if (char === ' ') return ' ';
        return `<span class="char-wrap"><span class="char">${char}</span></span>`;
      });

      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          el.querySelectorAll('.char').forEach((ch, i) => {
            setTimeout(() => ch.classList.add('in'), i * 38);
          });
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  })();

  /* ── 13. SCROLL PROGRESS BAR ─────────────────────────── */
  (function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  })();

  /* ── 14. MAGNETIC BUTTONS ────────────────────────────── */
  (function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .btn-1, .btnn');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        
        // Move button slightly towards cursor
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = `translate(0px, 0px)`;
      });
    });
  })();

  /* ── 15. PARALLAX FLOATING BLOBS ─────────────────────── */
  (function initParallax() {
    const blobs = document.querySelectorAll('.float-shape');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      blobs.forEach((blob, index) => {
        // Different speed for different blobs based on index
        const speed = (index + 1) * 0.15;
        // Apply transform. Keeping the default breathe animation running is fine, 
        // but we translate it vertically based on scroll.
        // To not override the CSS keyframes completely, we use a wrapper approach if needed,
        // or just apply an extra margin/translate.
        blob.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  })();

}); // end DOMContentLoaded
