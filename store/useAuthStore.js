import { create } from "zustand";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: {},
  allTypingUsers: {},
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await api.get("/auth/me");
      set({ authUser: response.data.user, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await api.post("/auth/signup", {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
      });
      toast.success("Sign up successful!");
      set({ authUser: response.data.user, isSigningUp: false });
      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Sign up failed. Please try again."
      );
      console.error("Error signing up:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logIn: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await api.post("/auth/login", credentials);
      toast.success("Logged in successfully!");
      set({ authUser: response.data.user, isLoggingIn: false });
      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      console.error("Error logging in:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logOut: async () => {
    set({ isLoggingOut: true });
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully!");
      set({ authUser: null, isLoggingOut: false, onlineUsers: [] });
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out. Please try again.");
      console.error("Error logging out:", error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      set({ authUser: response.data.user });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || (socket && socket.connected)) return;

    if (socket) {
      socket.off();
      socket.disconnect();
    }

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    newSocket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    newSocket.on("newMessage", (message) => {
      const { addMessage } =
        require("@/store/useChatStore").useChatStore.getState();
      const { authUser } = get();

      if (
        message.receiverId === authUser.id ||
        message.senderId === authUser.id
      ) {
        addMessage(message);
      }
    });

    newSocket.on("getOnlineUsers", (users) => {
      const onlineUsersMap = users.reduce((acc, user) => {
        acc[user.userId] = {
          isOnline: user.isOnline,
          isTyping: user.isTyping || false,
          lastSeen: user.isOnline ? "online" : new Date().toISOString(),
        };
        return acc;
      }, {});
      set({ onlineUsers: onlineUsersMap });
    });

    newSocket.on("userTyping", ({ senderId, isTyping }) => {
      const allTypingUsers = get().allTypingUsers;
      set({
        allTypingUsers: {
          ...allTypingUsers,
          [senderId]: isTyping,
        },
      });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.off();
      socket.disconnect();
    }
  },

  isUserOnline: (userId) => {
    return get().onlineUsers[userId]?.isOnline || false;
  },

  isUserRecentlyOnline: (userId) => {
    const user = get().onlineUsers[userId];
    if (!user) return false;
    if (user.isOnline) return true;

    const lastSeen = new Date(user.lastSeen);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastSeen > fiveMinutesAgo;
  },

  isUserTyping: (userId) => {
    return (
      get().allTypingUsers[userId] ||
      get().onlineUsers[userId]?.isTyping ||
      false
    );
  },
}));
