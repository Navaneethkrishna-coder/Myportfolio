/**
 * Navaneeth Krishna - Professional Portfolio Script
 * AI Engineer + DevOps + Software Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- THEME TOGGLE LOGIC ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const htmlElement = document.documentElement;

  // Retrieve theme preference from localStorage or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    if (!themeIcon) return;
    
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeIcon.title = 'Switch to Light Mode';
    } else {
      themeIcon.className = 'fas fa-moon';
      themeIcon.title = 'Switch to Dark Mode';
    }
  }

  // --- NAVBAR SCROLL STATE ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- INTERSECTION OBSERVER FOR ACTIVE NAV LINKS ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(#theme-toggle-btn)');

  const sectionObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle third of viewport
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
  const animateOnScrollElems = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .zoom-in');
  const scrollObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, stop observing to prevent repeats
        observer.unobserve(entry.target);
      }
    });
  }, scrollObserverOptions);

  animateOnScrollElems.forEach(elem => scrollObserver.observe(elem));

  // --- SCROLL PROGRESS INDICATOR ---
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      const progress = (window.pageYOffset / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // --- CLICK RIPPLE EFFECT ---
  const rippleElements = document.querySelectorAll('.btn-premium, .social-icon, .portfolio-card, .nav-link');
  
  rippleElements.forEach(elem => {
    elem.classList.add('ripple-container');
    elem.addEventListener('click', function(e) {
      // Create ripple element
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Clean up any stale ripples
      const existingRipples = this.querySelectorAll('.click-ripple');
      existingRipples.forEach(r => r.remove());
      
      this.appendChild(ripple);
      
      // Clear ripple when animation ends
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });

  // --- CONTACT FORM HANDLER ---
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Bootstrap native validation check
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      // Extract form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Format the WhatsApp message content
      const formattedText = `*New Portfolio Contact Message*\n\n` +
                            `*Name:* ${name}\n` +
                            `*Email:* ${email}\n` +
                            `*Subject:* ${subject}\n\n` +
                            `*Message:*\n${message}`;

      const whatsappNumber = '919497517050';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedText)}`;

      // Simulate form submission visual feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Opening WhatsApp...';

      setTimeout(() => {
        // Success feedback
        if (formFeedback) {
          formFeedback.className = 'alert alert-success mt-3';
          formFeedback.innerHTML = '<i class="fab fa-whatsapp me-2"></i> Opening WhatsApp to send your message...';
          formFeedback.classList.remove('d-none');
        }

        // Open WhatsApp web / app in a new tab
        window.open(whatsappUrl, '_blank');

        contactForm.reset();
        contactForm.classList.remove('was-validated');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Hide alert after 5 seconds
        setTimeout(() => {
          if (formFeedback) {
            formFeedback.classList.add('d-none');
          }
        }, 5000);

      }, 1000);
    });
  }
});
