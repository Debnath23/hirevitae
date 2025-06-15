// import { create } from "zustand"
// import { api } from "@/lib/axios"
// // import toast from "react-hot-toast"

// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isSigningUp: false,
//   isLoggingIn: false,
//   isLoggingOut: false,
//   isUpdatingProfile: false,
//   isCheckingAuth: false,
//   onlineUsers: [],

//   checkAuth: async () => {
//     set({ isCheckingAuth: true })
//     try {
//       console.log("Checking from authStore")
//       const response = await api.get("/auth/me")
//       set({ authUser: response.data.user, isCheckingAuth: false })
//     } catch (error) {
//       console.error("Error checking auth:", error)
//       set({ authUser: null })
//     } finally {
//       set({ isCheckingAuth: false })
//     }
//   },

//   signUp: async (userData) => {
//     set({ isSigningUp: true })
//     try {
//       const response = await api.post("/auth/signup", {
//         name: userData.fullName, // Map fullName to name
//         email: userData.email,
//         password: userData.password,
//       })
//       toast.success("Sign up successful!")
//       set({ authUser: response.data.user, isSigningUp: false })
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Sign up failed. Please try again.")
//       console.error("Error signing up:", error)
//     } finally {
//       set({ isSigningUp: false })
//     }
//   },

//   logIn: async (credentials) => {
//     set({ isLoggingIn: true })
//     try {
//       const response = await api.post("/auth/login", credentials)
//       toast.success("Logged in successfully!")
//       set({ authUser: response.data.user, isLoggingIn: false })
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed. Please check your credentials.")
//       console.error("Error logging in:", error)
//     } finally {
//       set({ isLoggingIn: false })
//     }
//   },

//   logOut: async () => {
//     set({ isLoggingOut: true })
//     try {
//       await api.post("/auth/logout")
//       toast.success("Logged out successfully!")
//       set({ authUser: null, isLoggingOut: false })
//     } catch (error) {
//       toast.error("Error logging out. Please try again.")
//       console.error("Error logging out:", error)
//     } finally {
//       set({ isLoggingOut: false })
//     }
//   },

//   updateProfile: async (formData) => {
//     set({ isUpdatingProfile: true })
//     try {
//       const response = await api.put("/auth/profile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       toast.success("Profile updated successfully!")
//       set({ authUser: response.data.user })
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update profile")
//       console.error("Error updating profile:", error)
//     } finally {
//       set({ isUpdatingProfile: false })
//     }
//   },
// }))

import { create } from "zustand"
import { api } from "@/lib/axios"
import { toast } from "sonner"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true })
    try {
      console.log("Checking from authStore")
      const response = await api.get("/auth/me")
      set({ authUser: response.data.user, isCheckingAuth: false })
    } catch (error) {
      console.error("Error checking auth:", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signUp: async (userData) => {
    set({ isSigningUp: true })
    try {
      const response = await api.post("/auth/signup", {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
      })
      toast.success("Sign up successful!")
      set({ authUser: response.data.user, isSigningUp: false })
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed. Please try again.")
      console.error("Error signing up:", error)
    } finally {
      set({ isSigningUp: false })
    }
  },

  logIn: async (credentials) => {
    set({ isLoggingIn: true })
    try {
      const response = await api.post("/auth/login", credentials)
      toast.success("Logged in successfully!")
      set({ authUser: response.data.user, isLoggingIn: false })
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.")
      console.error("Error logging in:", error)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logOut: async () => {
    set({ isLoggingOut: true })
    try {
      await api.post("/auth/logout")
      toast.success("Logged out successfully!")
      set({ authUser: null, isLoggingOut: false, onlineUsers: [] })
    } catch (error) {
      toast.error("Error logging out. Please try again.")
      console.error("Error logging out:", error)
    } finally {
      set({ isLoggingOut: false })
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true })
    try {
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Profile updated successfully!")
      set({ authUser: response.data.user })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
      console.error("Error updating profile:", error)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  // Online users management
  setOnlineUsers: (users) => {
    set({ onlineUsers: users })
  },

  addOnlineUser: (userId) => {
    const { onlineUsers } = get()
    if (!onlineUsers.includes(userId)) {
      set({ onlineUsers: [...onlineUsers, userId] })
    }
  },

  removeOnlineUser: (userId) => {
    const { onlineUsers } = get()
    set({ onlineUsers: onlineUsers.filter((id) => id !== userId) })
  },
}))
