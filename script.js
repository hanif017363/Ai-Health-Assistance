const SECRET_API_KEY =
  "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";

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Display user
  chatBox.innerHTML += `<div class="you-box"><b class ="you">You:</b> ${userMessage}</div>`;
  input.value = "";

  // Valentine AI
  const reply = await aiChatRouter(userMessage);
  chatBox.innerHTML += `<div class="her-box"><b class ="her">Valentina:</b> ${reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function aiChatRouter(userMessage) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SECRET_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528",
        messages: [
          {
            role: "system",
            content: `
           You are Valentine, a polite and concise health chatbot.

- If the user greets you (like "hi", "hello"), simply greet them back briefly.
- Only explain your specialty if the user asks a question.
- Health questions → reply clearly and helpfully.
- Non-health questions → politely note it's not your specialty, but give a short answer.
- Never explain your reasoning or inner thoughts.
- Keep answers under 3 short sentences.
                          `.trim(),
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
        temperature: 1,
      }),
    }
  );

  const data = await response.json();

  console.log("Full API Response:", data);

  if (!data.choices) {
    return "Seek Help! :" + (data.error?.message || "Unknown issue");
  }

  return (
    data.choices[0].message.content ||
    // data.choices[0].message.reasoning ||
    "Sorry, no response."
  );
}

document
  .getElementById("user-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

// - Your goal is to provide short, clear, and encouraging health advice.
//health assistant
