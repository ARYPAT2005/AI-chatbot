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
    }
}))