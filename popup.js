chrome.storage.local.get("apiKey", (data) => {
  if (data.apiKey) {
    document.getElementById("apiKey").value = data.apiKey;
  }
});

document.getElementById("submitQuestion").addEventListener("click", () => {
  const question = document.getElementById("question").value;
  const apiKey = document.getElementById("apiKey").value;
  
  if (question && apiKey) {
    chrome.storage.local.set({ apiKey: apiKey }, () => {
      console.log("API key saved to local storage");
    });

    console.log("Question:", question);

    // Fetch page content from active tab
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageContent'}, (response) => {
        const pageContent = response?.content || 'No page context available';
        console.log("Page content:", pageContent);

        // Call Groq function with fetched page content
        getAnswerFromGroq(apiKey, question, pageContent)
          .then((answer) => {
            document.getElementById("response").value = answer;
          })
          .catch((error) => {
            console.error("Error getting answer from Groq API:", error);
            document.getElementById("response").value = "Error: " + error.message;
          });
      });
    });
  } else {
    document.getElementById("response").value = "Please enter a question and API key.";
  }
});

function getAnswerFromGroq(apiKey, question, pageContent) {
  return new Promise(async (resolve, reject) => {
    const apiURL = "https://api.groq.com/openai/v1/chat/completions";

    const prompt = `Context from webpage: ${pageContent}\n\nQuestion: ${question}\n\nAnswer concisely:`;

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      if (response.status !== 200) {
        const errorText = await response.text();
        reject(new Error(`Groq API Error ${response.status}: ${errorText}`));
        return;
      }

      const data = await response.json();
      const answer = data.choices[0].message.content.trim();
      resolve(answer);
    } catch (error) {
      reject(error);
    }
  });
}
