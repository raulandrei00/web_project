// Load saved images from localStorage
let username = localStorage.getItem('currentUser');
// console.log("Username:", username);
if (!username) {
    username = prompt("Enter your username:");
    localStorage.setItem('username', username);
}
const userKey = `savedImages_${username}`;
const saved = JSON.parse(localStorage.getItem(userKey) || "[]");
const gallery = document.getElementById('gallery');
const emptyMsg = document.getElementById('emptyMsg');

const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 200;

if (saved.length === 0) {
  emptyMsg.style.display = 'block';
} else {
  saved.forEach((data, idx) => {
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = PREVIEW_WIDTH;
    previewCanvas.height = PREVIEW_HEIGHT;
    previewCanvas.style.border = "2px solid #05386B";
    previewCanvas.style.borderRadius = "8px";
    previewCanvas.style.cursor = "pointer";
    previewCanvas.title = `Click to open in notebook`;

    const ctx = previewCanvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      ctx.clearRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
      ctx.drawImage(
        img,
        0, 0, 3000, 2000, // source x, y, width, height (from original)
        0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT // dest x, y, width, height (preview)
      );
    };
    img.src = data.img;

    previewCanvas.onclick = () => {
      // When opening a canvas for editing:
      const dataWithIndex = { ...saved[idx], _idx: idx };
      localStorage.setItem('openImage', JSON.stringify(dataWithIndex));
      window.location.href = "../notebook_interface/notebook.html";
    };
    gallery.appendChild(previewCanvas);
  });
}

// Add "new canvas" preview
const newCanvasPreview = document.createElement('canvas');
newCanvasPreview.width = PREVIEW_WIDTH;
newCanvasPreview.height = PREVIEW_HEIGHT;
newCanvasPreview.style.border = "2px dashed #bbb";
newCanvasPreview.style.borderRadius = "8px";
newCanvasPreview.style.cursor = "pointer";
newCanvasPreview.title = "Create a new canvas";

const ctxNew = newCanvasPreview.getContext('2d');
// Draw a grey plus sign in the center
ctxNew.strokeStyle = "#bbb";
ctxNew.lineWidth = 8;
ctxNew.lineCap = "round";
const centerX = PREVIEW_WIDTH / 2;
const centerY = PREVIEW_HEIGHT / 2;
const plusLen = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.35;
ctxNew.beginPath();
ctxNew.moveTo(centerX - plusLen / 2, centerY);
ctxNew.lineTo(centerX + plusLen / 2, centerY);
ctxNew.moveTo(centerX, centerY - plusLen / 2);
ctxNew.lineTo(centerX, centerY + plusLen / 2);
ctxNew.stroke();

newCanvasPreview.onclick = () => {
  localStorage.removeItem('openImage');
  window.location.href = "../notebook_interface/notebook.html";
};
gallery.appendChild(newCanvasPreview);