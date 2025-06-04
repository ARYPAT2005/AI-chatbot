import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Chatbot from "../pages/Chatbot";
import Home from "../pages/Home";
import WithNav from "../nav/WithNav";

function App() {
  return (
    <>
      <Routes>
          <Route element={<WithNav />}>
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/" element={<Home />}></Route>
          </Route>
      </Routes>
    </>
  )
}

export default App
