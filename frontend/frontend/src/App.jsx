import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Chatbot from "../pages/Chatbot";
import Flashcards from '../pages/Flashcards';
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import WithNav from "../nav/WithNav";
import VerifyEmail from "../pages/verifyEmail";
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from '../store/authStore.js';
import { useEffect } from "react"
import { buttonVariants } from './components/ui/button';
import { Button } from '@chatscope/chat-ui-kit-react';
import ForgotPassword from '../pages/ForgotPassword';
import CodeVerification from '../pages/CodeVerification';
import ResetPassword from '../pages/ResetPassword';

// import { Navigate } from "react-router-dom"

// const ProtectedRoute = ({children}) => {
//   const {user, isAuthenticated} = useAuthStore();
//   if(!isAuthenticated || !user) {
//     return <Navigate to="/login" replace/>
//   }
//   return <>{children}</>
// }

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, logout} = useAuthStore();
  useEffect(() => {
    checkAuth()
  },[checkAuth])
 
  // const handleLogout = async () => {
  //   await logout()
  // }
  return (
    <>
      {/* {user && <Button onClick={handleLogout}>Logout</Button>} */}
      <Routes>
          <Route element={<WithNav />}>
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/" element={<Home />}></Route>
            <Route path="/flashcards" element={<Flashcards />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/verify-email" element={<VerifyEmail />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/code-verification" element={<CodeVerification />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
          </Route>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
