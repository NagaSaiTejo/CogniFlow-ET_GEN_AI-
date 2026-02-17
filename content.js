// content.js - ClarifyAI Logic
console.log('ClarifyAI: Script loaded');

let menu = null;
let resultModal = null;
let lastSelectionRange = null;
let currentSelectedText = ''; // Store text to prevent loss on click

// Icons (SVG)
const LOGO_ICON = `<svg viewBox="0 0 24 24" fill="none" class="clarify-logo" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M17.657 17.657l-.707-.707M12 21v-1M4.343 17.657l.707-.707M3 12h1m1.636-6.364l.707.707" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 12a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`;
const MAGIC_ICON = `✨`;
const LIST_ICON = `📝`;
const EYE_ICON = `👁️`;
const RESTORE_ICON = `↩️`;

document.addEventListener('mouseup', handleSelection, true);
document.addEventListener('keyup', (e) => {
  // Fallback for keyboard selection
  handleSelection(e);
}, true);

// Hide on scroll to prevent floating button staying in place while text moves
window.addEventListener('scroll', () => {
  if (menu && menu.classList.contains('visible')) hideWidget();
}, { capture: true, passive: true });

document.addEventListener('mousedown', (e) => {
  // Hide IF clicking outside the widget
  if (menu && !menu.contains(e.target)) {
    hideWidget();
  }
});

function handleSelection(e) {
  // Check if it's a valid interaction
  const selection = window.getSelection();
  const text = selection.toString().trim();

  // Debug logs
  console.log('ClarifyAI: handleSelection', e.type);

  // IGNORE clicks inside the menu or modal (Fixes "jumping" and interference)
  if ((menu && menu.contains(e.target)) || (resultModal && resultModal.contains(e.target))) {
    return;
  }

  // Check for click on existing clarification (for Persistent Undo)
  const anchorNode = selection.anchorNode;
  const parentElement = anchorNode && anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode;

  if (parentElement && parentElement.classList.contains('clarify-highlight')) {
    console.log('ClarifyAI: Clicked on existing highlight');
    const rect = parentElement.getBoundingClientRect();
    showUndoMenu(rect.right, rect.top, parentElement);
    return;
  }

  if (text.length > 10) {
    lastSelectionRange = selection.getRangeAt(0);
    currentSelectedText = text; // Store it!

    // Position Preference: Mouse Cursor > Selection End
    let x, y;

    if (e.clientX !== undefined && e.clientY !== undefined) {
      // Mouse event
      x = e.clientX;
      y = e.clientY;
      console.log('ClarifyAI: Using Mouse Coords', x, y);
    } else {
      // Keyboard or other event - fallback to rect
      const rect = lastSelectionRange.getBoundingClientRect();
      x = rect.right;
      y = rect.top;
      console.log('ClarifyAI: Using Rect Coords', x, y);
    }

    // Offset slightly
    // Position a bit to the right and above the cursor/selection end
    const finalX = x + 10;
    const finalY = y - 10;

    showMenuImmediately(finalX, finalY);
  } else {
    // Don't hide immediately if clicking the menu itself
    // Handled by mousedown listener
  }
}

function showMenuImmediately(x, y) {
  if (!menu) {
    console.log('ClarifyAI: Creating Menu UI');
    createMenuUI();
  }

  // Restore main menu content if it was changed (e.g. by undo)
  resetMenuToMain();

  // Boundary checks (keep inside viewport)
  const margin = 10;
  // Horizontal menu will be wider but shorter
  const menuWidth = 320; // Estimated width for 3 buttons side-by-side
  const menuHeight = 50;

  let safeX = Math.min(window.innerWidth - menuWidth - margin, Math.max(margin, x));
  let safeY = Math.min(window.innerHeight - menuHeight - margin, Math.max(margin, y));

  // Note: Since #clarify-ai-root is fixed, we use client coordinates directly
  menu.style.top = `${safeY}px`;
  menu.style.left = `${safeX}px`;

  menu.classList.add('visible');
  console.log(`ClarifyAI: Menu shown at fixed: ${safeX}, ${safeY}`);
}

function showUndoMenu(x, y, targetElement) {
  if (!menu) createMenuUI();

  // Replace menu content with Undo option
  menu.innerHTML = `
        <button class="clarify-menu-item" id="clarify-restore">
            <span class="clarify-icon">${RESTORE_ICON}</span> Undo Changes
        </button>
    `;

  // Position
  const margin = 10;
  const menuWidth = 140;
  const menuHeight = 50;

  let safeX = Math.min(window.innerWidth - menuWidth - margin, Math.max(margin, x));
  let safeY = Math.min(window.innerHeight - menuHeight - margin, Math.max(margin, y));

  menu.style.top = `${safeY}px`;
  menu.style.left = `${safeX}px`;
  menu.classList.add('visible');

  menu.querySelector('#clarify-restore').onclick = (e) => {
    e.stopPropagation();
    restoreFromElement(targetElement);
    hideWidget();
  };
}

function restoreFromElement(element) {
  if (!element.dataset.originalHtml) return;

  try {
    const originalHTML = decodeURIComponent(element.dataset.originalHtml);
    const tempSpan = document.createElement('span');
    tempSpan.innerHTML = originalHTML;

    // Unwrap
    const parent = element.parentNode;
    while (tempSpan.firstChild) {
      parent.insertBefore(tempSpan.firstChild, element);
    }
    parent.removeChild(element);
    console.log('ClarifyAI: Restored original content');
  } catch (e) {
    console.error('ClarifyAI: Restore failed', e);
  }
}

function hideWidget() {
  if (menu) menu.classList.remove('visible');
}

function createMenuUI() {
  // 1. Root Container
  let root = document.getElementById('clarify-ai-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'clarify-ai-root';
    document.body.appendChild(root);
  }

  // 2. Menu (Directly created, no trigger button)
  menu = document.createElement('div');
  menu.className = 'clarify-menu';
  root.appendChild(menu);

  // Initialize content
  resetMenuToMain();
}

function resetMenuToMain() {
  if (!menu) return;

  menu.innerHTML = `
        <button class="clarify-menu-item" id="clarify-simplify" title="Simplify Text">
            <span class="clarify-icon">${MAGIC_ICON}</span> Simplify
        </button>
        <button class="clarify-menu-item" id="clarify-summarize" title="Summarize Text">
            <span class="clarify-icon">${LIST_ICON}</span> Summarize
        </button>
        <button class="clarify-menu-item" id="clarify-bionic" title="Bionic Reading">
            <span class="clarify-icon">${EYE_ICON}</span> Bionic Read
        </button>
    `;

  // Menu Listeners
  menu.querySelector('#clarify-simplify').onclick = () => processText('simplify');
  menu.querySelector('#clarify-summarize').onclick = () => processText('summarize');
  menu.querySelector('#clarify-bionic').onclick = () => applyBionicReading();
}

function processText(mode, language = null) {
  console.log('ClarifyAI: Action clicked:', mode, language);

  // USE STORED TEXT instead of getting selection again (which might be lost on click)
  const text = currentSelectedText;

  if (!text) {
    console.warn('ClarifyAI: No text selected/stored for action');
    return;
  }

  hideWidget();
  showModal('Processing...', true);

  chrome.runtime.sendMessage({ action: 'processText', text, mode, language }, (response) => {
    console.log('ClarifyAI: Background response received', response);
    if (chrome.runtime.lastError) {
      console.error('ClarifyAI: Runtime Error:', chrome.runtime.lastError);
      updateModalContent('Error: ' + chrome.runtime.lastError.message);
    } else if (response.error) {
      console.error('ClarifyAI: Logic Error:', response.error);
      updateModalContent('Error: ' + response.error);
    } else {
      updateModalContent(response.data, true);
    }
  });
}

// --- Bionic Reading Logic (Local) ---
function applyBionicReading() {
  hideWidget();
  if (!lastSelectionRange) return;

  const fragment = lastSelectionRange.extractContents();
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while (node = walker.nextNode()) {
    const words = node.nodeValue.split(' ');
    const newNodes = [];
    words.forEach((word, index) => {
      if (word.trim().length === 0) {
        newNodes.push(document.createTextNode(word + (index < words.length - 1 ? ' ' : '')));
        return;
      }

      const splitPoint = Math.ceil(word.length / 2);
      const boldPart = word.slice(0, splitPoint);
      const normalPart = word.slice(splitPoint);

      const strong = document.createElement('b');
      strong.className = 'clarify-bionic-strong';
      strong.textContent = boldPart;

      newNodes.push(strong);
      newNodes.push(document.createTextNode(normalPart + (index < words.length - 1 ? ' ' : '')));
    });

    const parent = node.parentNode;
    newNodes.forEach(n => parent.insertBefore(n, node));
    parent.removeChild(node);
  }

  lastSelectionRange.insertNode(fragment);
  window.getSelection().removeAllRanges(); // Clear selection to show effect
}

// --- Modal Logic ---
let lastGeneratedText = '';
let currentWrapperNode = null;
let originalContentFragment = null;

function showModal(content, isLoading = false) {
  if (!resultModal) createModal();
  const body = resultModal.querySelector('.clarify-modal-content');
  const footer = resultModal.querySelector('.clarify-modal-footer');

  // Reset footer
  footer.innerHTML = '';
  footer.style.display = 'none';

  if (isLoading) {
    body.innerHTML = `
            <div class="clarify-loading">
                <div class="clarify-spinner"></div>
            </div>`;
  } else {
    body.innerHTML = content;
  }

  resultModal.classList.add('visible');
}

function updateModalContent(text, isSuccess = false) {
  if (!resultModal) return;
  const body = resultModal.querySelector('.clarify-modal-content');
  body.innerHTML = text.replace(/\n/g, '<br>');

  if (isSuccess) {
    lastGeneratedText = text;
    const footer = resultModal.querySelector('.clarify-modal-footer');
    footer.style.display = 'flex';

    // Render Actions
    footer.innerHTML = `
        <button class="clarify-btn clarify-btn-secondary" id="clarify-copy-btn">Copy</button>
        <button class="clarify-btn clarify-btn-primary" id="clarify-apply-btn">Apply to Page</button>
      `;

    // Handlers
    footer.querySelector('#clarify-copy-btn').onclick = () => {
      navigator.clipboard.writeText(text);
      const btn = footer.querySelector('#clarify-copy-btn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    };

    footer.querySelector('#clarify-apply-btn').onclick = () => applyToDom(text);
  }
}

function applyToDom(text) {
  if (!lastSelectionRange) return;

  // 1. Save original content for Undo (Persistent)
  const originalHTML = lastSelectionRange.extractContents();
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(originalHTML);
  const encodedOriginal = encodeURIComponent(tempDiv.innerHTML);

  // 2. Create Wrapper highlight
  currentWrapperNode = document.createElement('span');
  currentWrapperNode.className = 'clarify-highlight';
  currentWrapperNode.dataset.originalHtml = encodedOriginal; // Store for later
  currentWrapperNode.innerHTML = text.replace(/\n/g, '<br>'); // Simple formatting

  // 3. Insert new content
  lastSelectionRange.insertNode(currentWrapperNode);

  // 4. Update Modal to show Undo
  const footer = resultModal.querySelector('.clarify-modal-footer');
  footer.innerHTML = `
        <button class="clarify-btn clarify-btn-secondary" id="clarify-close-done">Done</button>
        <button class="clarify-btn clarify-btn-undo" id="clarify-undo-btn">Undo Changes</button>
    `;

  footer.querySelector('#clarify-undo-btn').onclick = undoChange;
  footer.querySelector('#clarify-close-done').onclick = () => hideWidget();
}

function undoChange() {
  // This is the immediate undo from the modal
  if (!currentWrapperNode) return;
  restoreFromElement(currentWrapperNode);

  // Revert buttons to Apply state
  const footer = resultModal.querySelector('.clarify-modal-footer');
  footer.innerHTML = `
        <button class="clarify-btn clarify-btn-secondary" id="clarify-copy-btn">Copy</button>
        <button class="clarify-btn clarify-btn-primary" id="clarify-apply-btn">Apply to Page</button>
      `;

  footer.querySelector('#clarify-copy-btn').onclick = () => navigator.clipboard.writeText(lastGeneratedText);
  footer.querySelector('#clarify-apply-btn').onclick = () => applyToDom(lastGeneratedText);
}

function createModal() {
  resultModal = document.createElement('div');
  resultModal.className = 'clarify-result-modal';
  resultModal.innerHTML = `
        <div class="clarify-modal-header">
            <div class="clarify-modal-title">
                ${LOGO_ICON} ClarifyAI Result
            </div>
            <button class="clarify-close-btn" id="clarify-modal-close">✕</button>
        </div>
        <div class="clarify-modal-content"></div>
        <div class="clarify-modal-footer"></div>
    `;

  document.body.appendChild(resultModal);

  resultModal.querySelector('#clarify-modal-close').onclick = () => {
    resultModal.classList.remove('visible');
  };
}