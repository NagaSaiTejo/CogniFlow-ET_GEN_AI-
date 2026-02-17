# 🧠 CogniFlow: Making the Web Accessible for Every Mind

> **CogniFlow** is an AI-powered browser assistant designed to support neurodiverse users (ADHD, Dyslexia). It features **Bionic Reading** for faster focus, **Smart Simplification** for complex text, and instant **Context Summaries**—all without leaving the page.

---

## 🌟 Why I Built This
The web is overwhelmingly complex. I built this to make information accessible, clear, and calm for everyone, especially neurodiverse minds. Beacause clarity is a right, not a privilege.

---

## ✨ Key Features

- 🧠 **Cognitive Simplification:** Instantly rewrites complex jargon into plain, easy-to-understand language.
- 👁️ **Bionic Reading Mode:** Highlights word starts to guide the eye, proven to help users with ADHD and Dyslexia read faster.
- 📝 **Instant Summarization:** Reduces information overload by condensing long articles into key points.
- 💬 **Context-Aware Assistance:** Ask questions about any page content without losing your place.
- 🔒 **Privacy First:** Your API key is stored locally, not on a server.
- 🧩 **Universal Compatibility:** Works on all websites.

---

## 📂 Project Structure

```
cogniflow/
├── manifest.json
├── content.js      # Main extension logic (Bionic Reading, Simplification)
├── config.js       # API key (not committed to GitHub)
├── background.js   # Service worker
├── popup.html      # Popup UI
├── popup.js        # Popup logic
├── sidepanel.html  # Side panel UI
└── README.md
```

---

## 🔐 API Key Setup (IMPORTANT)

To keep your API key secure, it is **not stored inside the main code**.

### Step 1: Create `config.js`

Inside the extension folder, create a file named `config.js` and add the following:

```javascript
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';
```

**Do NOT commit this file to GitHub.**

---

## 🚀 Installation

1.  Clone or download this repository.
2.  Open Chrome and go to `chrome://extensions/`.
3.  Enable **Developer Mode** (top-right corner).
4.  Click **Load unpacked**.
5.  Select the extension folder.

The floating assistant will now appear on webpages.

---

## 📖 How to Use

1.  **Open any webpage.**
2.  **Select text** to see the floating menu.
3.  Choose an option:
    *   **Simplify:** Rewrite complex text.
    *   **Summarize:** Get a quick overview.
    *   **Bionic Read:** Convert text to bionic reading mode.
4.  **Ask Questions:** Click the floating icon to open the chat and ask questions about the page content.
5.  **Undo:** Click the "Undo" button in the modal or re-click highlighted text to revert changes.

---

## 🔄 Using on Another PC

1.  Clone this repository on the new PC.
2.  Create a new `config.js` file.
3.  Paste your Groq API key into `config.js`.
4.  Load the extension using **Load unpacked**.

---

## 🔑 Updating the API Key

If your key expires:
1.  Get a new key from [Groq Console](https://console.groq.com/keys).
2.  Update `config.js`.
3.  Reload the extension from `chrome://extensions/`.

---

## 📜 License

This project is licensed under the MIT License. You are free to use, modify, and learn from it for educational purposes.

## ⚠️ Disclaimer

This extension is intended for learning, research, and productivity. Please ensure compliance with website terms of service when using AI-generated assistance.