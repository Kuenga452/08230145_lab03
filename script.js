// Navigation: smooth scroll and active section highlighting
const navLinks = document.querySelectorAll('a[data-link]');
const sections = document.querySelectorAll('[data-section]');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = `#${entry.target.id}`;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

sections.forEach(s => observer.observe(s));

// Scroll reveal: apply .reveal to sections and cards, then toggle .show on view
const revealTargets = [
  ...document.querySelectorAll('[data-section]'),
  ...document.querySelectorAll('.education-card'),
  ...document.querySelectorAll('.skill-card'),
  ...document.querySelectorAll('.project-card'),
];
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));

// Hero typing effect enhancement
const typingTarget = document.getElementById('typingText');
if (typingTarget) {
  const phrases = ['B.Ed IT Student', 'Aspiring ICT Educator', 'Problem Solver'];
  let idx = 0;
  let char = 0;
  let deleting = false;

  const type = () => {
    const current = phrases[idx % phrases.length];
    if (!deleting) {
      char++;
      typingTarget.textContent = current.slice(0, char);
      if (char === current.length) {
        setTimeout(() => { deleting = true; }, 1000);
      }
    } else {
      char--;
      typingTarget.textContent = current.slice(0, Math.max(char, 0));
      if (char === 0) {
        deleting = false;
        idx++;
      }
    }
    const delay = deleting ? 60 : 110;
    setTimeout(type, delay);
  };
  type();
}

// CTA animated hover via JS (minor jiggle)
document.querySelectorAll('.cta').forEach(btn => {
  btn.addEventListener('mouseover', () => { btn.style.transform = 'translateY(-2px) scale(1.02)'; });
  btn.addEventListener('mouseout', () => { btn.style.transform = ''; });
});

// Skills progress bar animation on reveal
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const pct = bar.getAttribute('data-progress') || '0';
      requestAnimationFrame(() => { bar.style.width = pct + '%'; });
      progressObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-card .bar').forEach(bar => progressObserver.observe(bar));

// Education expand/collapse and modal-like focus
document.querySelectorAll('.education-card').forEach(card => {
  const details = card.querySelector('.edu-details');
  const toggle = () => {
    const hidden = details.hasAttribute('hidden');
    if (hidden) {
      details.removeAttribute('hidden');
    } else {
      details.setAttribute('hidden', '');
    }
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

// Projects filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const show = category === 'all' || card.getAttribute('data-category') === category;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Hover overlays already via CSS; JS ensures focus accessibility
projectCards.forEach(card => {
  card.setAttribute('tabindex', '0');
});

// Contact form validation and thank you toast
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const showError = (input, message) => {
    const small = input.parentElement.querySelector('.error');
    if (small) small.textContent = message || '';
  };

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.name;
    const email = contactForm.email;
    const message = contactForm.message;
    let valid = true;

    if (!name.value.trim()) { showError(name, 'Name is required'); valid = false; } else { showError(name, ''); }
    const emailVal = email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailOk) { showError(email, 'Enter a valid email'); valid = false; } else { showError(email, ''); }
    if (!message.value.trim()) { showError(message, 'Message is required'); valid = false; } else { showError(message, ''); }

    if (valid) {
      contactForm.reset();
      const toast = document.getElementById('thankYou');
      if (toast) {
        toast.hidden = false;
        setTimeout(() => { toast.hidden = true; }, 2500);
      }
    }
  });
}

// Floating Social Sidebar: tooltip title is already present; add bounce on click
document.querySelectorAll('.social').forEach(icon => {
  icon.addEventListener('click', e => {
    e.preventDefault();
    icon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 300 });
  });
});

// Night mode toggle with localStorage
const themeToggle = document.getElementById('themeToggle');
const applyTheme = theme => {
  document.body.classList.toggle('dark', theme === 'dark');
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
};
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

// Footer clock
const clockEl = document.getElementById('clock');
if (clockEl) {
  const updateClock = () => {
    const now = new Date();
    clockEl.textContent = ` | ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };
  updateClock();
  setInterval(updateClock, 1000);
}

// Lightweight confetti on elements with data-confetti
const makeConfetti = (x, y) => {
  for (let i = 0; i < 16; i++) {
    const piece = document.createElement('span');
    piece.style.position = 'fixed';
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    piece.style.width = '6px';
    piece.style.height = '10px';
    piece.style.background = `hsl(${Math.random()*360}, 90%, 60%)`;
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    piece.style.borderRadius = '2px';
    piece.style.pointerEvents = 'none';
    document.body.appendChild(piece);
    const dx = (Math.random() - 0.5) * 300;
    const dy = Math.random() * 300 + 100;
    const duration = 800 + Math.random() * 600;
    piece.animate([
      { transform: 'translate(0,0) rotate(0)' , opacity: 1},
      { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration, easing: 'cubic-bezier(.12,.66,.4,1)'}).onfinish = () => piece.remove();
  }
};

document.querySelectorAll('[data-confetti]').forEach(el => {
  el.addEventListener('click', e => {
    const x = e.clientX;
    const y = e.clientY;
    makeConfetti(x, y);
  });
});

// Floating emojis in Education section
const education = document.getElementById('education');
if (education && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const emojis = ['📚','🎓','🧠','💡','✏️','🧮'];
  const spawnEmoji = () => {
    const span = document.createElement('span');
    span.className = 'edu-emoji';
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const left = Math.random() * (education.clientWidth - 24);
    span.style.left = left + 'px';
    span.style.bottom = '-10px';
    education.appendChild(span);
    setTimeout(() => span.remove(), 8000);
  };
  const intervalId = setInterval(spawnEmoji, 1200);
  // Cleanup if user navigates away (optional)
  window.addEventListener('beforeunload', () => clearInterval(intervalId));
}

