import { create } from "zustand";

const API_URL = "http://localhost:3000/api/auth"
export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error:null,
    isAuthenticated: false,
    isCheckingAuth: true,
    message: null,
    email: null,
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
            set({isLoading: false, isAuthenticated: false, user: data.user })
            return data
        } catch (error) {
            set({ isLoading: false, error: error.message })
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
            if (!response.ok) {
                return { success: false, message: data.message || "Verification failed" };
            }
            set( {isLoading: false, isAuthenticated:true, user: data.user })
            return { success: true };
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
                    "Content-type": "application/json"
                },
                credentials: "include",
            }) 
            
            if (!response.ok) {
                // 401 is expected when not logged in
                if (response.status === 401) {
                    set({isAuthenticated: false, user: null, isCheckingAuth: false })
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json();
            console.log("Auth check response:", data)
            
            if (data.success && data.user) {
                console.log("User authenticated:", data.user)
                set({isAuthenticated: true, user: data.user, isCheckingAuth: false })
            } else {
                console.log("No user data in response")
                set({isAuthenticated: false, user: null, isCheckingAuth: false })
            }
        } catch (error) {
            console.log("Error checking auth:", error)
            set({ isCheckingAuth: false, isAuthenticated: false, user: null})
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
    },
    createFlashcards: async (words) => {
        try {
            set( {isLoading: true})
            const response = await fetch(`http://localhost:3000/create-flashcards`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({username: useAuthStore.getState().user, words})
            })
            set({isLoading: false})
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    },
    saveFlashcards: async (flashcards) => {
        try {
            console.log("Flashcards:", flashcards)
            set({isLoading: true})
            const response = await fetch(`http://localhost:3000/save-flashcards`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({flashcards})
            })
            const data = await response.json();
            set({isLoading: false})
            return data;
        } catch (error) {
            console.log(error)
        }
    },
    getFlashcards: async () => {
        try {
            const response = await fetch(`http://localhost:3000/get-flashcards`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
            })
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.log(error)
        }
    },
    updatePastDecks: async (pastDecks) => {
        try {
            const response = await fetch(`http://localhost:3000/update-past-decks`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({pastDecks})
            })
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    },
    forgotPassword: async (email) => {
        set({isLoading: true, error: null, message: null})
        set({email: email})
        try {
            const response = await fetch(`http://localhost:3000/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({email})
            })
            const data = await response.json();
            
            if (response.ok) {
                set({isLoading: false, message: data.message, error: null})
                return data;
            } else {
                set({isLoading: false, error: data.message, message: null})
                return data;
            }
        } catch (error) {
            console.log("Forgot password error:", error)
            set({isLoading: false, error: error.message, message: null})
            return { message: "Failed to process request" };
        }
    },
    verifyCode: async (code) => {
        try {
            const response = await fetch(`http://localhost:3000/verify-code`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ code, email: useAuthStore.getState().email })
            })
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
    resetPassword: async (newPassword) => {
        try {
            const response = await fetch(`http://localhost:3000/reset-password`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email: useAuthStore.getState().email, newPassword })
            })
            const data = await response.json();
            console.log("Data",data)
            // if (response.ok) {
            //     set({ isAuthenticated: true, user: data.user });
            // }
            
            return data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}))