
   // Navbar scroll background toggle & active link highlight
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = ['hero', 'programs', 'trainers', 'gallery', 'join'].map(id => document.getElementById(id));

  window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if(window.scrollY >= sectionTop) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if(link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function toggleMenu() {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    if(!expanded) {
      mobileLinks.forEach(link => link.setAttribute('tabindex', '0'));
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      mobileLinks.forEach(link => link.setAttribute('tabindex', '-1'));
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }
  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileLinks.forEach(link => link.setAttribute('tabindex', '-1'));
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        target.scrollIntoView({behavior: 'smooth'});
      }
    });
  });

  // Dumbbell 3D rotation on mouse move and scroll
  const dumbbell = document.getElementById('dumbbell');
  let dumbbellRotationX = 0;
  let dumbbellRotationY = 0;
  let dumbbellTargetX = 0;
  let dumbbellTargetY = 0;
  let dumbbellCurrentX = 0;
  let dumbbellCurrentY = 0;

  dumbbell.addEventListener('mousemove', e => {
    const rect = dumbbell.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    dumbbellTargetY = (x / rect.width) * 30;
    dumbbellTargetX = -(y / rect.height) * 20;
  });
  dumbbell.addEventListener('mouseleave', () => {
    dumbbellTargetX = 0;
    dumbbellTargetY = 0;
  });

  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    dumbbellRotationY = scrollPercent * 360;
  });

  function animateDumbbell() {
    dumbbellCurrentX += (dumbbellTargetX - dumbbellCurrentX) * 0.1;
    dumbbellCurrentY += (dumbbellTargetY - dumbbellCurrentY) * 0.1;
    const scale = 1 + 0.05 * Math.sin(Date.now() / 1000);
    dumbbell.querySelector('img').style.transform = `rotateX(${dumbbellCurrentX}deg) rotateY(${dumbbellCurrentY + dumbbellRotationY}deg) scale(${scale.toFixed(3)})`;
    requestAnimationFrame(animateDumbbell);
  }
  animateDumbbell();

  // IntersectionObserver for programs slide-in and progress bars
  const programCards = document.querySelectorAll('.program-card');
  const programObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        const progressFill = entry.target.querySelector('.progress-bar-fill');
        if(progressFill) {
          // Animate progress bar width from 0 to random between 70-100%
          const width = 70 + Math.random() * 30;
          progressFill.style.width = width + '%';
        }
      }
    });
  }, {threshold: 0.3});
  programCards.forEach(card => programObserver.observe(card));

  // Trainers flip cards and mouse tilt
  const trainerCards = document.querySelectorAll('.trainer-card');
  trainerCards.forEach(card => {
    const inner = card.querySelector('.trainer-inner');
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      inner.style.transform = `rotateY(${card.classList.contains('flipped') ? 180 : 0}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = card.classList.contains('flipped') ? 'rotateY(180deg)' : 'rotateY(0deg)';
    });
  });

  // Animate trainer stat bars on flip
  const trainerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.stat-bar-fill');
        fills.forEach(fill => {
          const width = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => {
            fill.style.width = width;
          }, 100);
        });
      }
    });
  }, {threshold: 0.5});
  trainerCards.forEach(card => trainerObserver.observe(card));

  // Gallery tilt on hover
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      item.querySelector('img').style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('img').style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // Join Now pricing cards scale in on scroll
  const pricingCards = document.querySelectorAll('.pricing-card');
  const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {threshold: 0.3});
  pricingCards.forEach(card => pricingObserver.observe(card));

  // Join Now form validation and submit
  const joinForm = document.getElementById('join-form');
  joinForm.addEventListener('submit', e => {
    e.preventDefault();
    if(!joinForm.checkValidity()) {
      joinForm.reportValidity();
      return;
    }
    alert('Thank you for joining BeastMode Gym! We will contact you shortly.');
    joinForm.reset();
  });

  // Scroll to top button in footer
  const scrollTopBtn = document.querySelector('footer a.scroll-top');
  scrollTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
  