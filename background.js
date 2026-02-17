// background.js
try {
  importScripts('config.js');
} catch (e) {
  console.error(e);
}

const SYSTEM_PROMPTS = {
  simplify: "You are a cognitive accessibility assistant. Rewrite the following text to be simpler, clearer, and easier to understand. Use plain language (Grade 8 level). Break long sentences. Keep the meaning intact. Do not add conversational filler.",
  summarize: "You are a concise summarizer. Summarize the following text into 3-5 key bullet points. Keep it factual and direct."
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Message received', request);
  if (request.action === 'processText') {
    handleAIRequest(request.text, request.mode)
      .then(data => {
        console.log('Background: Request success');
        sendResponse({ data });
      })
      .catch(error => {
        console.error('Background: Request failed', error);
        sendResponse({ error: error.message });
      });
    return true; // Keep channel open for async response
  }
});

async function handleAIRequest(text, mode) {
  if (!GROQ_API_KEY) throw new Error('API Key missing in config.js');

  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.simplify;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Fast model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API Request Failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
}
