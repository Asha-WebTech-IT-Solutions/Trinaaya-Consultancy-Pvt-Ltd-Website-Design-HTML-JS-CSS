/* ================================================
   TRINAAYA CONSULTANCY - Main JavaScript
   Navigation, Smooth Scroll, Floating Buttons,
   Tab Switching, Mobile Menu, Active Nav
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Menu Toggle ---
  const toggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // --- Active Nav Link ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .mobile-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Solutions Page Tabs ---
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Tools Page Calculator Tabs ---
  var calcTabs = document.querySelectorAll('.calc-tab');
  var calcPanels = document.querySelectorAll('.calc-panel');
  calcTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-calc');
      calcTabs.forEach(function (t) { t.classList.remove('active'); });
      calcPanels.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- WhatsApp Form Submission ---
  var whatsappForms = document.querySelectorAll('.whatsapp-form');
  whatsappForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(this);
      var message = 'Hi Trinaaya! I would like to inquire about your services.\n\n';
      formData.forEach(function (value, key) {
        if (value.trim()) {
          var label = key.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
          message += label + ': ' + value + '\n';
        }
      });
      message += '\nPlease get back to me at the earliest.';
      var encoded = encodeURIComponent(message);
      var url = 'https://wa.me/918360073636?text=' + encoded;
      window.open(url, '_blank');
    });
  });

  // --- Scroll Animation (Intersection Observer) ---
  var animateEls = document.querySelectorAll('.animate-on-scroll');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animateEls.forEach(function (el) { observer.observe(el); });
  } else {
    animateEls.forEach(function (el) { el.classList.add('animated'); });
  }

  // --- Counter Animation ---
  var counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 2000;
          var start = 0;
          var step = target / (duration / 16);
          var current = start;
          var timer = setInterval(function () {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, 16);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }
});
