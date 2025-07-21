const chatInput = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");
let userText = null;


const saveChatHistory = () => {
    localStorage.setItem("chat_history", chatContainer.innerHTML);
}

const loadChatHistory = () => {
    const savedHistory = localStorage.getItem("chat_history");
    if (savedHistory) {
        chatContainer.innerHTML = savedHistory;
    }
}

const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeBtn.textContent = "dark_mode";
    }
};

const toggleTheme = () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "dark_mode";
    } else {
        localStorage.removeItem("theme");
        themeBtn.textContent = "light_mode";
    }
};

const createElement = (html,className) =>{
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

async function getBotResponse(prompt) {
    try {
        const response = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama3",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    stream: false
                }),
            }
        );
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", errorText);
            return `API error: ${errorText}`;
        }
        const result = await response.json();
        if (result && result.message && result.message.content) {
            return result.message.content;
        } else if (result.error) {
            return `Error: ${result.error}`;
        }
        return "Sorry, I couldn't generate a response.";
    } catch (e) {
        return `Network error: ${e.message}`;
    }
}

const showTypingAnimation = ()=>{
    // Added onclick="copyResponse(this)" to the copy button span
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="chatgpt.jpg" alt="">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    const incomingChatDiv = createElement(html,"incoming");
    chatContainer.appendChild(incomingChatDiv);
    return incomingChatDiv;
}

function removeRepetitions(text) {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const seen = new Set();
    const result = [];
    for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (trimmed && !seen.has(trimmed)) {
            seen.add(trimmed);
            result.push(trimmed);
        }
    }
    return result.join(' ');
}

const handleOutgoingChat = async ()=>{
    userText = chatInput.value.trim();
    if(!userText) return;
    chatInput.style.height = "auto";
    const html = ` <div class="chat-content">
                        <div class="chat-details">
                            <img src="user.jpg" alt="">
                            <p>${userText}</p>
                        </div>
                    </div>`;
    const outgoingChatDiv = createElement(html,"outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    chatInput.value = "";
    const typingDiv = showTypingAnimation();
    let botResponse = await getBotResponse(userText);
    botResponse = removeRepetitions(botResponse);
    const responseContainer = typingDiv.querySelector(".chat-details");
    const typingAnimation = responseContainer.querySelector(".typing-animation");
    const responseParagraph = document.createElement("p");
    responseParagraph.textContent = botResponse;
    if (typingAnimation) {
        responseContainer.replaceChild(responseParagraph, typingAnimation);
    }
    saveChatHistory();
}

deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all chats?")) {
        chatContainer.innerHTML = "";
        localStorage.removeItem("chat_history");
    }
});

themeBtn.addEventListener("click", toggleTheme);
sendBtn.addEventListener("click", handleOutgoingChat);

chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleOutgoingChat();
    }
});

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    if (responseTextElement) {
        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(responseTextElement.textContent).then(() => {
            copyBtn.textContent = "done";
            setTimeout(() => {
                copyBtn.textContent = "content_copy";
            }, 1000);
        });
    }
};

// Load saved data when the page loads
loadSavedTheme();
loadChatHistory();