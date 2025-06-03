import { useState } from 'react'
import './App.css'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react"

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([])
  
  const handleSend = async (message) => {
    const messageMade = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    const setMessage = [...messages, messageMade];
    setMessages(setMessage);
    setTyping(true);
    await processMessageToChatGPT(setMessage);

  }
  async function processMessageToChatGPT(chatMessages) {
    let apiMessage = chatMessages.map((messageObj) => {
      let role = "";
      if (messageObj.sender === "ChatGPT") {
        role="assistant"
      } else {
        role="user"
      }
      return {role:role, content: messageObj.message}
    })
    fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(
        apiMessage
      )
    }).then(response => response.json())
    .then(data => {
      const messageByAI = {
        message: data,
        sender: "assistant",
        direction: "incoming"
      }
      setMessages([...chatMessages, messageByAI]);
      setTyping(false);
    })
  }
  return (
    <>
    <div style={{ position: "relative", height: "500px", width:"1000px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            typingIndicator={ typing ? <TypingIndicator content="ChatGPT is typing"/> : null}>
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  )
}

export default App
