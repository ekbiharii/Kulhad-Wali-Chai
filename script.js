const loadingScreen = document.getElementById('loading-screen');
const loadingCountdown = document.getElementById('loading-countdown');
let countdown = 10;

const countdownTimer = window.setInterval(function() {
  countdown -= 1;
  if (countdown > 0) {
    loadingCountdown.textContent = countdown;
  } else {
    loadingCountdown.textContent = '0';
    window.clearInterval(countdownTimer);
  }
}, 1000);

window.setTimeout(function() {
  loadingScreen.classList.add('fade-out');
  document.body.classList.remove('loading');
}, 10000);

const moodConfig = {
  'bulk-order': {
    title: 'Tell us about your bulk chai order',
    copy: 'Perfect for office chai breaks, events, weddings, and special gatherings.',
    fieldLabel: 'Event or quantity details',
    buttonText: 'Send Bulk Order Request',
    successText: 'bulk order request'
  },
  franchise: {
    title: 'Let’s talk franchise opportunities',
    copy: 'We’re looking for passionate partners who want to serve warm chai culture.',
    fieldLabel: 'Preferred location or city',
    buttonText: 'Send Franchise Enquiry',
    successText: 'franchise enquiry'
  },
  feedback: {
    title: 'We’d love your feedback',
    copy: 'Tell us what’s brewing well and what can be even better.',
    fieldLabel: 'What would you like to share?',
    buttonText: 'Send Feedback',
    successText: 'feedback message'
  },
  hi: {
    title: 'Say hello to the chai crew',
    copy: 'We’re always happy to hear from chai lovers and community friends.',
    fieldLabel: 'What would you like to say?',
    buttonText: 'Send Hello',
    successText: 'hello message'
  }
};

const moodButtons = document.querySelectorAll('.mood-btn');
const contactForm = document.getElementById('contactForm');
const contactFormTitle = document.getElementById('contact-form-title');
const contactFormCopy = document.getElementById('contact-form-copy');
const extraField = document.getElementById('extraField');
const extraFieldLabel = document.getElementById('extraFieldLabel');
const submitButton = contactForm.querySelector('.btn');
const successAnnounce = document.getElementById('successAnnounce');
const meterPercent = document.getElementById('meterPercent');
const kulhadTea = document.getElementById('kulhadTea');
const formFields = contactForm.querySelectorAll('input, textarea');

function updateMood(mood) {
  const config = moodConfig[mood];
  if (!config) return;

  moodButtons.forEach(function(button) {
    button.classList.toggle('active', button.dataset.mood === mood);
  });

  contactFormTitle.textContent = config.title;
  contactFormCopy.textContent = config.copy;
  extraFieldLabel.textContent = config.fieldLabel;
  submitButton.textContent = config.buttonText;
  extraField.placeholder = config.fieldLabel;
  extraField.setAttribute('aria-label', config.fieldLabel);
}

moodButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    updateMood(button.dataset.mood);
  });
});

function updateKulhadProgress() {
  const filledFields = Array.from(formFields).filter(function(field) {
    return field.value.trim() !== '';
  }).length;

  const progress = Math.min(Math.round((filledFields / formFields.length) * 100), 100);
  meterPercent.textContent = progress + '%';
  kulhadTea.style.height = progress + '%';
}

formFields.forEach(function(field) {
  field.addEventListener('input', updateKulhadProgress);
  field.addEventListener('blur', updateKulhadProgress);
});

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('customerName').value.trim() || 'friend';
  const mood = document.querySelector('.mood-btn.active')?.dataset.mood || 'bulk-order';
  const moodDetails = moodConfig[mood] || moodConfig['bulk-order'];
  const successText = moodDetails.successText;

  successAnnounce.hidden = false;
  successAnnounce.innerHTML = '<span class="steam-line">☕</span> Namaste ' + name + '! Your ' + successText + ' has been sent. We will get back to you with a warm chai-filled reply soon.';

  contactForm.reset();
  updateKulhadProgress();
  updateMood(mood);
});

updateMood('bulk-order');
updateKulhadProgress();

const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const selectedFilter = this.dataset.filter;

    filterButtons.forEach(function(filterButton) {
      filterButton.classList.toggle('active', filterButton === button);
    });

    menuCards.forEach(function(card) {
      const matchesFilter = selectedFilter === 'all' ||
        card.dataset.category === selectedFilter;
      if (matchesFilter) {
        card.hidden = false;
        requestAnimationFrame(function() {
          card.classList.remove('is-filter-hidden');
        });
      } else {
        card.classList.add('is-filter-hidden');
        window.setTimeout(function() {
          if (card.classList.contains('is-filter-hidden')) {
            card.hidden = true;
          }
        }, 300);
      }
    });
  });
});

const revealObserver = new IntersectionObserver(function(entries, observer) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(function(element) {
  revealObserver.observe(element);
});

const hero = document.querySelector('.hero');
const parallaxItems = document.querySelectorAll('.parallax-item');

window.addEventListener('scroll', function() {
  if (!hero || !parallaxItems.length) {
    return;
  }

  const offset = window.scrollY - hero.offsetTop;
  parallaxItems.forEach(function(item) {
    item.style.transform = 'translateY(' + (offset * 0.18) + 'px)';
  });
}, { passive: true });

menuCards.forEach(function(card) {
  card.addEventListener('mousemove', function(event) {
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    card.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
  });
});
