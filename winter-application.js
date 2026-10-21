/* Native seasonal application. No applicant responses are stored in browser storage. */
(() => {
  const form = document.getElementById('heroic-winter-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('winter-form-status');
  const endpoint = 'https://script.google.com/macros/s/AKfycby5Ua5AmP1ujVPGmkG0b7nKRQ0bsGpBBjaEoALENme_epotWjcVyQUPqQWIo26ejnG1kg/exec';
  // Release gate: enable only after a real submission and Sheet readback pass.
  const admissionsOpen = false;
  if (!admissionsOpen) return;
  let busy = false, completed = false, requestId = '', frozenBody = null;
  function announce(message, error = false) {
    status.textContent = message;
    status.classList.toggle('application-error', error);
    status.focus();
  }
  button.disabled = false;
  button.removeAttribute('aria-disabled');
  button.textContent = 'Send my application';
  status.textContent = 'Take your time. Required questions are marked with an asterisk (*).';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || completed) return;
    const adult = form.elements.adult;
    adult.setCustomValidity(adult.value === 'No' ? 'This apprenticeship intake is for adults age 18 and older. Please contact the school about other ways to participate.' : '');
    if (!form.reportValidity()) return;
    if (!requestId) requestId = crypto.randomUUID();
    if (!frozenBody) {
      frozenBody = new URLSearchParams(new FormData(form));
      frozenBody.set('requestId', requestId);
    }
    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy','true');
    announce('Sending your application. Please keep this page open.');
    // Keep the original payload and ID on uncertain delivery; retry cannot add a second row.
    const controls = [...form.querySelectorAll('input,textarea,select')];
    controls.forEach(control => { control.disabled = true; });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),45000);
    try {
      const response = await fetch(endpoint,{method:'POST',body:frozenBody,credentials:'omit',redirect:'follow',signal:controller.signal});
      if (!response.ok) throw Error('network');
      const result = await response.json();
      if (result.status === 'success' && result.source === 'heroic-yogi-app' && result.applicationId === 'HY-' + requestId.toUpperCase()) {
        completed = true;
        form.reset();
        button.textContent = 'Application received';
        announce('Thank you for sharing your path with us. Your application has been received. Our small mentor team will review it and contact you about next steps. Your reference: ' + result.applicationId + '.');
      } else {
        if (result.code === 'validation') {
          frozenBody = null;
          requestId = '';
          controls.forEach(control => { control.disabled = false; });
          announce('Your application was not accepted. Please check the required questions, email address, and acknowledgment, then try again.',true);
        } else if (result.code === 'rate') {
          announce('We could not accept another application for this email right now. Please wait an hour or contact sensesyogaschool@gmail.com.',true);
        } else throw Error('unconfirmed');
      }
    } catch (_) {
      announce('We could not confirm receipt. Your answers remain here. Use “Retry my application” to resend the same application safely, or contact sensesyogaschool@gmail.com. Please keep this page open until receipt is confirmed.',true);
    } finally {
      clearTimeout(timeout);
      busy = false;
      form.removeAttribute('aria-busy');
      if (!completed) {
        button.disabled = false;
        button.textContent = frozenBody ? 'Retry my application' : 'Send my application';
      }
    }
  });
  form.elements.adult.addEventListener('change', () => form.elements.adult.setCustomValidity(''));
})();
