import { create } from "zustand"
import { api } from "@/lib/axios"

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const response = await api.get("/users")
      console.log("Fetched users:", response.data)
      
      set({ users: response.data, isUsersLoading: false })
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const response = await api.get(`/messages/${userId}`)
      set({ messages: response.data, isMessagesLoading: false })
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (formData) => {
    const { selectedUser, messages } = get()
    try {
      if (!selectedUser) {
        toast.error("No user selected")
        return
      }

      const response = await api.post(`/messages/send/${selectedUser.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      set({
        messages: [...messages, response.data],
      })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  },

  addReaction: async (messageId, emoji) => {
    try {
      const response = await api.post("/reactions", {
        messageId,
        emoji: {
          id: emoji.id,
          native: emoji.native,
          name: emoji.name,
        },
      })

      // Update the message with the new reaction
      const { messages } = get()
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, reactions: [...(msg.reactions || []), response.data] } : msg,
      )
      set({ messages: updatedMessages })

      return response.data
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  },

  removeReaction: async (messageId, emojiId) => {
    try {
      await api.delete("/reactions", {
        data: { messageId, emojiId },
      })

      // Update the message by removing the reaction
      const { messages } = get()
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: (msg.reactions || []).filter((r) => r.emojiId !== emojiId),
            }
          : msg,
      )
      set({ messages: updatedMessages })
    } catch (error) {
      console.error("Error removing reaction:", error)
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}))
