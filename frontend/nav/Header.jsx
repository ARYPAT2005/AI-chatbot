import { BsFillMortarboardFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react'
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "@chatscope/chat-ui-kit-react";
import { useNavigate } from "react-router-dom";
const Header = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const location = useLocation();
    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();
    const closeMenu = () => setOpen(false);
    const handleLogout = async () => {
        await logout();
        navigate("/");
    }
    return (
        <>
            <nav className="flex items-center justify-between h-16 border-b border-gray-300 px-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex flex-row gap-2 items-center">
                        <BsFillMortarboardFill className="w-9 h-9" />
                        <h1 className="font-roboto text-2xl font-bold">Pharma</h1>
                    </Link>
                    <div className="hidden sm:flex gap-4">
                        <Link to="/chatbot" className={`${location.pathname === "/chatbot" ? "font-bold" : "font-thin"}`}>
                            <h2>Interactive Q&A</h2>
                        </Link>
                        <Link to="/flashcards" className={`${location.pathname === "/flashcards" ? "font-bold" : "font-thin"}`}>
                            <h2>Create Flashcards</h2>
                        </Link>
                    </div>
                </div>
                <div className="hidden sm:flex gap-4 items-center">
                    {!isAuthenticated && (
                        <Link to="/register" className={`${location.pathname === "/register" ? "font-bold" : "font-thin"}`}>
                            <h2>Register</h2>
                        </Link>
                    )}
                    {!isAuthenticated && (
                        <Link to="/login" className={`${location.pathname === "/login" ? "font-bold" : "font-thin"}`}>
                            <h2>Login</h2>
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Button className="text-white bg-emerald-600 hover:bg-emerald-700" onClick={handleLogout}>Logout</Button>
                    )}
                    
                </div>

                
                <div className="sm:hidden">
                    <Hamburger toggled={isOpen} toggle={setOpen} />
                </div>
            </nav>

            
            {isOpen && (
                <div className="sm:hidden bg-white shadow-md px-4 py-2 space-y-2 justify-center text-center">
                    <Link to="/chatbot" onClick={closeMenu} className={`block text-lg ${location.pathname === "/chatbot" ? "font-bold" : "font-normal"}`}>
                        Interactive Q&A
                    </Link>
                    <Link to="/flashcards" onClick={closeMenu} className={`block text-lg ${location.pathname === "/flashcards" ? "font-bold" : "font-normal"}`}>
                        Create Flashcards
                    </Link>
                    {!isAuthenticated && (
                        <Link to="/register" className={`${location.pathname === "/register" ? "font-bold" : "font-thin"}`}>
                            <h2>Register</h2>
                        </Link>
                    )}
                    {!isAuthenticated && (
                        <Link to="/login" className={`${location.pathname === "/login" ? "font-bold" : "font-thin"}`}>
                            <h2>Login</h2>
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Button className="text-white bg-emerald-600 hover:bg-emerald-700" onClick={handleLogout}>Logout</Button>
                    )}
                </div>
            )}
        </>
    );
}

export default Header;
