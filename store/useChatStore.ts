import { create } from "zustand";
import { api } from "@/lib/axios";

interface FormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  fontSize: string;
  linkTitle: string;
  linkTarget: string;
  emoji: string;
  imageName: string;
  imageUrl: string;
  codeLanguage: string;
  codeContent: string;
}

interface ChatStore {
  messages: any[];
  users: any[];
  selectedUser: any;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  // Formatting states
  formatting: FormattingState;

  // Actions
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (formData: FormData) => Promise<void>;
  addReaction: (messageId: string, emoji: any) => Promise<any>;
  removeReaction: (messageId: string, emojiId: string) => Promise<void>;
  setSelectedUser: (user: any) => void;

  // Formatting actions
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleUnorderedList: () => void;
  toggleOrderedList: () => void;
  setFontSize: (fontSize: string) => void;
  setLinkTitle: (linkTitle: string) => void;
  setLinkTarget: (linkTarget: string) => void;
  setEmoji: (emoji: string) => void;
  setImageName: (imageName: string) => void;
  setImageUrl: (imageUrl: string) => void;
  setCodeLanguage: (codeLanguage: string) => void;
  setCodeContent: (codeContent: string) => void;
  resetFormatting: () => void;

  // Send message with formatting
  sendFormattedMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Initial formatting state
  formatting: {
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
    fontSize: "14",
    linkTitle: "",
    linkTarget: "",
    emoji: "",
    imageName: "",
    imageUrl: "",
    codeLanguage: "",
    codeContent: "",
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await api.get("/users");
      console.log("Fetched users:", response.data);

      set({ users: response.data, isUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await api.get(`/messages/${userId}`);
      set({ messages: response.data, isMessagesLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    try {
      if (!selectedUser) {
        console.error("No user selected");
        return;
      }

      const response = await api.post(
        `/messages/send/${selectedUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set({
        messages: [...messages, response.data],
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  // sendFormattedMessage: async (content) => {
  //   const { selectedUser, messages, formatting } = get();
  //   try {
  //     if (!selectedUser) {
  //       console.error("No user selected");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("content", content);
  //     formData.append("formatting", JSON.stringify(formatting));
  //     formData.append("selectedUser", JSON.stringify(selectedUser));

  //     const response = await api.post(`/api/messages/send/${selectedUser.id}`, {
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("Error sending message:", errorData.message);
  //       return;
  //     }

  //     const newMessage = await response.json();

  //     // Now we know newMessage has an id property
  //     set({
  //       messages: [...messages, newMessage],
  //     });

  //     // Reset formatting after successful send
  //     get().resetFormatting();
  //   } catch (error) {
  //     console.error("Error sending formatted message:", error);
  //   }
  // },

  sendFormattedMessage: async (content) => {
    const { selectedUser, messages, formatting } = get();
    try {
      if (!selectedUser) {
        console.error("No user selected");
        return;
      }

      const payload = {
        content,
        formatting,
        selectedUser,
      };

      const response = await api.post(
        `/messages/send/${selectedUser.id}`,
        payload
      );

      const newMessage = response.data;

      set({
        messages: [...messages, newMessage],
      });

      get().resetFormatting();
    } catch (error) {
      console.error("Error sending formatted message:", error);
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
      });

      // Update the message with the new reaction
      const { messages } = get();
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, reactions: [...(msg.reactions || []), response.data] }
          : msg
      );
      set({ messages: updatedMessages });

      return response.data;
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  },

  removeReaction: async (messageId, emojiId) => {
    try {
      await api.delete("/reactions", {
        data: { messageId, emojiId },
      });

      // Update the message by removing the reaction
      const { messages } = get();
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: (msg.reactions || []).filter(
                (r: any) => r.emojiId !== emojiId
              ),
            }
          : msg
      );
      set({ messages: updatedMessages });
    } catch (error) {
      console.error("Error removing reaction:", error);
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  // Formatting actions
  toggleBold: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        bold: !formatting.bold,
      },
    });
  },

  toggleItalic: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        italic: !formatting.italic,
      },
    });
  },

  toggleUnderline: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        underline: !formatting.underline,
      },
    });
  },

  toggleUnorderedList: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        unorderedList: !formatting.unorderedList,
        orderedList: false, // Disable ordered list when unordered is enabled
      },
    });
  },

  toggleOrderedList: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        orderedList: !formatting.orderedList,
        unorderedList: false, // Disable unordered list when ordered is enabled
      },
    });
  },

  setFontSize: (fontSize) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        fontSize,
      },
    });
  },

  setLinkTitle: (linkTitle) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        linkTitle,
      },
    });
  },

  setLinkTarget: (linkTarget) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        linkTarget,
      },
    });
  },

  setEmoji: (emoji) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        emoji,
      },
    });
  },

  setImageName: (imageName) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        imageName,
      },
    });
  },

  setImageUrl: (imageUrl) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        imageUrl,
      },
    });
  },

  setCodeLanguage: (codeLanguage) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        codeLanguage,
      },
    });
  },

  setCodeContent: (codeContent) => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        codeContent,
      },
    });
  },

  resetFormatting: () => {
    set({
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        unorderedList: false,
        orderedList: false,
        fontSize: "14",
        linkTitle: "",
        linkTarget: "",
        emoji: "",
        imageName: "",
        imageUrl: "",
        codeLanguage: "javascript",
        codeContent: "",
      },
    });
  },
}));
