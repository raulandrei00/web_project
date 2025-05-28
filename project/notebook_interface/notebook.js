const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizeInput = document.getElementById('size');
const clearButton = document.getElementById('clear');
const container = document.getElementById('canvas-container');
const undoButton = document.getElementById('undo');
let username = localStorage.getItem('currentUser');
let openedCanvasIndex = null;

let hasUnsavedChanges = false;



// Brush state
let drawing = false;
let brushColor = colorPicker.value;
let brushSize = sizeInput.value;

// Undo history
let history = [];
let historyIndex = -1;

// --- Event listeners for brush settings ---
colorPicker.addEventListener('input', e => brushColor = e.target.value);
sizeInput.addEventListener('input', e => brushSize = e.target.value);
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

const userCircle = document.getElementById('userCircle');
const dashboardHint = document.getElementById('dashboardHint');
userCircle.addEventListener('mouseenter', () => {
    dashboardHint.style.display = 'block';
});
userCircle.addEventListener('mouseleave', () => {
    dashboardHint.style.display = 'none';
});

// --- Dynamic canvas growth ---
const GROW_MARGIN = 10;
const GROW_AMOUNT = 50;
function growCanvasIfNeeded() {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - GROW_MARGIN) {
        const temp = document.createElement('canvas');
        temp.width = canvas.width;
        temp.height = canvas.height;
        temp.getContext('2d').drawImage(canvas, 0, 0);

        canvas.height += GROW_AMOUNT;
        ctx.drawImage(temp, 0, 0);
        canvas.style.transition = 'height 0.3s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => canvas.style.transition = '', 150);
        container.scrollTop = container.scrollHeight - container.clientHeight - 2 * GROW_MARGIN;
    }
}
container.addEventListener('scroll', growCanvasIfNeeded);


function saveState() {
  history = history.slice(0, historyIndex + 1);
  history.push(canvas.toDataURL());
  historyIndex = history.length - 1;
}

function restoreState(index) {
  const img = new Image();
  img.src = history[index];
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    restoreState(historyIndex);
  }
}

// // --- Undo controls ---
// undoButton.addEventListener('click', undo);
// // Ctrl+Z / Cmd+Z support
// window.addEventListener('keydown', e => {
//   const key = e.key.toLowerCase();
//   if ((e.ctrlKey || e.metaKey) && key === 'z') {
//     e.preventDefault();
//     undo();
//   }
// });

// --- Drawing logic ---
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', e => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
  ctx.beginPath();
  ctx.arc(lastX, lastY, brushSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = brushColor;
  ctx.fill();
});
canvas.addEventListener('mousedown', () => { hasUnsavedChanges = true; });

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener('mousemove', () => { if (drawing) hasUnsavedChanges = true; });

canvas.addEventListener('mouseup', () => {
  if (drawing) saveState();
  drawing = false;
});
canvas.addEventListener('mouseleave', () => {
  if (drawing) saveState();
  drawing = false;
});

let initialised = false;

function saveCanvas() {
  const imgSrc = canvas.toDataURL('image/png');
  const canvasName = document.getElementById('canvasName').value || "Untitled";
  const canvasData = {
    img: imgSrc,
    width: canvas.width,
    height: canvas.height,
    name: canvasName
  };
  
  const userKey = `savedImages_${username}`;
  let saved = JSON.parse(localStorage.getItem(userKey) || "[]");
  if (openedCanvasIndex !== null && saved[openedCanvasIndex]) {
    saved[openedCanvasIndex] = canvasData;
  } else if (initialised === false) {
    initialised = true;
    saved.push(canvasData);
  }
  else {
    saved.pop(); // Remove the last item if we are not editing an existing canvas
    saved.push(canvasData);
  }
  localStorage.setItem(userKey, JSON.stringify(saved));
  const popup = document.createElement('div');
  popup.textContent = "Image saved in browser!";
  Object.assign(popup.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: 1000
  });
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
  hasUnsavedChanges = false;
}

// --- Save/Load functionality ---
document.getElementById('save').addEventListener('click', () => {
  let username = localStorage.getItem('currentUser');
  if (!username) {
    promptLogin(() => {
      // Try saving again after successful login
      document.getElementById('save').click();
    });
    return;
  }
  saveCanvas();
});

window.addEventListener('DOMContentLoaded', () => {
  const openImage = localStorage.getItem('openImage');
  if (openImage) {
    const data = JSON.parse(openImage);
    openedCanvasIndex = data._idx;
    const img = new Image();
    img.onload = function() {
      canvas.width = data.width;
      canvas.height = data.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveState();  // capture the loaded state
    };
    img.src = data.img;
    localStorage.removeItem('openImage');
    namebox = document.getElementById('canvasName');
    namebox.value = data.name || "Untitled";

  } else {
    // initial blank state
    saveState();
    const userKey = `savedImages_${username}`;
    let canvas_no = 1;
    let saved = JSON.parse(localStorage.getItem(userKey) || "[]");
    while (saved.some(item => item.name === "Canvas " + canvas_no)) {
      canvas_no++;
    }
    namebox = document.getElementById('canvasName');
    namebox.value = "Canvas " + canvas_no;
  }
});

// Insert these changes into your notebook.js, replacing the existing promptLogin function:

function promptLogin(callback) {
  // Create the modal backdrop and content like start page
  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.classList.add('modal', 'active');

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Login Required</h3>
      <div id="loginMsg" class="message"></div>
      <form id="loginForm">
        <div class="form-group">
          <label for="loginUsername">Username</label>
          <input id="loginUsername" placeholder="Username" required />
        </div>
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input type="password" id="loginPassword" placeholder="Password" required />
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn-center">Log In</button>
          <button type="button" id="closeLoginModal" class="btn-center">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const loginForm = modal.querySelector('#loginForm');
  const loginMsg = modal.querySelector('#loginMsg');
  const closeBtn = modal.querySelector('#closeLoginModal');

  // Cancel button closes the modal
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  loginForm.onsubmit = e => {
    e.preventDefault();
    const u = modal.querySelector('#loginUsername').value.trim();
    const p = modal.querySelector('#loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const valid = users.some(x => x.username === u && x.password === p);
    if (valid) {
      localStorage.setItem('currentUser', u);
      // Update the userCircle to the new initial
      const userCircle = document.getElementById('userCircle');
      username = u;
      if (userCircle) userCircle.textContent = u.charAt(0).toUpperCase();
      modal.remove();
      if (callback) callback(u);
    } else {
      loginMsg.textContent = 'Invalid credentials.';
    }
  };
}


// const userCircle = document.getElementById('userCircle');
if (userCircle) {
  userCircle.addEventListener('click', function(e) {
    const currentUser = localStorage.getItem('currentUser');
    // If not logged in, show login modal
    if (!currentUser) {
      e.preventDefault();
      promptLogin(() => {
        window.location.href = '../dashboard/dashboard.html';
      });
      return;
    }
    if (hasUnsavedChanges) {
      e.preventDefault();
      showSaveDiscardPopup(() => {
        // Save, then go to dashboard
        document.getElementById('save').click();
        setTimeout(() => { window.location.href = '../dashboard/dashboard.html'; }, 100); // Give save time
      }, () => {
        // Discard, go to dashboard
        window.location.href = '../dashboard/dashboard.html';
      });
    }
    else {
        window.location.href = '../dashboard/dashboard.html';
    }
  });
}

function showSaveDiscardPopup(onSave, onDiscard) {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 3000
  });
  modal.innerHTML = `
    <div style="background:#fff;padding:32px 24px;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.15);min-width:300px;">
      <h3 style="margin-top:0;">Unsaved Changes</h3>
      <p style="margin-bottom:18px;">You have unsaved changes. Save before leaving?</p>
      <div style="display:flex;gap:16px;justify-content:flex-end;">
        <button id="popupSave" style="padding:8px 18px;background:#05386B;color:#fff;border:none;border-radius:6px;font-weight:bold;">Save</button>
        <button id="popupDiscard" style="padding:8px 18px;background:#eee;color:#333;border:none;border-radius:6px;">Discard</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#popupSave').onclick = () => { modal.remove(); onSave(); };
  modal.querySelector('#popupDiscard').onclick = () => { modal.remove(); onDiscard(); };
}
