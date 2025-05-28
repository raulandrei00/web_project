// Load saved images from localStorage
let username = localStorage.getItem('currentUser');
// console.log("Username:", username);
if (!username) { // change to a login form
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

const newCanvasContainer = document.createElement('div');
newCanvasContainer.style.display = 'flex';
newCanvasContainer.style.flexDirection = 'column';
newCanvasContainer.style.alignItems = 'center';
newCanvasContainer.style.margin = '12px';

const newCanvasLabel = document.createElement('div');
newCanvasLabel.textContent = 'new canvas';
newCanvasLabel.style.marginBottom = '6px';
newCanvasLabel.style.fontWeight = 'bold';
newCanvasLabel.style.fontSize = '1rem';
newCanvasLabel.style.color = '#05386B';

newCanvasContainer.appendChild(newCanvasLabel);
newCanvasContainer.appendChild(newCanvasPreview);

gallery.appendChild(newCanvasContainer);
  saved.forEach((data, idx) => {
    console.log("Name:", data.name);
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.margin = '12px';

    const nameElem = document.createElement('div');
    nameElem.textContent = data.name || 'Untitled';
    nameElem.style.marginBottom = '6px';
    nameElem.style.fontWeight = 'bold';
    nameElem.style.fontSize = '1rem';
    nameElem.style.color = '#05386B';

    container.appendChild(nameElem);
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
      // Fill background with white
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
      // Draw the image preview
      ctx.drawImage(
        img,
        0, 0, 3000, 2000, // source x, y, width, height (from original)
        0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT // dest x, y, width, height (preview)
      );
    };
    img.src = data.img;

    previewCanvas.onclick = () => {
      const dataWithIndex = { ...saved[idx], _idx: idx, name: data.name || `Untitled ${idx + 1}` };
      localStorage.setItem('openImage', JSON.stringify(dataWithIndex));
      window.location.href = "../notebook_interface/notebook.html";
    };
    container.appendChild(previewCanvas);
    gallery.appendChild(container);
  });
}
