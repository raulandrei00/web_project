
let username = localStorage.getItem('currentUser');

console.log("Current user:", username);

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
      if (callback) callback();
    } else {
      loginMsg.textContent = 'Invalid credentials.';
    }
  };
}


const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 200;

if (!username) { // change to a login form
    console.log("No user logged in, prompting for login");
    promptLogin(showGallery);
    
}
else {
  console.log("User logged in:", username);
    showGallery();
}

function showGallery ()
{  
  username = localStorage.getItem('currentUser') || '';
const userKey = `savedImages_${username}`;
const saved = JSON.parse(localStorage.getItem(userKey) || "[]");
const gallery = document.getElementById('gallery');
const emptyMsg = document.getElementById('emptyMsg');

  if (saved.length === 0) {
    emptyMsg.style.display = 'block';
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
    emptyMsg.appendChild(newCanvasContainer);
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
      
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.margin = '12px';

      const nameWrapper = document.createElement('div');
  nameWrapper.style.position = 'relative';
  nameWrapper.style.display = 'inline-block';
  nameWrapper.style.width = `${PREVIEW_WIDTH}px`;
  nameWrapper.style.boxSizing = 'border-box';
  nameWrapper.style.textAlign = 'center';

  const nameText = document.createElement('span');
  nameText.textContent = data.name || 'Untitled';
  nameText.style.fontWeight = 'bold';
  nameText.style.fontSize = '1rem';
  nameText.style.color = '#05386B';

  const editBtn = document.createElement('span');
  editBtn.textContent = '✏️';
  editBtn.style.marginLeft = '8px';
  editBtn.style.cursor = 'pointer';
  editBtn.style.display = 'none';
  editBtn.title = 'Edit name';
  editBtn.tabIndex = 0;

  nameWrapper.appendChild(nameText);
  nameWrapper.appendChild(editBtn);

  nameWrapper.addEventListener('mouseenter', () => {
    editBtn.style.display = 'inline';
  });
  nameWrapper.addEventListener('mouseleave', () => {
    editBtn.style.display = 'none';
  });

      container.appendChild(nameWrapper);
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

      editBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = nameText.textContent;
        input.style.fontSize = nameText.style.fontSize;
        input.style.fontWeight = nameText.style.fontWeight;
        input.style.color = nameText.style.color;
        input.style.width = `${Math.max(80, nameText.offsetWidth)}px`;
        nameWrapper.replaceChild(input, nameText);
        input.focus();
        input.select();

        input.onkeydown = (e) => {
          if (e.key === 'Enter') {
            const newName = input.value.trim() || 'Untitled';
            nameText.textContent = newName;
            data.name = newName;
            saved[idx].name = newName;
            localStorage.setItem(userKey, JSON.stringify(saved));
            nameWrapper.replaceChild(nameText, input);
            editBtn.style.display = 'none';
          } else if (e.key === 'Escape') {
            nameWrapper.replaceChild(nameText, input);
            editBtn.style.display = 'none';
          }
        };
        input.onblur = () => {
          nameWrapper.replaceChild(nameText, input);
          editBtn.style.display = 'none';
        };
      };
    });
  }
}