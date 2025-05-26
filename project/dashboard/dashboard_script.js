// Load saved images from localStorage
const saved = JSON.parse(localStorage.getItem("savedImages") || "[]");
const gallery = document.getElementById('gallery');
const emptyMsg = document.getElementById('emptyMsg');
if (saved.length === 0) {
  emptyMsg.style.display = 'block';
} else {
  saved.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Saved Canvas " + (idx + 1);
    img.title = "Click to open in new tab";
    img.onclick = () => {
      localStorage.setItem('openImage', src);
      window.location.href = "../notebook_interface/notebook.html";
    };
    gallery.appendChild(img);
  });
}