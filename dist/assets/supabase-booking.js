'use strict';

(function () {
  const form = document.querySelector('#bookingForm');
  const cfg = window.ALAMI_SUPABASE;
  if (!form || !cfg?.url || !cfg?.publishableKey || !cfg?.villaId) return;

  const checkin = document.querySelector('#checkin');
  const checkout = document.querySelector('#checkout');
  const guests = document.querySelector('#guests');
  const name = document.querySelector('#name');
  const email = document.querySelector('#email');
  const requests = document.querySelector('#requests');
  const status = document.querySelector('#formStatus');
  const output = document.querySelector('#enquiryOutput');
  const submit = form.querySelector('[type="submit"]');
  const headers = {
    apikey: cfg.publishableKey,
    Authorization: 'Bearer ' + cfg.publishableKey,
    'Content-Type': 'application/json'
  };

  const localDate = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const api = (table, query = '') => cfg.url + '/rest/v1/' + table + query;
  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.dataset.state = error ? 'error' : 'success';
  };
  const nightsBetween = () => Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);

  const refreshSummary = () => {
    const nights = checkin.value && checkout.value ? nightsBetween() : 0;
    if (document.querySelector('#nightSummary')) {
      document.querySelector('#nightSummary').textContent = nights > 0
        ? nights + ' night' + (nights === 1 ? '' : 's') + ' · Live availability checked before sending'
        : 'Select your dates to see the length of your stay.';
    }
  };

  const ensureValidDates = () => {
    const today = localDate(new Date());
    checkin.min = today;
    checkout.min = checkin.value || today;
    if (checkin.value) {
      const next = new Date(checkin.value + 'T12:00:00');
      next.setDate(next.getDate() + 1);
      checkout.min = localDate(next);
    }
    checkout.setCustomValidity(checkout.value && checkin.value && checkout.value <= checkin.value
      ? 'Choose a check-out date after check-in.' : '');
    refreshSummary();
  };

  async function getAvailabilityConflict() {
    const query = '?select=id&villa_id=eq.' + encodeURIComponent(cfg.villaId)
      + '&start_date=lt.' + encodeURIComponent(checkout.value)
      + '&end_date=gt.' + encodeURIComponent(checkin.value)
      + '&status=in.(blocked,reserved)&limit=1';
    const response = await fetch(api('availability_blocks', query), { headers });
    if (!response.ok) throw new Error('availability');
    const rows = await response.json();
    return rows.length > 0;
  }

  async function createBooking() {
    const guestResponse = await fetch(api('guests') + '?select=id', {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({
        full_name: name.value.trim(),
        email: email.value.trim() || null
      })
    });
    if (!guestResponse.ok) throw new Error('guest');
    const guestRows = await guestResponse.json();
    const guestId = guestRows[0]?.id;
    if (!guestId) throw new Error('guest');

    const bookingResponse = await fetch(api('bookings'), {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({
        villa_id: cfg.villaId,
        guest_id: guestId,
        check_in: checkin.value,
        check_out: checkout.value,
        guests_count: Number(guests.value),
        status: 'requested',
        source: 'website',
        special_requests: requests.value.trim() || null
      })
    });
    if (!bookingResponse.ok) throw new Error('booking');
    return bookingResponse.json();
  }

  checkin.addEventListener('change', ensureValidDates);
  checkout.addEventListener('input', ensureValidDates);
  ensureValidDates();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    ensureValidDates();
    if (!form.reportValidity() || checkout.value <= checkin.value) return;

    submit.disabled = true;
    submit.textContent = 'CHECKING AVAILABILITY…';
    output.textContent = '';
    try {
      if (await getAvailabilityConflict()) {
        setStatus('Those dates are already held. Please choose another stay window.', true);
        return;
      }
      submit.textContent = 'SENDING ENQUIRY…';
      await createBooking();
      output.textContent = 'Request received for ' + checkin.value + ' → ' + checkout.value + '. The Alami Villa team can now confirm availability and send the final rate.';
      setStatus('Your enquiry was sent securely. No payment has been collected.', false);
      form.reset();
      ensureValidDates();
    } catch (error) {
      setStatus('We could not send this enquiry right now. Please try again or contact the owner directly.', true);
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'PREPARE BOOKING ENQUIRY <span class="arrow">↗</span>';
    }
  }, true);
})();
