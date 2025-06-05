import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Chatbot from "../pages/Chatbot";
import Flashcards from '../pages/Flashcards';
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import WithNav from "../nav/WithNav";

function App() {
  return (
    <>
      <Routes>
          <Route element={<WithNav />}>
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/" element={<Home />}></Route>
            <Route path="/flashcards" element={<Flashcards />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Route>
      </Routes>
    </>
  )
}

export default App
