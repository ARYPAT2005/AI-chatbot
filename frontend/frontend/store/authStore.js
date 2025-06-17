import { create } from "zustand";

const API_URL = "http://localhost:3000/api/auth"
export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error:null,
    isAuthenticated: false,
    isCheckingAuth: true,
    signup: async (email, password, name) => {
        set( { isLoading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({email, password, name})
            })
            const data = await response.json();
            set({isLoading: false, isAuthenticated: true, user: data.user })
            console.log(data);
        } catch (error) {
            set({ isLoading: false, error: error.message })
            console.log(error);
        }
    },
    verifyEmail: async (code) => {
        try {
            const response = await fetch(`${API_URL}/verify-email`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || "Verification failed" };
            }
            set({ isLoading: false, isAuthenticated: true, user: data.user });
            return { success: true };
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.log(error);
            return { success: false };
        }
    },
    login: async(email, password) => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/login`, {
                method:"POST",
                headers: {
                    "Content-type" : "application/json"
                },
                credentials: "include",
                body: JSON.stringify({email, password})
            }) 
            const data = await response.json();
            set( {isLoading: false, isAuthenticated:true, user: data.user })
        } catch (error) {
            set({ isLoading: false, error: error.message})
            console.log(error)
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null})
        try {
            const response = await fetch(`${API_URL}/check-auth`, {
                method:"GET",
                headers: {
                    "Content-type" : "application/json"
                },
                credentials: "include",
            }) 
            const data = await response.json();
            if (data.user) {
                set({isAuthenticated: true, user: data.user, isCheckingAuth: false })
            } else {
                set({isAuthenticated: false, user: null, isCheckingAuth: false })
            }
            set( {isCheckingAuth: false, isAuthenticated:true, user: data.user })
        } catch (error) {
            set( {isCheckingAuth: false, isAuthenticated:false, user: null})
            console.log(error)
        }
    },
    logout: async () => {
        try {
            await fetch(`${API_URL}/logout`,{
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
            })
            set({ isAuthenticated: false, user: null });
        } catch (error) {
            console.log(error)
        }
    }
}))