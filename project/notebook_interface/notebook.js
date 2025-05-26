const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizeInput = document.getElementById('size');
const clearButton = document.getElementById('clear');
const container = document.getElementById('canvas-container');
let username = localStorage.getItem('currentUser');


let drawing = false;
let brushColor = colorPicker.value;
let brushSize = sizeInput.value;

colorPicker.addEventListener('input', (e) => brushColor = e.target.value);
sizeInput.addEventListener('input', (e) => brushSize = e.target.value);
clearButton.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Dynamic canvas growth
const GROW_MARGIN = 1;
const GROW_AMOUNT = 10;

function growCanvasIfNeeded() {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - GROW_MARGIN) {
        const oldHeight = canvas.height;
        // Save current content
        const temp = document.createElement('canvas');
        temp.width = canvas.width;
        temp.height = canvas.height;
        temp.getContext('2d').drawImage(canvas, 0, 0);

        // Resize and restore
        canvas.height += GROW_AMOUNT;
        ctx.drawImage(temp, 0, 0);

        // Keep user just above the trigger zone
        container.scrollTop = container.scrollHeight - container.clientHeight - 2 * GROW_MARGIN;
    }
}
container.addEventListener('scroll', growCanvasIfNeeded);

// Drawing logic that accounts for scroll
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    ctx.beginPath();
    ctx.arc(lastX, lastY, brushSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = brushColor;
    ctx.fill();
});

canvas.addEventListener('mousemove', (e) => {
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

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

// Save the canvas as an image
document.getElementById('save').addEventListener('click', () => {
    const imgSrc = canvas.toDataURL('image/png');
    const canvasData = {
        img: imgSrc,
        width: canvas.width,
        height: canvas.height
    };
    const userKey = `savedImages_${username}`;
    let saved = JSON.parse(localStorage.getItem(userKey) || "[]");
    saved.push(canvasData);
    localStorage.setItem(userKey, JSON.stringify(saved));
    // Create a temporary popup message
    const popup = document.createElement('div');
    popup.textContent = "Image saved in browser!";
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#333';
    popup.style.color = '#fff';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = 1000;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 1500);
});

// Load image if needed (your existing logic)
window.addEventListener('DOMContentLoaded', () => {
    const openImage = localStorage.getItem('openImage');
    if (openImage) {
        const data = JSON.parse(openImage);
        const img = new Image();
        img.onload = function() {
            canvas.width = data.width;
            canvas.height = data.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = data.img;
        localStorage.removeItem('openImage');
    }
});

