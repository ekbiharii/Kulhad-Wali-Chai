// ==========================================
// 1. LOADING SCREEN & COUNTDOWN
// ==========================================
const loadingScreen = document.getElementById('loading-screen');
const loadingCountdown = document.getElementById('loading-countdown');
let countdown = 10;

const countdownTimer = window.setInterval(function() {
  countdown -= 1;
  if (countdown > 0) {
    if (loadingCountdown) loadingCountdown.textContent = countdown;
  } else {
    if (loadingCountdown) loadingCountdown.textContent = '0';
    window.clearInterval(countdownTimer);
  }
}, 1000);

window.setTimeout(function() {
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    document.body.classList.remove('loading');
  }
}, 10000);

// ==========================================
// 2. CONTACT FORM MOOD CONFIG & PROGRESS
// ==========================================
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
const submitButton = contactForm ? contactForm.querySelector('.btn') : null;
const successAnnounce = document.getElementById('successAnnounce');
const meterPercent = document.getElementById('meterPercent');
const kulhadTea = document.getElementById('kulhadTea');
const formFields = contactForm ? contactForm.querySelectorAll('input, textarea') : [];

function updateMood(mood) {
  const config = moodConfig[mood];
  if (!config) return;

  moodButtons.forEach(function(button) {
    button.classList.toggle('active', button.dataset.mood === mood);
  });

  if (contactFormTitle) contactFormTitle.textContent = config.title;
  if (contactFormCopy) contactFormCopy.textContent = config.copy;
  if (extraFieldLabel) extraFieldLabel.textContent = config.fieldLabel;
  if (submitButton) submitButton.textContent = config.buttonText;
  if (extraField) {
    extraField.placeholder = config.fieldLabel;
    extraField.setAttribute('aria-label', config.fieldLabel);
  }
}

moodButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    updateMood(button.dataset.mood);
  });
});

function updateKulhadProgress() {
  if (!formFields.length) return;
  const filledFields = Array.from(formFields).filter(function(field) {
    return field.value.trim() !== '';
  }).length;

  const progress = Math.min(Math.round((filledFields / formFields.length) * 100), 100);
  if (meterPercent) meterPercent.textContent = progress + '%';
  if (kulhadTea) kulhadTea.style.height = progress + '%';
}

formFields.forEach(function(field) {
  field.addEventListener('input', updateKulhadProgress);
  field.addEventListener('blur', updateKulhadProgress);
});

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('customerName');
    const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'friend';
    const mood = document.querySelector('.mood-btn.active')?.dataset.mood || 'bulk-order';
    const moodDetails = moodConfig[mood] || moodConfig['bulk-order'];
    const successText = moodDetails.successText;

    if (successAnnounce) {
      successAnnounce.hidden = false;
      successAnnounce.innerHTML = '<span class="steam-line">☕</span> Namaste ' + name + '! Your ' + successText + ' has been sent. We will get back to you with a warm chai-filled reply soon.';
    }

    contactForm.reset();
    updateKulhadProgress();
    updateMood(mood);
  });
}

updateMood('bulk-order');
updateKulhadProgress();

// ==========================================
// 3. MENU FILTER SYSTEM
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const selectedFilter = this.dataset.filter;

    filterButtons.forEach(function(filterButton) {
      filterButton.classList.toggle('active', filterButton === button);
    });

    menuCards.forEach(function(card) {
      const matchesFilter = selectedFilter === 'all' || card.dataset.category === selectedFilter;
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

// ==========================================
// 4. SCROLL REVEAL & PARALLAX
// ==========================================
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
  if (!hero || !parallaxItems.length) return;

  const offset = window.scrollY - hero.offsetTop;
  parallaxItems.forEach(function(item) {
    item.style.transform = 'translateY(' + (offset * 0.18) + 'px)';
  });
}, { passive: true });

// 3D Card Hover Tilt Effect
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

// ==========================================
// 5. CHAI & CHARCHA (COMMUNITY SECTION)
// ==========================================
const postBtn = document.getElementById('postThoughtBtn');
const authorInput = document.getElementById('thoughtAuthor');
const textInput = document.getElementById('thoughtText');
const feedContainer = document.getElementById('thoughtFeed');

const defaultThoughts = [
  {
    id: 1,
    author: "Rahul Sharma",
    text: "की चाय रखी हो टेबल पर तुम याद पुराने ले आओ, हम कह देंगे कल छुट्टी है तुम वह यार पुराने ले आओ...",
    likes: 12
  },
  {
    id: 2,
    author: "Ananya",
    text: "Rainy evening + hot Kulhad Chai = Pure happiness ❤️",
    likes: 8
  }
];

function renderFeed(thoughts) {
  if (!feedContainer) return;
  feedContainer.innerHTML = '';
  
  // Render newest thoughts at the top
  thoughts.slice().reverse().forEach(function(item) {
    const card = document.createElement('div');
    card.className = 'thought-card';
    card.innerHTML = `
      <p>"${item.text}"</p>
      <div class="card-footer">
        <span class="card-author">- ${item.author || 'Anonymous Chai Lover'}</span>
        <button class="like-btn" onclick="likePost(${item.id})">❤️ ${item.likes}</button>
      </div>
    `;
    feedContainer.appendChild(card);
  });
}

function loadThoughts() {
  let savedThoughts = JSON.parse(localStorage.getItem('chai_thoughts'));
  if (!savedThoughts || savedThoughts.length === 0) {
    savedThoughts = defaultThoughts;
    localStorage.setItem('chai_thoughts', JSON.stringify(savedThoughts));
  }
  renderFeed(savedThoughts);
}

if (postBtn) {
  postBtn.addEventListener('click', function() {
    const text = textInput ? textInput.value.trim() : '';
    const author = (authorInput && authorInput.value.trim()) ? authorInput.value.trim() : 'Anonymous Chai Lover';

    if (text === '') {
      alert('Please write something before sharing!');
      return;
    }

    const currentThoughts = JSON.parse(localStorage.getItem('chai_thoughts')) || defaultThoughts;
    const newThought = {
      id: Date.now(),
      author: author,
      text: text,
      likes: 0
    };

    currentThoughts.push(newThought);
    localStorage.setItem('chai_thoughts', JSON.stringify(currentThoughts));

    if (textInput) textInput.value = '';
    if (authorInput) authorInput.value = '';
    renderFeed(currentThoughts);
  });
}

// Global function for Like Button
window.likePost = function(id) {
  let currentThoughts = JSON.parse(localStorage.getItem('chai_thoughts')) || defaultThoughts;
  currentThoughts = currentThoughts.map(function(item) {
    if (item.id === id) {
      return Object.assign({}, item, { likes: item.likes + 1 });
    }
    return item;
  });
  localStorage.setItem('chai_thoughts', JSON.stringify(currentThoughts));
  renderFeed(currentThoughts);
};

// Initialize feed on load
loadThoughts();