'use strict';

/* ===========================
   HEADER – scroll effect
   =========================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ===========================
   HAMBURGER MENU
   =========================== */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close menu when a nav link is clicked
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ===========================
   INTERSECTION OBSERVER – animations
   =========================== */
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate], .problema-card, .servicio-card, .beneficio-item').forEach(el => {
  animateObserver.observe(el);
});

/* ===========================
   ACTIVE NAV LINK on scroll
   =========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ===========================
   CONTACT FORM – validation & submit
   =========================== */
const form       = document.getElementById('contacto-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = submitBtn.querySelector('.btn__text');
const btnLoading = submitBtn.querySelector('.btn__loading');
const formSuccess = document.getElementById('form-success');

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (input)  input.classList.add('error');
  if (error)  error.textContent = message;
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (input)  input.classList.remove('error');
  if (error)  error.textContent = '';
}

function validateForm() {
  let valid = true;

  const nombre  = document.getElementById('nombre').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const email   = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  clearError('nombre');
  clearError('empresa');
  clearError('email');
  clearError('mensaje');

  if (!nombre) {
    showError('nombre', 'Por favor ingresá tu nombre.');
    valid = false;
  }

  if (!empresa) {
    showError('empresa', 'Por favor ingresá el nombre de tu empresa.');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('email', 'Por favor ingresá tu email.');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('email', 'El formato del email no es válido.');
    valid = false;
  }

  if (!mensaje) {
    showError('mensaje', 'Por favor contanos brevemente sobre tu empresa.');
    valid = false;
  } else if (mensaje.length < 10) {
    showError('mensaje', 'El mensaje es demasiado corto.');
    valid = false;
  }

  return valid;
}

// Real-time validation on blur
['nombre', 'empresa', 'email', 'mensaje'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => clearError(id));
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Show loading state
  btnText.hidden    = true;
  btnLoading.hidden = false;
  submitBtn.disabled = true;

  try {
    const data = {
      nombre:   document.getElementById('nombre').value.trim(),
      empresa:  document.getElementById('empresa').value.trim(),
      email:    document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      servicio: document.getElementById('servicio').value,
      mensaje:  document.getElementById('mensaje').value.trim(),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al enviar');

    // Show success
    form.reset();
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { formSuccess.hidden = true; }, 8000);
  } catch {
    alert('Hubo un error al enviar el mensaje. Por favor intentá de nuevo o escribinos directamente.');
  } finally {
    btnText.hidden    = false;
    btnLoading.hidden = true;
    submitBtn.disabled = false;
  }
});


/* ===========================
   SMOOTH SCROLL for all anchor links
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 76; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===========================
   ACTIVE NAV LINK style (CSS inject)
   =========================== */
const style = document.createElement('style');
style.textContent = `
  .nav__link.active {
    color: var(--blue-dark);
    background: var(--blue-light);
    font-weight: 600;
  }
`;
document.head.appendChild(style);
