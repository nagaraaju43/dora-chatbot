const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight =  chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = do3cument.createElement("li");
    chatLi.classList.add("chat" , className);
    let chatContent = className === "outgoing" ? `<p></p>`: `<span class="material-symbols-outlined">bot</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message; 
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage}]
        })
    }

    //snds post req to api to get respnse
    fetch(API_URL,requestOptions).then(res => res.json()).then(data  => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went Wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";

    //appending the users msg.
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    // chatbox.scrollTo(0, chatbox.scrollHeight);

    //displyng thnkng mesg  while watng fr rspnse 
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking..." , "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600); 
}

chatInput.addEventListener("input" , () =>{
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

sendChatBtn.addEventListener("click" , handleChat);
chatbotCloseBtn.addEventListener("click" , () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click" , () => document.body.classList.toggle("show-chatbot"));
