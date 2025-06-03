import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{
    message: "Hello, I am ChatGPT!",
    sender: "ChatGPT",
    direction: "incoming"
  }])
  const sendDate = () => {
    fetch('http://localhost:3000/', {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message:"Hello"
    })
  }).then(response => response.json())
    .then(data => console.log(data))
  }
  
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
    {/* <button onClick={sendDate}>HELLO</button> */}
    </>
  )
}

export default App
