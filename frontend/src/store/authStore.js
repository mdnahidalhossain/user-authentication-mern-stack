import axios from 'axios'
import { create } from 'zustand'

const API_URL = "http://localhost:5000/api/auth"

axios.defaults.withCredentials = true

export const userAuthStore = create((set) => (
    {
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: true,

        signup: async (email, password, name) => {
            set({ isLoading: true, error: null })

            try {
                const response = await axios.post(`${API_URL}/signup`, { email, password, name })
                set({ user: response.data.newUser, isAuthenticated: true, isLoading: false })
            } catch (error) {
                set({ error: error.response?.data?.message || error.message || "Error signing up!", isLoading: false })
                throw error
            }
        },

        // this "(verificationCode)" should match the 'const verificationCode" used in userAuthController |
        //                         v
        verifyEmail: async (verificationCode) => {

            set({ isLoading: true, error: null })

            try {
                const response = await axios.post(`${API_URL}/verify-email`, { verificationCode })
                set({ user: response.data.user, isAuthenticated: true, isLoading: false })
                return response.data
            } catch (error) {
                set({ error: error?.response?.data?.message || "Error verifying email!", isLoading: false })
                throw error
            }
        },

        //fetching/getting the authenticated/verified user data
        checkAuth: async () => {
            set({ isCheckingAuth: true, error: null })

            try {
                const response = await axios.get(`${API_URL}/check-user-auth`)
                set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false })
            } catch (error) {
                set({ error: error, isCheckingAuth: false, isAuthenticated: false })
            }
        },

        login: async (email, password) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(`${API_URL}/login`, { email, password });
                set({
                    isAuthenticated: true,
                    user: response.data.user,
                    error: null,
                    isLoading: false,
                });
            } catch (error) {
                set({ error: error.response?.data?.message || error.message || "Error logging in", isLoading: false });
                throw error;
            }
        },

        logout: async () => {
            set({ isLoading: true, error: null });

            try {
                await axios.post(`${API_URL}/logout`);
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                    isLoading: false,
                });
            } catch (error) {
                set({ error: "Error logging out", isLoading: false });
                throw error;
            }
        },

        forgotPassword: async (email) => {
            set({ isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_URL}/forgot-password`, {email});
                set({
                    message: response.data.message,
                    isLoading: false,
                });
            } catch (error) {
                set({ error: error.response.data.message || "Error sending reset password email!", isLoading: false });
                throw error;
            }
        }
    }
))