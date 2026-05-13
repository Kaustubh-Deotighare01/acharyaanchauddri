/* ═══════════════════════════════════════════════
   VASTU MAGICKS WORLD — MAIN APP SCRIPT
═══════════════════════════════════════════════ */

/* ── PAGE ROUTER ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const p = document.getElementById('page-' + id);
  if (p) { p.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  setTimeout(initReveal, 80);
  // close mobile menu if open
  document.getElementById('mobile-menu').classList.remove('open');
}

/* ── MOBILE MENU ── */
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

/* ── SCROLL NAV ── */
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 80);
});

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.page.active .reveal:not(.visible)').forEach(el => obs.observe(el));
}

/* ── ACCORDION (day items & FAQs) ── */
function initAccordions() {
  document.querySelectorAll('.day-item .day-hd').forEach(hd => {
    hd.addEventListener('click', () => hd.closest('.day-item').classList.toggle('open'));
  });
  document.querySelectorAll('.faq-item .fq').forEach(fq => {
    fq.addEventListener('click', () => fq.closest('.faq-item').classList.toggle('open'));
  });
}

/* ── SLIDERS ── */
function getSlidesPerView(slider) {
  if (window.innerWidth <= 600) return Number(slider.dataset.mobile || 1);
  if (window.innerWidth <= 960) return Number(slider.dataset.tablet || slider.dataset.desktop || 1);
  return Number(slider.dataset.desktop || 1);
}

function renderSliderDots(slider, totalPages, currentPage) {
  const dotsWrap = slider.querySelector('.slider-dots');
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `slider-dot${i === currentPage ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide set ${i + 1}`);
    dot.addEventListener('click', () => {
      slider.dataset.currentPage = i;
      updateSlider(slider);
    });
    dotsWrap.appendChild(dot);
  }
}

function updateSlider(slider) {
  const track = slider.querySelector('.slider-track');
  if (!track) return;
  const slides = Array.from(track.children);
  if (!slides.length) return;

  const perView = Math.max(1, getSlidesPerView(slider));
  const totalPages = Math.max(1, Math.ceil(slides.length / perView));
  const gap = parseFloat(getComputedStyle(track).gap || 0);
  let currentPage = Math.min(Number(slider.dataset.currentPage || 0), totalPages - 1);

  slider.style.setProperty('--slides-per-view', perView);
  slider.dataset.currentPage = currentPage;

  const slideWidth = slides[0].getBoundingClientRect().width;
  const offset = currentPage * (slideWidth + gap) * perView;
  track.style.transform = `translateX(-${offset}px)`;

  const prevBtn = slider.querySelector('.slider-btn-prev');
  const nextBtn = slider.querySelector('.slider-btn-next');
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;

  renderSliderDots(slider, totalPages, currentPage);
}

function initSliders() {
  document.querySelectorAll('[data-slider]').forEach(slider => {
    if (!slider.dataset.sliderReady) {
      const prevBtn = slider.querySelector('.slider-btn-prev');
      const nextBtn = slider.querySelector('.slider-btn-next');
      const autoplayDelay = Number(slider.dataset.autoplay || 4500);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          slider.dataset.currentPage = Math.max(0, Number(slider.dataset.currentPage || 0) - 1);
          updateSlider(slider);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const track = slider.querySelector('.slider-track');
          const perView = Math.max(1, getSlidesPerView(slider));
          const totalPages = Math.max(1, Math.ceil(track.children.length / perView));
          slider.dataset.currentPage = Math.min(totalPages - 1, Number(slider.dataset.currentPage || 0) + 1);
          updateSlider(slider);
        });
      }

      if (!slider.dataset.autoplayReady) {
        const stopAutoplay = () => {
          clearInterval(Number(slider.dataset.autoplayTimer || 0));
        };
        const startAutoplay = () => {
          stopAutoplay();
          const timer = window.setInterval(() => {
            const track = slider.querySelector('.slider-track');
            const perView = Math.max(1, getSlidesPerView(slider));
            const totalPages = Math.max(1, Math.ceil(track.children.length / perView));
            const currentPage = Number(slider.dataset.currentPage || 0);
            slider.dataset.currentPage = currentPage >= totalPages - 1 ? 0 : currentPage + 1;
            updateSlider(slider);
          }, autoplayDelay);
          slider.dataset.autoplayTimer = String(timer);
        };

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', stopAutoplay);
        slider.addEventListener('focusout', startAutoplay);

        startAutoplay();
        slider.dataset.autoplayReady = 'true';
      }

      slider.dataset.sliderReady = 'true';
    }

    updateSlider(slider);
  });
}

/* ── CONTACT FORM SUBMIT ── */
function submitForm(btn) {
  const section = btn.closest('.form-section');
  const statusEl = section.querySelector('.form-status');
  const data = {};
  section.querySelectorAll('input,select,textarea').forEach(el => {
    if (el.name) data[el.name] = el.value;
  });
  data.recipient_email = CONFIG.recipientEmail;
  data.site_name = CONFIG.siteName;

  if (!data.user_name || !data.user_phone) {
    statusEl.className = 'form-status error';
    statusEl.textContent = '⚠ Please fill in your name and phone number.';
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;
  statusEl.textContent = '';

  // Fallback if EmailJS not configured
  if (!CONFIG.emailjsPublicKey || CONFIG.emailjsPublicKey === 'YOUR_PUBLIC_KEY') {
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    window.location.href = `mailto:${CONFIG.recipientEmail}?subject=Vastu Enquiry from ${data.user_name}&body=${encodeURIComponent(body)}`;
    btn.textContent = 'Send Enquiry →';
    btn.disabled = false;
    statusEl.className = 'form-status success';
    statusEl.textContent = '✓ Opening your email client…';
    return;
  }

  emailjs.send(CONFIG.emailjsServiceId, CONFIG.emailjsTemplateId, data)
    .then(() => {
      statusEl.className = 'form-status success';
      statusEl.textContent = '✓ Message sent! We will contact you shortly.';
      section.querySelectorAll('input,select,textarea').forEach(el => el.value = '');
      btn.textContent = 'Send Enquiry →';
      btn.disabled = false;
    })
    .catch(err => {
      statusEl.className = 'form-status error';
      statusEl.textContent = '✗ Failed to send. Please call us directly.';
      btn.textContent = 'Send Enquiry →';
      btn.disabled = false;
      console.error('EmailJS error:', err);
    });
}

/* ── SACRED GEOMETRY CANVAS ── */
(function () {
  const canvas = document.getElementById('geo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    ctx.strokeStyle = '#C9933A';
    ctx.lineWidth = 0.5;
    const r = 80;
    const pos = [[0, 0]];
    for (let a = 0; a < 6; a++) { const ag = a * Math.PI / 3; pos.push([Math.cos(ag) * r, Math.sin(ag) * r]); }
    for (let a = 0; a < 6; a++) { const ag = a * Math.PI / 3 + Math.PI / 6; pos.push([Math.cos(ag) * r * 1.73, Math.sin(ag) * r * 1.73]); }
    pos.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(cx + x, cy + y, r, 0, Math.PI * 2); ctx.stroke(); });
    [250, 340, 430, 520].forEach(rad => { ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke(); });
  }
  draw();
  window.addEventListener('resize', draw);
})();

/* ── FORM HTML GENERATOR ── */
function contactFormHTML(formId, title) {
  return `
  <div class="form-section">
    <p class="s-eyebrow">Send Enquiry</p>
    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;color:var(--cream);margin-bottom:.3rem;">${title} <em style="font-style:italic;color:var(--gold-light)">Enquiry</em></h3>
    <div class="form-grid">
      <div class="form-group"><label>Your Name *</label><input type="text" name="user_name" placeholder="Full name" required></div>
      <div class="form-group"><label>Phone *</label><input type="tel" name="user_phone" placeholder="+91 XXXXX XXXXX" required></div>
      <div class="form-group"><label>Email</label><input type="email" name="user_email" placeholder="your@email.com"></div>
      <div class="form-group"><label>City</label><input type="text" name="user_city" placeholder="Your city"></div>
      <div class="form-group"><label>Service Required</label>
        <select name="service_type">
          <option value="">Select a service</option>
          <option>Home Vastu Consultation</option>
          <option>Office / Commercial Vastu</option>
          <option>Factory Vastu</option>
          <option>Developer Project</option>
          <option>Site Visit by Acharya Ji</option>
          <option>Vastu Design</option>
          <option>Course Enquiry</option>
          <option>Free Vastu Advice</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Best Time to Call</label>
        <select name="call_time">
          <option value="">Any time</option>
          <option>Morning (9am–12pm)</option>
          <option>Afternoon (12pm–4pm)</option>
          <option>Evening (4pm–8pm)</option>
        </select>
      </div>
      <div class="form-group full"><label>Message</label><textarea name="message" rows="4" placeholder="Describe your requirements…"></textarea></div>
    </div>
    <div class="form-submit-row">
      <button class="btn-primary" onclick="submitForm(this)" type="button">Send Enquiry →</button>
      <p class="form-status" id="status-${formId}"></p>
    </div>
  </div>`;
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // EmailJS init
  if (typeof emailjs !== 'undefined' && CONFIG.emailjsPublicKey && CONFIG.emailjsPublicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(CONFIG.emailjsPublicKey);
  }

  // Populate nav brand
  document.querySelectorAll('.nav-site-name').forEach(el => el.textContent = CONFIG.siteName);
  document.querySelectorAll('.nav-founder-name').forEach(el => el.textContent = CONFIG.founderName);

  // Stats band
  const sb = document.getElementById('stats-home');
  if (sb) {
    sb.innerHTML = CONFIG.stats.map((s, i) =>
      `<div class="stat-item reveal" style="transition-delay:${i * .1}s">
        <div class="stat-num">${s.number}</div>
        <div class="stat-label">${s.label}</div>
      </div>`).join('');
  }

  // Testimonials
  const ts = document.getElementById('testi-strip');
  if (ts) {
    ts.innerHTML = CONFIG.testimonials.map((t, i) =>
      `<div class="testi-img-card reveal" style="transition-delay:${(i % 3) * .1}s">
        <img src="${t.img}" alt="${t.name}" onerror="this.style.background='#1A1610';this.style.display='block'">
        <div class="testi-caption"><p>"${t.quote}"</p><span>— ${t.name}, ${t.city}</span></div>
      </div>`).join('');
  }

  // Dynamic contact refs
  document.querySelectorAll('[data-phone1]').forEach(el => { el.textContent = CONFIG.phone1; el.href = 'tel:' + CONFIG.phone1; });
  document.querySelectorAll('[data-phone2]').forEach(el => { el.textContent = CONFIG.phone2; el.href = 'tel:' + CONFIG.phone2; });
  document.querySelectorAll('[data-address]').forEach(el => el.textContent = CONFIG.address);
  document.querySelectorAll('[data-payment]').forEach(el => el.href = CONFIG.paymentLink);
  document.querySelectorAll('[data-wa-en]').forEach(el => el.href = CONFIG.whatsappEN);
  document.querySelectorAll('[data-wa-hi]').forEach(el => el.href = CONFIG.whatsappHI);
  document.querySelectorAll('[data-facebook]').forEach(el => el.href = CONFIG.facebook);
  document.querySelectorAll('[data-instagram]').forEach(el => el.href = CONFIG.instagram);
  document.querySelectorAll('[data-youtube]').forEach(el => el.href = CONFIG.youtube);

  // Inject contact forms into placeholders
  document.querySelectorAll('[data-form]').forEach(el => {
    el.innerHTML = contactFormHTML(el.dataset.form, el.dataset.formTitle || 'Quick');
  });

  initReveal();
  initAccordions();
  initSliders();
});

window.addEventListener('resize', () => {
  initSliders();
});
