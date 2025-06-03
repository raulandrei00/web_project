"use strict";

if (localStorage.getItem('currentUser')) {
    localStorage.removeItem('currentUser');
}
// localStorage.clear(); // Clear localStorage for demo purposes
// Persistent user storage (merge the shipped users + any new sign-ups)
const users = JSON.parse(localStorage.getItem('users'))
              || [{username:'Cezara',password:'cezara123'},{username:'Raul',password:'raul123'}];
// Save seed if first run
localStorage.setItem('users', JSON.stringify(users));
// Track current logged-in user
let currentUser = localStorage.getItem('currentUser') || null;
function allUsers() { return users; }
// Modal controls & messaging
const loginBtn = document.getElementById('loginBtn'),
      signUpBtn = document.getElementById('signUpBtn'),
      loginModal = document.getElementById('loginModal'),
      signUpModal = document.getElementById('signUpModal'),
      closeLogin = document.getElementById('closeLoginModal'),
      closeSignUp = document.getElementById('closeSignUpModal'),
      loginForm = document.getElementById('loginForm'),
      signUpForm = document.getElementById('signUpForm'),
      loginMsg = document.getElementById('loginMessage'),
      signUpMsg = document.getElementById('signUpMessage');
    
      loginBtn.onclick = () => { loginMsg.textContent=''; loginForm.reset(); loginModal.classList.add('active'); };
      closeLogin.onclick = () => loginModal.classList.remove('active');
      signUpBtn.onclick = () => { signUpMsg.textContent=''; signUpForm.reset(); signUpModal.classList.add('active'); };
      closeSignUp.onclick = () => signUpModal.classList.remove('active');

// Sign Up logic
signUpForm.onsubmit = e => {
  e.preventDefault();
  const u = signUpForm.username.value.trim(), p = signUpForm.password.value, c = signUpForm.confirmPassword.value;
  if (p !== c) {
    signUpMsg.textContent = 'Passwords do not match.';
  } else {
    users.push({username: u, password: p});
    localStorage.setItem('users', JSON.stringify(users));
    signUpMsg.textContent = 'Account created!';
    signUpMsg.classList.add('success');
    setTimeout(() => signUpModal.classList.remove('active'), 800);
    currentUser = u;
    localStorage.setItem('currentUser', currentUser);
    // Show a temporary popup message
    const popup = document.createElement('div');
    popup.textContent = `Welcome, ${u}!`;
    popup.style.position = 'fixed';
    popup.style.top = '30px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#4caf50';
    popup.style.color = '#fff';
    popup.style.padding = '12px 24px';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
  }
};

// Login logic
loginForm.onsubmit = e => {
  e.preventDefault();
  const u = loginForm.username.value.trim(), p = loginForm.password.value;
  const valid = allUsers().some(x => x.username === u && x.password === p);
  if (valid) {
    currentUser = u;
    localStorage.setItem('currentUser', currentUser);
    loginMsg.textContent = 'Welcome back!';
    loginMsg.classList.add('success');
    // setTimeout(() => window.location.href = '../notebook_interface/notebook.html', 800);
    // this line innitially intended to redirect to notebook upon login but this is unnecessary
    // Show a temporary popup message (not alert)
    const popup = document.createElement('div');
    popup.textContent = 'Login successful. Welcome back!';
    popup.style.position = 'fixed';
    popup.style.top = '30px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#4caf50';
    popup.style.color = '#fff';
    popup.style.padding = '12px 24px';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
  } else {
    const popup = document.createElement('div');
    popup.textContent = 'Invalid credentials.';
    popup.style.position = 'fixed';
    popup.style.top = '30px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#e53935';
    popup.style.color = '#fff';
    popup.style.padding = '12px 24px';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
    loginMsg.textContent = 'Invalid credentials.';
  }
  loginModal.classList.remove('active');
};

// Start button ripple and action
document.getElementById('startBtn').addEventListener('click', function(e) {
  e.preventDefault();
  const r = document.createElement('span'); r.className='ripple'; this.appendChild(r);
  const d = Math.max(this.offsetWidth, this.offsetHeight);
  r.style.width = r.style.height = d + 'px';
  r.style.left = e.clientX - this.getBoundingClientRect().left - d/2 + 'px';
  r.style.top = e.clientY - this.getBoundingClientRect().top - d/2 + 'px';
  r.addEventListener('animationend', () => r.remove());
  setTimeout(() => window.location.href='../notebook_interface/notebook.html', 300);
});
// Dashboard button action
document.getElementById('dashBtn').addEventListener('click', function(e) {
  e.preventDefault();
  const r = document.createElement('span'); r.className='ripple'; this.appendChild(r);
  const d = Math.max(this.offsetWidth, this.offsetHeight);
  r.style.width = r.style.height = d + 'px';
  r.style.left = e.clientX - this.getBoundingClientRect().left - d/2 + 'px';
  r.style.top = e.clientY - this.getBoundingClientRect().top - d/2 + 'px';
  r.addEventListener('animationend', () => r.remove());
  setTimeout(() => window.location.href='../dashboard/dashboard.html', 300);
});