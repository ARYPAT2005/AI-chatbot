import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
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
  return (
    <>
    <button onClick={sendDate}>HELLO</button>
    </>
  )
}

export default App
