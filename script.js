// Utility: LocalStorage persistence
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cherish-theme', theme);
};

const setDirection = (dir) => {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('cherish-dir', dir);
};

// Initialize Theme & Direction
const init = () => {
  const savedTheme = localStorage.getItem('cherish-theme') || 'light';
  const savedDir = localStorage.getItem('cherish-dir') || 'ltr';
  setTheme(savedTheme);
  setDirection(savedDir);
  
  // Theme Toggle Logic
  const themeBtns = document.querySelectorAll('.theme-toggle');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
      updateThemeIcons();
    });
  });
  
  // RTL Toggle Logic
  const rtlBtns = document.querySelectorAll('.rtl-toggle');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir');
      setDirection(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });
  
  // Mobile Menu Logic
  const menuBtn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');

  const closeDrawer = () => {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };
  
  if (menuBtn && drawer && overlay) {
    menuBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    
    // Close drawer when any nav link or CTA is clicked
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }
  
  // Navbar Scroll effect (Class-based for Theme support)
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Scroll Animations
  const observerOptions = {
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  
  // Password Toggle logic
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const wrapper = this.closest('.input-wrapper') || this.parentElement;
      const input = wrapper.querySelector('input');
      if (!input) return;
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      
      const eye = this.querySelector('.eye-icon, [data-lucide="eye"], .lucide-eye');
      const eyeOff = this.querySelector('.eye-off-icon, [data-lucide="eye-off"], .lucide-eye-off');
      
      if (eye) eye.style.setProperty('display', isPassword ? 'none' : 'block', 'important');
      if (eyeOff) eyeOff.style.setProperty('display', isPassword ? 'block' : 'none', 'important');
    });
  });

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherQ = otherItem.querySelector('.faq-question');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        } else {
          question.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Gallery Filter Pills Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        galleryCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // Handle URL Query Params for Contact Form pre-selection
  const urlParams = new URLSearchParams(window.location.search);
  const budgetParam = urlParams.get('budget');
  const themeParam = urlParams.get('theme');
  const qtyParam = urlParams.get('qty');

  if (budgetParam) {
    const budgetSelect = document.querySelector('select[name="budget"], select:has(option[value="under5"])');
    if (budgetSelect) budgetSelect.value = budgetParam;
  }
  if (themeParam) {
    const themeSelect = document.querySelector('select[name="theme"], select:has(option[value="rustic"])');
    if (themeSelect) themeSelect.value = themeParam;
  }
  if (qtyParam) {
    const qtySelect = document.querySelector('select[name="qty"], select:has(option[value="50-99"])');
    if (qtySelect) qtySelect.value = qtyParam;
  }
};

const updateThemeIcons = () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  document.querySelectorAll('.theme-toggle svg, .theme-toggle i').forEach(icon => {
    const isSun = icon.classList.contains('sun-icon') || icon.classList.contains('lucide-sun') || icon.getAttribute('data-lucide') === 'sun';
    const isMoon = icon.classList.contains('moon-icon') || icon.classList.contains('lucide-moon') || icon.getAttribute('data-lucide') === 'moon';
    
    if (isSun) {
      icon.style.setProperty('display', current === 'dark' ? 'block' : 'none', 'important');
    }
    if (isMoon) {
      icon.style.setProperty('display', current === 'dark' ? 'none' : 'block', 'important');
    }
  });
};

// Initialize Lucide Icons
const initIcons = () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
    updateThemeIcons();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  init();
  initIcons();
  
  // Back to Top Button Logic
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

window.addEventListener('load', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  setTimeout(initIcons, 400);
  setTimeout(initIcons, 1200);
});
