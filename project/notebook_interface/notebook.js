const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizeInput = document.getElementById('size');
const clearButton = document.getElementById('clear');
const container = document.getElementById('canvas-container');
const undoButton = document.getElementById('undo');
let username = localStorage.getItem('currentUser');
let openedCanvasIndex = null;

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

// --- History management ---
function saveState() {
  // Discard any "future" states
  history = history.slice(0, historyIndex + 1);
  // Push current canvas image
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

// --- Undo controls ---
undoButton.addEventListener('click', undo);
// Ctrl+Z / Cmd+Z support
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && key === 'z') {
    e.preventDefault();
    undo();
  }
});

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

canvas.addEventListener('mouseup', () => {
  if (drawing) saveState();
  drawing = false;
});
canvas.addEventListener('mouseleave', () => {
  if (drawing) saveState();
  drawing = false;
});

// --- Save/Load functionality ---
document.getElementById('save').addEventListener('click', () => {
  const imgSrc = canvas.toDataURL('image/png');
  const canvasData = { img: imgSrc, width: canvas.width, height: canvas.height };
  const userKey = `savedImages_${username}`;
  let saved = JSON.parse(localStorage.getItem(userKey) || "[]");
  if (openedCanvasIndex !== null && saved[openedCanvasIndex]) {
    saved[openedCanvasIndex] = canvasData;
  } else {
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
  } else {
    // initial blank state
    saveState();
  }
});
