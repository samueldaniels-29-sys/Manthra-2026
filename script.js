/* =========================================================
   HOTEL SAFFRON HAVELI — script.js
   Features: mobile nav toggle, booking form validation,
   gallery filter buttons, stay-cost calculator.
   ========================================================= */

/* ---------- Mobile navigation toggle ---------- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* ---------- Booking form validation ---------- */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  const showError = (input, message) => {
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
  };

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    phone: (v) => /^\d{10}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit mobile number.',
    checkin: (v) => v ? '' : 'Please select a check-in date.',
    checkout: (v, form) => {
      if (!v) return 'Please select a check-out date.';
      const inDate = form.querySelector('#checkin').value;
      if (inDate && v <= inDate) return 'Check-out must be after check-in.';
      return '';
    },
    roomType: (v) => v ? '' : 'Please select a room type.'
  };

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach((fieldId) => {
      const input = bookingForm.querySelector('#' + fieldId);
      if (!input) return;
      const message = validators[fieldId](input.value, bookingForm);
      showError(input, message);
      if (message) isValid = false;
    });

    const resultEl = document.getElementById('formMessage');
    if (isValid) {
      const name = bookingForm.querySelector('#name').value.trim();
      resultEl.textContent = `Thank you, ${name}. Your enquiry has been received — our reservations team will confirm availability shortly.`;
      resultEl.className = 'result success';
      bookingForm.reset();
    } else {
      resultEl.textContent = 'Please correct the highlighted fields and submit again.';
      resultEl.className = 'result error';
    }
  });

  // live-clear error state as the guest types/selects
  bookingForm.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('invalid'));
  });
}

/* ---------- Gallery filter ---------- */
function filterGallery(category) {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item) => {
    const matches = category === 'all' || item.classList.contains(category);
    item.classList.toggle('hidden-item', !matches);
  });

  document.querySelectorAll('.filter-buttons .btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
}

/* ---------- Stay cost calculator ---------- */
function calculateStay() {
  const roomSelect = document.getElementById('roomSelect');
  const nightsInput = document.getElementById('nightsCount');
  const guestsInput = document.getElementById('guestsCount');
  const resultEl = document.getElementById('costResult');

  const ratePerNight = Number(roomSelect.value);
  const nights = Number(nightsInput.value);
  const guests = Number(guestsInput.value);

  if (!ratePerNight || nights < 1 || guests < 1) {
    resultEl.textContent = 'Please select a room and enter valid nights / guest numbers.';
    resultEl.className = 'result error';
    return;
  }

  const extraGuestFee = guests > 2 ? (guests - 2) * 800 * nights : 0;
  const total = ratePerNight * nights + extraGuestFee;

  resultEl.textContent = `Estimated stay total: ₹${total.toLocaleString('en-IN')} for ${nights} night(s), ${guests} guest(s).`;
  resultEl.className = 'result success';
}