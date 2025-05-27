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