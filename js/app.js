/**
 * Luxury Wedding E-Invitation JavaScript
 * Custom-tailored for Kosala & Janani (Hotel Suneragira, Nikaweratiya)
 */

// Global Wedding Configuration extracted from wedding invitation card
window.WEDDING_CONFIG = {
  couple: {
    groom: "Kosala",
    bride: "Janani",
    groomFull: "Kosala",
    brideFull: "Janani",
    groomParents: "Groom",
    brideParents: "Bride"
  },
  // Wedding Date & Time: Thursday, 19th November 2026 at 09:30 AM
  eventDate: "2026-11-19T09:30:00",
  poruwaTime: "09:30 AM",
  endTime: "03:30 PM",
  // Venue Details
  venue: {
    name: "Hotel Suneragira",
    city: "Nikaweratiya",
    address: "Hotel Suneragira, Nikaweratiya, Sri Lanka",
    googleMapsUrl: "https://maps.google.com/?q=Hotel+Suneragira+Nikaweratiya"
  },
  // Couple's WhatsApp for RSVP (Format: Country Code + Number, no + or spaces)
  rsvpWhatsAppNumber: "94763728044"
};

document.addEventListener("DOMContentLoaded", () => {
  initGuestPersonalization();
  initEnvelopeOpener();
  initAudioPlayer();
  initCountdownTimer();
  initLightbox();
  initCalendarButton();
  initRsvpForm();
  initGuestbook();
  initFloatingParticles();
});

/**
 * 1. Personalize Invitation based on URL Parameters
 * Example: index.html?to=Mr.+Kasun+Silva&seats=2&table=03
 */
function initGuestPersonalization() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  const seats = urlParams.get('seats') || '1';
  const table = urlParams.get('table');

  const guestNameDisplay = document.getElementById('guest-name-display');
  const envelopeGuestName = document.getElementById('envelope-guest-name');
  const guestSeatsDisplay = document.getElementById('guest-seats-display');
  const guestTableDisplay = document.getElementById('guest-table-display');
  const rsvpNameInput = document.getElementById('rsvp-name');
  const rsvpSeatsInput = document.getElementById('rsvp-guests');

  if (guestName) {
    const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    if (guestNameDisplay) guestNameDisplay.textContent = formattedName;
    if (envelopeGuestName) envelopeGuestName.textContent = formattedName;
    if (rsvpNameInput) rsvpNameInput.value = formattedName;
  } else {
    if (guestNameDisplay) guestNameDisplay.textContent = "Honored Guest";
    if (envelopeGuestName) envelopeGuestName.textContent = "Honored Guest";
  }

  if (guestSeatsDisplay) {
    guestSeatsDisplay.textContent = `${seats} ${seats === '1' ? 'Seat' : 'Seats'} Reserved`;
  }
  if (rsvpSeatsInput) {
    rsvpSeatsInput.value = seats;
  }

  if (table && guestTableDisplay) {
    guestTableDisplay.textContent = `Table No: ${table}`;
    guestTableDisplay.style.display = 'inline-block';
  }
}

/**
 * 2. Envelope / Wax Seal Opening Animation
 */
function initEnvelopeOpener() {
  const openBtn = document.getElementById('open-envelope-btn');
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainContent = document.getElementById('main-invitation-content');

  if (!openBtn || !envelopeScreen) return;

  openBtn.addEventListener('click', () => {
    envelopeScreen.classList.add('opened');
    if (mainContent) {
      mainContent.classList.remove('hidden');
      mainContent.classList.add('animate-fade-in');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    playBackgroundMusic();
  });
}

/**
 * 3. Soft Romantic Background Music Engine
 * Supports HTML5 audio and built-in Web Audio API romantic synthesizer
 */
let isAudioPlaying = false;
let audioPlayer = null;
let audioCtx = null;
let synthInterval = null;
let synthMasterGain = null;

function initAudioPlayer() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  audioPlayer = document.getElementById('wedding-audio');

  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  });
}

function playBackgroundMusic() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioPlayer) audioPlayer = document.getElementById('wedding-audio');

  // Try playing the audio element first
  if (audioPlayer && audioPlayer.currentSrc && !audioPlayer.error) {
    audioPlayer.play().then(() => {
      isAudioPlaying = true;
      if (audioBtn) {
        audioBtn.classList.add('playing');
        audioBtn.setAttribute('title', 'Pause Music');
      }
    }).catch(err => {
      console.log("HTML5 audio playback failed, falling back to Web Audio Synthesizer:", err);
      startWebAudioSynth();
    });
  } else {
    // If no audio file or failed, start built-in romantic melody
    startWebAudioSynth();
  }
}

function pauseBackgroundMusic() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioPlayer) {
    audioPlayer.pause();
  }
  stopWebAudioSynth();
  isAudioPlaying = false;
  if (audioBtn) {
    audioBtn.classList.remove('playing');
    audioBtn.setAttribute('title', 'Play Music');
  }
}

/**
 * Built-in Romantic Wedding Music Box / Piano Synthesizer
 * Plays Pachelbel's Canon chord progression in gentle acoustic tones
 */
function startWebAudioSynth() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!synthMasterGain) {
      synthMasterGain = audioCtx.createGain();
      synthMasterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      synthMasterGain.connect(audioCtx.destination);
    }

    const chords = [
      [293.66, 369.99, 440.00, 587.33], // D major
      [220.00, 277.18, 329.63, 440.00], // A major
      [246.94, 293.66, 369.99, 493.88], // B minor
      [185.00, 220.00, 277.18, 369.99], // F# minor
      [196.00, 246.94, 293.66, 392.00], // G major
      [220.00, 293.66, 369.99, 440.00], // D major
      [196.00, 246.94, 293.66, 392.00], // G major
      [220.00, 277.18, 329.63, 440.00]  // A major
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!isAudioPlaying) return;
      const currentChord = chords[chordIndex];
      const now = audioCtx.currentTime;

      currentChord.forEach((freq, noteIdx) => {
        const noteTime = now + (noteIdx * 0.35);
        playSynthNote(freq, noteTime);
      });

      chordIndex = (chordIndex + 1) % chords.length;
    };

    isAudioPlaying = true;
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.classList.add('playing');
      audioBtn.setAttribute('title', 'Pause Music');
    }

    if (synthInterval) clearInterval(synthInterval);
    playNextChord();
    synthInterval = setInterval(playNextChord, 2200);

  } catch (e) {
    console.error("Web Audio error:", e);
  }
}

function playSynthNote(freq, startTime) {
  if (!audioCtx || !synthMasterGain) return;
  try {
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'triangle'; // Warm, soft acoustic tone
    osc.frequency.setValueAtTime(freq, startTime);

    // Exponential decay envelope for acoustic pluck/piano feel
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

    osc.connect(noteGain);
    noteGain.connect(synthMasterGain);

    osc.start(startTime);
    osc.stop(startTime + 1.9);
  } catch (err) {}
}

function stopWebAudioSynth() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

/**
 * 4. Live Countdown Timer to November 19, 2026 (09:30 AM)
 */
function initCountdownTimer() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl) return;

  const targetDate = new Date(window.WEDDING_CONFIG.eventDate).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      const banner = document.getElementById('countdown-banner');
      if (banner) banner.textContent = "The Auspicious Wedding Day is Here!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 5. Pre-shoot Photo Gallery Lightbox
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  if (!lightbox || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/**
 * 6. Add to Google Calendar (Nov 19, 2026, 9:30 AM - 3:30 PM)
 */
function initCalendarButton() {
  const calendarBtn = document.getElementById('add-calendar-btn');
  if (!calendarBtn) return;

  calendarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const config = window.WEDDING_CONFIG;
    const title = encodeURIComponent(`Wedding of ${config.couple.groom} & ${config.couple.bride}`);
    const details = encodeURIComponent(`We invite you to share with us this joyful and touching day of our wedding at ${config.venue.name}, ${config.venue.city}! (Time: 9.30 AM - 3.30 PM)`);
    const location = encodeURIComponent(`${config.venue.name}, ${config.venue.address}`);
    
    // Start: Nov 19 2026, 09:30 AM (SLT UTC+5:30 -> UTC 04:00:00)
    // End: Nov 19 2026, 03:30 PM (SLT UTC+5:30 -> UTC 10:00:00)
    const dates = "20261119T040000Z/20261119T100000Z";

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  });
}

/**
 * 7. Interactive RSVP via WhatsApp
 */
function initRsvpForm() {
  const rsvpForm = document.getElementById('wedding-rsvp-form');
  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value.trim();
    const attending = document.querySelector('input[name="attendance"]:checked').value;
    const guestCount = document.getElementById('rsvp-guests').value;
    const wishes = document.getElementById('rsvp-wishes').value.trim();

    const config = window.WEDDING_CONFIG;
    const statusText = attending === 'yes' ? 'Will Attend' : 'Unable to Attend';

    let message = `*Wedding RSVP - ${config.couple.groom} & ${config.couple.bride}*\n\n`;
    message += `*Guest Name:* ${name}\n`;
    message += `*Attendance Status:* ${statusText}\n`;
    if (attending === 'yes') {
      message += `*Number of Guests:* ${guestCount}\n`;
    }
    if (wishes) {
      message += `*Blessing Message:* "${wishes}"\n`;
    }
    message += `\n*Wedding Date:* Thursday, 19th November 2026\n`;
    message += `*Venue:* ${config.venue.name}, ${config.venue.city}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.rsvpWhatsAppNumber}&text=${encodedMessage}`;

    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Opening WhatsApp...</span>`;

    if (wishes) {
      addWishToGuestbook(name, wishes);
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      submitBtn.innerHTML = `<span>RSVP Sent! Thank You!</span>`;
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 3000);
    }, 400);
  });
}

/**
 * 8. Guestbook / Wishes Wall
 */
const DEFAULT_WISHES = [
  { name: "Family & Friends", message: "Congratulations Kosala & Janani! Wishing you both a lifetime of happiness, unconditional love, and blessings!", time: "Recently" }
];

function initGuestbook() {
  renderGuestbook();
}

function renderGuestbook() {
  const container = document.getElementById('guestbook-list');
  if (!container) return;

  let storedWishes = [];
  try {
    storedWishes = JSON.parse(localStorage.getItem('wedding_wishes_kj') || '[]');
  } catch (e) {
    storedWishes = [];
  }

  const allWishes = [...storedWishes, ...DEFAULT_WISHES];
  container.innerHTML = allWishes.map(w => `
    <div class="p-3.5 bg-white/90 rounded-xl border border-purple-200/60 shadow-sm text-left">
      <div class="flex items-center justify-between mb-1">
        <h5 class="font-serif font-bold text-sm text-[#2b231d]">${escapeHtml(w.name)}</h5>
        <span class="text-[11px] text-purple-700/70 font-medium">${w.time || 'Guest'}</span>
      </div>
      <p class="text-xs text-[#74675e] italic">"${escapeHtml(w.message)}"</p>
    </div>
  `).join('');
}

function addWishToGuestbook(name, message) {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem('wedding_wishes_kj') || '[]');
  } catch (e) {
    stored = [];
  }
  stored.unshift({ name, message, time: "Just now" });
  localStorage.setItem('wedding_wishes_kj', JSON.stringify(stored));
  renderGuestbook();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

/**
 * 9. Animated Floating Flower Petals & Butterflies
 */
function initFloatingParticles() {
  const container = document.getElementById('floating-particles-container');
  if (!container) return;

  const petalSVGs = [
    // Lilac petal SVG
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C7 8 2 12 7 19C12 24 16 20 18 16C21 11 17 6 12 2Z" fill="#c084fc" fill-opacity="0.6"/></svg>`,
    // Soft violet petal SVG
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3C8 9 4 12 8 18C12 22 17 19 19 15C22 10 16 6 12 3Z" fill="#e879f9" fill-opacity="0.5"/></svg>`,
    // Soft rose petal SVG
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6 7 3 13 8 18C13 22 18 18 19 14C20 9 17 5 12 2Z" fill="#f472b6" fill-opacity="0.55"/></svg>`,
    // Gold sparkle petal SVG
    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" fill="#fbbf24" fill-opacity="0.6"/></svg>`
  ];

  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'floating-petal';
    el.innerHTML = petalSVGs[Math.floor(Math.random() * petalSVGs.length)];
    el.style.left = (Math.random() * 95) + 'vw';
    const duration = 6 + Math.random() * 8;
    el.style.animationDuration = duration + 's';
    el.style.transform = `scale(${0.6 + Math.random() * 0.7})`;
    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, duration * 1000);
  }

  // Periodic butterfly animation
  function spawnButterfly() {
    const el = document.createElement('div');
    el.className = 'floating-butterfly';
    el.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="#a855f7" fill-opacity="0.85"><path d="M12 12c-2-4-7-6-9-4s-1 7 3 9c2 1 4 0 6-2m0-3c2-4 7-6 9-4s1 7-3 9c-2 1-4 0-6-2m0-4v9"/></svg>`;
    const duration = 12 + Math.random() * 8;
    el.style.animationDuration = duration + 's';
    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, duration * 1000);
  }

  // Spawn petals continually
  setInterval(spawnPetal, 1400);
  for (let i = 0; i < 5; i++) {
    setTimeout(spawnPetal, i * 400);
  }

  // Spawn butterflies occasionally
  setInterval(spawnButterfly, 7000);
  setTimeout(spawnButterfly, 1500);
}
