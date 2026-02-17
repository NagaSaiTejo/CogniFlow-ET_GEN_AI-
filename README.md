# 🧠 AI Context Answer Bot (Chrome Extension)

AI Context Answer Bot is a lightweight Chrome extension that allows you to ask questions about **any webpage** and receive instant answers based on the **content of the page itself**.  
It works as a **floating on-screen assistant**, so you never need to leave the page you’re browsing.

---

## ✨ Key Features

- 📌 Floating assistant on the webpage (not a toolbar popup)
- 📖 Context-aware answers using the current page content
- 🔁 Chat persists even after closing and reopening the box
- 🆕 "New Chat" option to start a fresh conversation
- ⚡ Fast responses powered by Groq LLMs
- 🔒 API key stored safely outside the repository
- 🧩 Works on all websites
- 🎯 Minimal, distraction-free interface

---

## 📂 Project Structure

ai-context-answer-bot/
├── manifest.json
├── content.js # Main extension logic
├── config.js # API key (not committed to GitHub)
├── background.js
├── popup.html
├── popup.js
├── sidepanel.html
└── README.md


---

## 🔐 API Key Setup (IMPORTANT)

To keep your API key secure, it is **not stored inside the main code**.

### Step needed to do: Create `config.js`

Inside the extension folder, create a file named:
    config.js

Add the following:
    const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';
        Do NOT commit this file to GitHub.

## Installation (First Time)

    Clone or download this repository
    Open Chrome and go to:
    chrome://extensions/
    Enable Developer Mode (top-right corner)
    Click Load unpacked
    Select the extension folder

The floating assistant will now appear on webpages.

## How to Use

    Open any webpage
    Click the floating AI icon on the screen
    Type your question in the input box
    Click Ask
    View the answer generated from the page context
    Close the box and reopen — the answer will still be there
    Click New Chat to clear the current conversation

## Using This Extension on Another PC

    To use this extension on another computer:
    Clone this repository on the new PC
    Create a new config.js file
    Paste your Groq API key into config.js
    Load the extension using Load unpacked
    Start using it immediately
    No reconfiguration needed.

## Updating the API Key

    If your API key expires or changes:
        get api key from here https://console.groq.com/keys and
        Open config.js
        Replace the old key with the new one
        Reload the extension from chrome://extensions/
## License
    This project is licensed under the MIT License.
    You are free to use, modify, and learn from it for educational purposes.

## Disclaimer

This extension is intended for learning, research, and productivity use only.
Please ensure compliance with website terms of service when using AI-generated assistance.