/* auth.js
   IMPORTANT (read this before submitting the assignment):
   This is a FRONT-END DEMO ONLY. There is no server, no database, and no real
   password security here. Anyone can open dev tools and see/edit localStorage.
   Do NOT present this as "real" authentication — it's here so the login,
   register and profile PAGES have working interactions to demo/screenshot.
   A real version needs a backend (Node/PHP/etc.) with hashed passwords.
*/

const STORAGE_KEY = 'primevista_demo_user';

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function showAlert(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = 'form-alert show ' + type;
}

function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || '';
}

/* ===== LOGIN PAGE ===== */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setFieldError('loginEmailError', '');
    setFieldError('loginPasswordError', '');

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valid = true;

    if (!email || !email.includes('@')) {
      setFieldError('loginEmailError', 'Enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setFieldError('loginPasswordError', 'Password is required.');
      valid = false;
    }
    if (!valid) return;

    const stored = getStoredUser();
    const alertEl = document.getElementById('loginAlert');

    if (!stored || stored.email !== email) {
      showAlert(alertEl, 'No account found with that email. Try registering first.', 'error');
      return;
    }
    // NOTE: demo only — real password checking must happen on a server.
    if (stored.password !== password) {
      showAlert(alertEl, 'Incorrect password.', 'error');
      return;
    }

    showAlert(alertEl, 'Login successful. Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'profile.html'; }, 700);
  });
}

/* ===== REGISTER PAGE ===== */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    ['regNameError', 'regEmailError', 'regPasswordError', 'regConfirmPasswordError', 'agreeTermsError']
      .forEach(id => setFieldError(id, ''));

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    let valid = true;

    if (!name) { setFieldError('regNameError', 'Full name is required.'); valid = false; }
    if (!email || !email.includes('@')) { setFieldError('regEmailError', 'Enter a valid email address.'); valid = false; }
    if (!password || password.length < 6) { setFieldError('regPasswordError', 'Password must be at least 6 characters.'); valid = false; }
    if (confirmPassword !== password) { setFieldError('regConfirmPasswordError', 'Passwords do not match.'); valid = false; }
    if (!agreeTerms) { setFieldError('agreeTermsError', 'You must agree to the terms to continue.'); valid = false; }

    if (!valid) return;

    setStoredUser({ name, email, phone, password });

    const alertEl = document.getElementById('registerAlert');
    showAlert(alertEl, 'Account created. Redirecting to login...', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 700);
  });
}

/* ===== PROFILE PAGE ===== */
const profileContent = document.getElementById('profileContent');
if (profileContent) {
  const stored = getStoredUser();
  const notLoggedIn = document.getElementById('notLoggedIn');

  if (!stored) {
    notLoggedIn.hidden = false;
    profileContent.hidden = true;
  } else {
    notLoggedIn.hidden = true;
    profileContent.hidden = false;

    document.getElementById('profileAvatar').textContent = stored.name.charAt(0).toUpperCase();
    document.getElementById('profileNameHeading').textContent = `Welcome back, ${stored.name.split(' ')[0]}`;
    document.getElementById('profileEmailSub').textContent = stored.email;

    document.getElementById('profileName').value = stored.name || '';
    document.getElementById('profileEmail').value = stored.email || '';
    document.getElementById('profilePhone').value = stored.phone || '';

    // Swap the header's Login button for a Profile link
    const authAreaLink = document.getElementById('authAreaLink');
    if (authAreaLink) {
      authAreaLink.textContent = stored.name.split(' ')[0];
      authAreaLink.setAttribute('href', authAreaLink.dataset.profileHref || 'profile.html');
    }

    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        ...stored,
        name: document.getElementById('profileName').value.trim(),
        email: document.getElementById('profileEmail').value.trim(),
        phone: document.getElementById('profilePhone').value.trim(),
      };
      setStoredUser(updated);
      showAlert(document.getElementById('profileAlert'), 'Profile updated.', 'success');
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
      clearStoredUser();
      window.location.href = '../index.html';
    });
  }
}

/* ===== Password show/hide toggle (login + register) ===== */
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

/* ===== Reflect login state in header on ANY page (not just profile) ===== */
(function updateHeaderAuthLink() {
  const stored = getStoredUser();
  const authAreaLink = document.getElementById('authAreaLink');
  if (stored && authAreaLink && !document.getElementById('profileContent')) {
    authAreaLink.textContent = stored.name.split(' ')[0];
    authAreaLink.setAttribute('href', authAreaLink.dataset.profileHref || 'profile.html');
  }
})();
