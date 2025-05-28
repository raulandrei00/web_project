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

/* eslint-disable indent */
const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 200;

if (!username) {
  promptLogin(showGallery);
    
}
else {
  showGallery();
}

function addPreview (div) {
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
  div.appendChild(newCanvasContainer);
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
    
    addPreview(emptyMsg);
  } else {
    
  
  addPreview(gallery);
  
  saved.forEach((data, idx) => {
    
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.margin = '12px';
    const nameWrapper = document.createElement('div');
    nameWrapper.style.display = 'flex';
    nameWrapper.style.alignItems = 'center';
    nameWrapper.style.justifyContent = 'space-between';
    nameWrapper.style.width = `${PREVIEW_WIDTH}px`;
    nameWrapper.style.boxSizing = 'border-box';
    nameWrapper.style.textAlign = 'left';

    const nameText = document.createElement('span');
    nameText.textContent = data.name || 'Untitled';
    nameText.style.fontWeight = 'bold';
    nameText.style.fontSize = '1rem';
    nameText.style.color = '#05386B';
    nameText.style.marginLeft = '8px';

    // Button group container
    const btnGroup = document.createElement('span');
    btnGroup.style.display = 'flex';
    btnGroup.style.alignItems = 'center';
    btnGroup.style.gap = '8px';

    const editBtn = document.createElement('span');
    editBtn.textContent = '✏️';
    editBtn.style.cursor = 'pointer';
    editBtn.style.display = 'none';
    editBtn.title = 'Edit name';
    editBtn.tabIndex = 0;

    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.display = 'none';
    deleteBtn.title = 'Delete image';
    deleteBtn.tabIndex = 0;

    deleteBtn.onclick = () => {
      // Create confirmation modal
      const confirmModal = document.createElement('div');
      confirmModal.classList.add('modal', 'active');
      confirmModal.innerHTML = `
        <div class="modal-content">
          <h3>Confirm Delete</h3>
          <div>Are you sure you want to delete <b>${nameText.textContent}</b>?</div>
          <div class="modal-actions" style="margin-top:16px; display:flex; gap:12px; justify-content:center;">
            <button id="confirmDeleteYes" class="btn-center" style="background:#e74c3c;color:#fff;">Yes</button>
            <button id="confirmDeleteNo" class="btn-center">No</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);

      confirmModal.querySelector('#confirmDeleteYes').onclick = () => {
        saved.splice(idx, 1);
        localStorage.setItem(userKey, JSON.stringify(saved));
        gallery.innerHTML = '';
        showGallery();
        confirmModal.remove();
      };
      confirmModal.querySelector('#confirmDeleteNo').onclick = () => {
        confirmModal.remove();
      };
    };

    const sendBtn = document.createElement('span');
    sendBtn.textContent = '📤';
    sendBtn.style.cursor = 'pointer';
    sendBtn.style.display = 'none';
    sendBtn.title = 'Send image';
    sendBtn.tabIndex = 0;

    sendBtn.onclick = () => {
      // Create modal
      const sendModal = document.createElement('div');
      sendModal.classList.add('modal', 'active');
      sendModal.innerHTML = `
        <div class="modal-content">
          <h3>Send Image To...</h3>
          <input id="userSearchInput" type="text" placeholder="Type username..." style="width:90%;margin-bottom:10px;padding:6px 8px;font-size:1rem;border-radius:4px;border:1px solid #bbb;">
          <div id="userList" style="max-height:180px;overflow-y:auto;margin-bottom:10px;"></div>
          <div class="modal-actions" style="display:flex;justify-content:center;gap:12px;">
            <button id="sendCancelBtn" class="btn-center">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(sendModal);

      const userSearchInput = sendModal.querySelector('#userSearchInput');
      const userList = sendModal.querySelector('#userList');
      const sendCancelBtn = sendModal.querySelector('#sendCancelBtn');

      // Get all users except current
      let users = JSON.parse(localStorage.getItem('users') || '[]')
        .map(u => u.username)
        .filter(u => u !== username)
        .sort((a, b) => a.localeCompare(b));

      // Show first 5 users initially
      let filteredUsers = users.slice(0, 5);

      function renderUserList(list) {
        userList.innerHTML = '';
        if (list.length === 0) {
          userList.innerHTML = '<div style="color:#888;padding:8px;">No users found.</div>';
          return;
        }
        list.forEach(u => {
          const userRow = document.createElement('div');
          userRow.textContent = u;
          userRow.style.padding = '8px 12px';
          userRow.style.cursor = 'pointer';
          userRow.style.borderRadius = '4px';
          userRow.style.marginBottom = '2px';
          userRow.tabIndex = 0;
          userRow.onmouseenter = () => userRow.style.background = '#e0f0ff';
          userRow.onmouseleave = () => userRow.style.background = '';
          userRow.onclick = () => {
            // Add image to selected user's memory
            const targetKey = `savedImages_${u}`;
            const targetImages = JSON.parse(localStorage.getItem(targetKey) || '[]');
            // Avoid duplicate by name+img
            if (!targetImages.some(imgObj => imgObj.name === data.name && imgObj.img === data.img)) {
              targetImages.push({ ...data });
              localStorage.setItem(targetKey, JSON.stringify(targetImages));
            }
            sendModal.remove();
            // Optional: show confirmation
            const okModal = document.createElement('div');
            okModal.classList.add('modal', 'active');
            okModal.innerHTML = `
              <div class="modal-content">
                <div style="margin-bottom:10px;">Image sent to <b>${u}</b>!</div>
                <div class="modal-actions" style="display:flex;justify-content:center;">
                  <button id="okBtn" class="btn-center">OK</button>
                </div>
              </div>
            `;
            document.body.appendChild(okModal);
            okModal.querySelector('#okBtn').onclick = () => okModal.remove();
          };
          userList.appendChild(userRow);
        });
      }

      renderUserList(filteredUsers);

      userSearchInput.addEventListener('input', () => {
        const val = userSearchInput.value.trim().toLowerCase();
        let shown;
        if (val === '') {
          shown = users.slice(0, 5);
        } else {
          shown = users.filter(u => u.toLowerCase().includes(val));
        }
        renderUserList(shown);
      });

      sendCancelBtn.onclick = () => sendModal.remove();
    };

    // Add buttons to group
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    btnGroup.appendChild(sendBtn);

    let editing = false;

    // Show/hide buttons on hover
    nameWrapper.addEventListener('mouseenter', () => {
      if (!editing) {
        editBtn.style.display = 'inline';
        deleteBtn.style.display = 'inline';
        sendBtn.style.display = 'inline';
      }
    });
    nameWrapper.addEventListener('mouseleave', () => {
      if (!editing) {
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        sendBtn.style.display = 'none';
      }
    });

    // Compose the row: name on left, buttons on right
    nameWrapper.appendChild(nameText);
    nameWrapper.appendChild(btnGroup);

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

        editing = true;
        editBtn.style.display = 'inline'; // Keep it visible while editing

        let replaced = false;
        function replaceInput(newName) {
          if (replaced) return;
          replaced = true;
          nameText.textContent = newName;
          nameWrapper.replaceChild(nameText, input);
          editing = false;
          editBtn.style.display = 'none';
          deleteBtn.style.display = 'none';
          sendBtn.style.display = 'none';
        }

        input.onkeydown = (e) => {
          if (e.key === 'Enter') {
            const newName = input.value.trim() || 'Untitled';
            data.name = newName;
            saved[idx].name = newName;
            localStorage.setItem(userKey, JSON.stringify(saved));
            replaceInput(newName);
          } else if (e.key === 'Escape') {
            replaceInput(nameText.textContent);
          }
        };
        input.onblur = () => {
          replaceInput(nameText.textContent);
        };
      };
    });
  }
}