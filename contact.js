/* contact.js
   FRONT-END DEMO ONLY. There is no server here, so this form does not actually
   send an email anywhere. It validates the fields and shows a success message
   so the page has a working interaction to demo/screenshot. A real version
   needs a backend endpoint (or a service like Formspree/EmailJS) to actually
   deliver the message.
*/

function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('contactAlert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    let valid = true;
    setFieldError('fullNameError', '');
    setFieldError('cEmailError', '');
    setFieldError('subjectError', '');
    setFieldError('messageError', '');

    if (!fullName) {
      setFieldError('fullNameError', 'Please enter your name.');
      valid = false;
    }
    if (!email) {
      setFieldError('cEmailError', 'Please enter your email.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError('cEmailError', 'Please enter a valid email address.');
      valid = false;
    }
    if (!subject) {
      setFieldError('subjectError', 'Please add a subject.');
      valid = false;
    }
    if (!message) {
      setFieldError('messageError', 'Please write a message.');
      valid = false;
    }

    if (!valid) {
      status.textContent = 'Please fix the errors above.';
      status.className = 'form-alert show error';
      return;
    }

    // No backend — just confirm to the user their message was "sent".
    status.textContent = `Thanks, ${fullName.split(' ')[0]}! Your message has been received. We'll get back to you soon.`;
    status.className = 'form-alert show success';
    form.reset();
  });
});
