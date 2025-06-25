import { useState } from "react"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react"
import { useAuthStore } from "../store/authStore"

const Chatbot = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([])

  const handleSend = async (message) => {
    const messageMade = {
      message: message,
      sender: "user",
      direction: "outgoing",
    }

    const updatedMessages = [...messages, messageMade]
    setMessages(updatedMessages)
    setTyping(true)

    await processMessageToChatGPT(updatedMessages)
  }

  async function processMessageToChatGPT(chatMessages) {
    const apiMessage = chatMessages.map((messageObj) => {
      let role = ""
      if (messageObj.sender === "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObj.message }
    })

    fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiMessage),
    })
      .then((response) => response.json())
      .then((data) => {
       

        const messageByAI = {
          message: data,
          sender: "assistant",
          direction: "incoming",
        }

        setMessages((prevMessages) => [...prevMessages, messageByAI])
        setTyping(false)
      })
      .catch((error) => {
       
        setTyping(false)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "An error occurred. Please try again.",
            sender: "system",
            direction: "incoming",
          },
        ])
      })
  }

  return (
    (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {isAuthenticated ? (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Pharma AI Chatbot
              </h1>
              <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
                Practice real-world pharmacy scenarios, ask clinical questions, and get instant feedback.
                <br />
                <span className="text-sm text-slate-500 mt-2 block">
                  Type your question or case below to get started!
                </span>
              </p>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="h-[600px]">
                <MainContainer className="w-full h-full">
                  <ChatContainer className="w-full h-full">
                    <MessageList typingIndicator={typing ? <TypingIndicator content="AI is thinking..." /> : null}>
                      {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-10 h-10 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 mb-2">Welcome to Pharma AI!</h3>
                          <p className="text-slate-500 text-sm">
                            Start a conversation by typing your first message below.
                          </p>
                        </div>
                      )}
                      {messages.map((message, i) => {
                        return <Message key={i} model={message} />
                      })}
                    </MessageList>
                    <MessageInput
                      placeholder="Type your pharmacy question here..."
                      onSend={handleSend}
                      attachButton={false}
                    />
                  </ChatContainer>
                </MainContainer>
              </div>
            </div>

          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center max-w-md mx-4">
              <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Authentication Required</h2>
              <p className="text-slate-600 mb-6">
                Please log in to access the Pharma AI Chatbot and start your learning journey.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login Required
              </div>
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default Chatbot
