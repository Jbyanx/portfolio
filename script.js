/**
 * Jabes Borré - Personal Portfolio JavaScript
 * Premium UI/UX & Backend Architecture Presentation
 */

document.addEventListener('DOMContentLoaded', () => {
  initMatrixParticles();
  initScrollReveal();
  initVideoModal();
  initRotativeTypewriter();
});

/**
 * 1. Matrix Particle Effect (Cursor Trail)
 * Leaves a suttle trail of green 0s and 1s that fade out rapidly.
 */
function initMatrixParticles() {
  // Throttle to avoid excessive DOM operations and high memory usage
  let lastTime = 0;
  const throttleMs = 50; 

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < throttleMs) return;
    lastTime = now;

    const particle = document.createElement('span');
    particle.className = 'matrix-particle';
    particle.innerText = Math.random() > 0.5 ? '0' : '1';
    
    // Position slightly offset from cursor
    particle.style.left = `${e.pageX}px`;
    particle.style.top = `${e.pageY - 12}px`;
    
    // Subtle size variation
    const size = Math.floor(Math.random() * 6) + 12; // 12px to 18px
    particle.style.fontSize = `${size}px`;
    
    // Subtle opacity variation for realism
    const opacity = (Math.random() * 0.4 + 0.6).toFixed(2);
    particle.style.color = `rgba(0, 255, 163, ${opacity})`;
    
    // Glowing shadow
    particle.style.textShadow = `0 0 5px rgba(0, 255, 163, 0.8)`;

    document.body.appendChild(particle);
    
    // Smooth DOM cleanup
    setTimeout(() => {
      particle.remove();
    }, 850);
  });
}

/**
 * 2. Scroll Reveal Animations (Intersection Observer)
 * Elegantly animates strategic items (Titles, Tech Cards, Project Cards)
 * as they enter the viewport. Staggered transitions are defined in CSS.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to save resources and keep state
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering view
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * 3. Premium Video Modal Lightbox
 * Safely loads, plays, and stops the demonstration video.
 * Ideal for backend portfolios to display high-fidelity dashboard/terminal details.
 */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('demo-video');
  const modalVideoSource = modalVideo ? modalVideo.querySelector('source') : null;
  const demoButtons = document.querySelectorAll('.btn-demo');
  const closeButton = document.querySelector('.modal-close');
  const backdrop = document.querySelector('.modal-backdrop');

  if (!modal || !modalVideo || !modalVideoSource) return;

  function openModal(videoSrc, title, desc) {
    modalVideoSource.src = videoSrc;
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    if (titleEl && title) titleEl.textContent = title;
    if (descEl && desc) descEl.textContent = desc;
    modalVideo.load();
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Autoplay video after loading
    modalVideo.play().catch(err => {
      console.warn("Autoplay was prevented by the browser. Awaiting user interaction.", err);
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideoSource.src = ''; // Clear source to free memory
    document.body.classList.remove('modal-open');
  }

  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.getAttribute('data-video');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      if (videoSrc) openModal(videoSrc, title, desc);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 4. Rotative Typewriter Effect
 * Sequentially types and deletes a list of skills/titles to fit mobile screens beautifully.
 */
function initRotativeTypewriter() {
  const words = ["Desarrollador Backend Java", "Spring Boot", "Microservicios"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const target = document.getElementById("typewriter-text");
  
  if (!target) return;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}
