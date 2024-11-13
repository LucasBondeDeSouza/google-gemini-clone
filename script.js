const messageForm = document.querySelector('.prompt__form')
const chatHistoryContainer = document.querySelector('.chats')
const suggestionItems = document.querySelectorAll('.suggest__item')

const themeToggleButton = document.getElementById('themeToggler')
const clearChatButton = document.getElementById('deleteButton')

// State variables
let currentUserMessage = null
let isGeneratingResponse = false

const GOOGLE_API_KEY = 'AIzaSyCkrGwZmWzVK-fWP8dBBIJT9NEMPKKW3eI'
const API_REQUEST_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`

// Load saved data from local storage
const loadSavedChatHistory = () => {
    const savedConversations = JSON.parse(localStorage.getItem('saved-api-chats')) || []
    const isLightTheme = localStorage.getItem('theme-color') === 'light-mode'

    document.body.classList.toggle('light_mode', isLightTheme)
    themeToggleButton.innerHTML = isLightTheme ? '<i class="bx bx-moon"></i>' : '<i class="bx bx-sun"></i>'

    chatHistoryContainer.innerHTML = ''

    // Iterate through saved chat history and display messages
    savedConversations.forEach(conversation => {
        // Display the user's  message
        const userMessageHTML = `

            <div class="message__content">
                <img class="message__avatar" src="assets/profile.png" alt="User Avatar" />
                <p class="message__text">${conversation.userMessage}</p>
            </div>

        `

        const outgoingMessageElement = createChatMessageElement(userMessageHTML, 'message--outgoing')
        chatHistoryContainer.appendChild(outgoingMessageElement)

        // Display the API response
        const responseText = conversation.apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text
        const parsedApiResponse = marked.parse(responseText) // Convert to HTML
        const rawApiResponse = responseText // Plai text version

        const responseHtml = `

        <div class="message__content">
            <img class="message__avatar" src="assets/gemini.svg" alt="Gemini avatar" />
            <p class="message__text"></p>
            <div class="message__loading-indicator hide">
                <div class="message__loading-bar"></div>
                <div class="message__loading-bar"></div>
                <div class="message__loading-bar"></div>
            </div>
        </div>

        <span onClick="copyMessageToClipboard(this)" class="message__icon hide">
            <i class="bx bx-copy-alt"></i>
        </span>

        `

        const incomingMessageElement = createChatMessageElement(responseHtml, 'message--incoming')
        chatHistoryContainer.appendChild(incomingMessageElement)

        const messageTextElement = incomingMessageElement.querySelector('.message__text')

        // Display saved chat without typing effect
        showTypingEffect(rawApiResponse, parsedApiResponse, messageTextElement, incomingMessageElement, true) // 'true' skips typing 
    })

    document.body.classList.toggle('hide-header', savedConversations.length > 0)
}

