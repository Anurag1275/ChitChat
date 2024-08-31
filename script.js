const ChatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyCUiT43vkoltfLMpBYU_NHmH8ObKyQv-Ps";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;

    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?';
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: {
                text: userMessage
            }
        }),
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            // Log the entire response to see its structure
            console.log(data);

            // Adjust this line based on the actual structure of the response
            if (data.candidates && data.candidates.length > 0) {
                messageElement.textContent = data.candidates[0].output;
            } else {
                messageElement.textContent = "Isse kya chattiya raha h, bhabhiji nazar h kya";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            messageElement.textContent = "Oops, something went wrong...";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = ChatInput.value.trim();
    console.log(userMessage);
    if (!userMessage) return;
    ChatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

sendChatbtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
