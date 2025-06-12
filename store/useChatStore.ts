// import { create } from "zustand";
// import { api } from "@/lib/axios";
// import { useAuthStore } from "./useAuthStore";
// import SocketManager from "@/lib/socket";

// interface FormattingState {
//   bold: boolean;
//   italic: boolean;
//   underline: boolean;
//   unorderedList: boolean;
//   orderedList: boolean;
//   fontSize: string;
//   linkTitle: string;
//   linkTarget: string;
//   emoji: string;
//   imageName: string;
//   imageUrl: string;
//   codeLanguage: string;
//   codeContent: string;
// }

// interface Message {
//   id: string;
//   _id?: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   formatting?: FormattingState;
//   reactions?: any[];
//   createdAt: string;
//   image?: string;
//   read?: boolean;
// }

// interface User {
//   _id: string;
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   isOnline?: boolean;
// }

// interface ChatStore {
//   messages: Message[];
//   users: User[];
//   selectedUser: User | null;
//   isUsersLoading: boolean;
//   isMessagesLoading: boolean;
//   isTyping: boolean;
//   formatting: FormattingState;

//   // Actions
//   getUsers: () => Promise<void>;
//   getMessages: (userId: string) => Promise<void>;
//   sendMessage: (formData: FormData) => Promise<void>;
//   sendFormattedMessage: (content: string) => Promise<void>;
//   addReaction: (messageId: string, emoji: any) => Promise<any>;
//   removeReaction: (messageId: string, emojiId: string) => Promise<void>;
//   setSelectedUser: (user: User) => void;
//   subscribeToMessages: () => void;
//   unsubscribeFromMessages: () => void;
//   setTypingStatus: (isTyping: boolean) => void;
//   markMessageAsRead: (messageId: string) => void;

//   // Formatting actions
//   toggleBold: () => void;
//   toggleItalic: () => void;
//   toggleUnderline: () => void;
//   toggleUnorderedList: () => void;
//   toggleOrderedList: () => void;
//   setFontSize: (fontSize: string) => void;
//   setLinkTitle: (linkTitle: string) => void;
//   setLinkTarget: (linkTarget: string) => void;
//   setEmoji: (emoji: string) => void;
//   setImageName: (imageName: string) => void;
//   setImageUrl: (imageUrl: string) => void;
//   setCodeLanguage: (codeLanguage: string) => void;
//   setCodeContent: (codeContent: string) => void;
//   resetFormatting: () => void;
// }

// export const useChatStore = create<ChatStore>((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isTyping: false,

//   formatting: {
//     bold: false,
//     italic: false,
//     underline: false,
//     unorderedList: false,
//     orderedList: false,
//     fontSize: "14",
//     linkTitle: "",
//     linkTarget: "",
//     emoji: "",
//     imageName: "",
//     imageUrl: "",
//     codeLanguage: "javascript",
//     codeContent: "",
//   },

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const response = await api.get("/users");
//       set({ users: response.data, isUsersLoading: false });
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId: string) => {
//     set({ isMessagesLoading: true });
//     try {
//       const response = await api.get(`/messages/${userId}`);
//       set({ messages: response.data, isMessagesLoading: false });
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (formData: FormData) => {
//     const { selectedUser, messages } = get();
//     try {
//       if (!selectedUser) {
//         console.error("No user selected");
//         return;
//       }

//       const response = await api.post(
//         `/messages/send/${selectedUser.id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       const newMessage = response.data;

//       // Add message to local state
//       set({
//         messages: [...messages, newMessage],
//       });

//       // Send message via socket
//       const socketManager = SocketManager.getInstance();
//       socketManager.sendMessage(newMessage);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   },

//   sendFormattedMessage: async (content: string) => {
//     const { selectedUser, messages, formatting } = get();
//     const authUser = useAuthStore.getState().authUser;

//     try {
//       if (!selectedUser) {
//         console.error("No user selected");
//         return;
//       }

//       const payload = {
//         content,
//         formatting,
//         receiverId: Number(selectedUser.id),
//       };

//       const response = await api.post(
//         `/messages/send/${selectedUser.id}`,
//         payload
//       );
//       const newMessage = response.data;

//       // Create a complete message object with all required fields
//       const completeMessage: Message = {
//         ...newMessage,
//         senderId: authUser.id,
//         receiverId: selectedUser.id,
//         sender: authUser,
//         receiver: selectedUser,
//         createdAt: new Date().toISOString(),
//       };

//       // Add message to local state
//       set({
//         messages: [...messages, completeMessage],
//       });

//       // Send message via socket
//       const socketManager = SocketManager.getInstance();
//       socketManager.sendMessage(completeMessage);

//       get().resetFormatting();
//     } catch (error) {
//       console.error("Error sending formatted message:", error);
//     }
//   },

//   addReaction: async (messageId: string, emoji: any) => {
//     try {
//       const response = await api.post("/reactions", {
//         messageId,
//         emoji: {
//           id: emoji.id,
//           native: emoji.native,
//           name: emoji.name,
//         },
//       });

//       const { messages } = get();
//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? { ...msg, reactions: [...(msg.reactions || []), response.data] }
//           : msg
//       );
//       set({ messages: updatedMessages });

//       return response.data;
//     } catch (error) {
//       console.error("Error adding reaction:", error);
//     }
//   },

//   removeReaction: async (messageId: string, emojiId: string) => {
//     try {
//       await api.delete("/reactions", {
//         data: { messageId, emojiId },
//       });

//       const { messages } = get();
//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? {
//               ...msg,
//               reactions: (msg.reactions || []).filter(
//                 (r: any) => r.emojiId !== emojiId
//               ),
//             }
//           : msg
//       );
//       set({ messages: updatedMessages });
//     } catch (error) {
//       console.error("Error removing reaction:", error);
//     }
//   },

//   setSelectedUser: (user: User) => {
//     set({ selectedUser: user });
//   },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socketManager = SocketManager.getInstance();
//     if (!socketManager.isConnected()) {
//       console.error("Cannot subscribe to messages: Socket not connected");
//       return;
//     }

//     // Use the helper methods from SocketManager
//     socketManager.onMessage((newMessage: Message) => {
//       console.log("New message received:", newMessage);

//       const isMessageFromSelectedUser =
//         newMessage.senderId === selectedUser._id ||
//         newMessage.senderId === selectedUser.id;

//       if (!isMessageFromSelectedUser) return;

//       set({
//         messages: [...get().messages, newMessage],
//       });

//       // Mark message as read if it's from the selected user
//       if (
//         newMessage.senderId === selectedUser._id ||
//         newMessage.senderId === selectedUser.id
//       ) {
//         socketManager.markMessageAsRead({
//           messageId: newMessage.id || newMessage._id || "",
//           senderId: newMessage.senderId,
//         });
//       }
//     });

//     // Listen for typing status
//     socketManager.onTyping(
//       ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
//         const isFromSelectedUser =
//           senderId === selectedUser._id || senderId === selectedUser.id;
//         if (isFromSelectedUser) {
//           set({ isTyping });
//         }
//       }
//     );

//     // Listen for read receipts
//     socketManager.onMessageRead(
//       ({ messageId, read }: { messageId: string; read: boolean }) => {
//         const { messages } = get();
//         const updatedMessages = messages.map((msg) =>
//           msg.id === messageId || msg._id === messageId ? { ...msg, read } : msg
//         );
//         set({ messages: updatedMessages });
//       }
//     );
//   },

//   unsubscribeFromMessages: () => {
//     const socketManager = SocketManager.getInstance();

//     // Use the helper methods to remove listeners
//     socketManager.offMessage();
//     socketManager.offTyping();
//     socketManager.offMessageRead();
//   },

//   setTypingStatus: (isTyping: boolean) => {
//     const { selectedUser } = get();
//     const authUser = useAuthStore.getState().authUser;

//     if (!selectedUser || !authUser) return;

//     const socketManager = SocketManager.getInstance();
//     socketManager.setTypingStatus({
//       senderId: authUser._id,
//       receiverId: selectedUser._id,
//       isTyping,
//     });
//   },

//   markMessageAsRead: (messageId: string) => {
//     const { messages } = get();
//     const message = messages.find(
//       (msg) => msg.id === messageId || msg._id === messageId
//     );

//     if (!message) return;

//     const socketManager = SocketManager.getInstance();
//     socketManager.markMessageAsRead({
//       messageId,
//       senderId: message.senderId,
//     });

//     // Update local state
//     const updatedMessages = messages.map((msg) =>
//       msg.id === messageId || msg._id === messageId
//         ? { ...msg, read: true }
//         : msg
//     );
//     set({ messages: updatedMessages });
//   },

//   // Formatting actions
//   toggleBold: () => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, bold: !formatting.bold },
//     });
//   },

//   toggleItalic: () => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, italic: !formatting.italic },
//     });
//   },

//   toggleUnderline: () => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, underline: !formatting.underline },
//     });
//   },

//   toggleUnorderedList: () => {
//     const { formatting } = get();
//     set({
//       formatting: {
//         ...formatting,
//         unorderedList: !formatting.unorderedList,
//         orderedList: false,
//       },
//     });
//   },

//   toggleOrderedList: () => {
//     const { formatting } = get();
//     set({
//       formatting: {
//         ...formatting,
//         orderedList: !formatting.orderedList,
//         unorderedList: false,
//       },
//     });
//   },

//   setFontSize: (fontSize: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, fontSize },
//     });
//   },

//   setLinkTitle: (linkTitle: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, linkTitle },
//     });
//   },

//   setLinkTarget: (linkTarget: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, linkTarget },
//     });
//   },

//   setEmoji: (emoji: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, emoji },
//     });
//   },

//   setImageUrl: (imageUrl: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, imageUrl },
//     });
//   },

//   setImageName: (imageName: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, imageName },
//     });
//   },

//   setCodeLanguage: (codeLanguage: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, codeLanguage },
//     });
//   },

//   setCodeContent: (codeContent: string) => {
//     const { formatting } = get();
//     set({
//       formatting: { ...formatting, codeContent },
//     });
//   },

//   resetFormatting: () => {
//     set({
//       formatting: {
//         bold: false,
//         italic: false,
//         underline: false,
//         unorderedList: false,
//         orderedList: false,
//         fontSize: "14",
//         linkTitle: "",
//         linkTarget: "",
//         emoji: "",
//         imageName: "",
//         imageUrl: "",
//         codeLanguage: "javascript",
//         codeContent: "",
//       },
//     });
//   },
// }));

import { create } from "zustand";
import { api } from "@/lib/axios";
import { useAuthStore } from "./useAuthStore";
import SocketManager from "@/lib/socket";

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

interface Message {
  id: string;
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  formatting?: FormattingState;
  reactions?: any[];
  createdAt: string;
  image?: string;
  read?: boolean;
}

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isTyping: boolean;
  formatting: FormattingState;
  socketConnected: boolean;
  socketConnecting: boolean;
  socketError: string | null;

  // Actions
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (formData: FormData) => Promise<void>;
  sendFormattedMessage: (content: string) => Promise<void>;
  addReaction: (messageId: string, emoji: any) => Promise<any>;
  removeReaction: (messageId: string, emojiId: string) => Promise<void>;
  setSelectedUser: (user: User) => void;
  initializeSocket: (userId: string) => Promise<void>;
  subscribeToMessages: () => Promise<void>;
  unsubscribeFromMessages: () => void;
  setTypingStatus: (isTyping: boolean, authUser: User) => void;
  markMessageAsRead: (messageId: string) => void;
  retrySocketConnection: (userId: string) => Promise<void>;

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
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  socketConnected: false,
  socketConnecting: false,
  socketError: null,

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

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await api.get("/users");
      set({ users: response.data, isUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const response = await api.get(`/messages/${userId}`);
      set({ messages: response.data, isMessagesLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isMessagesLoading: false });
    }
  },

  initializeSocket: async (userId: string) => {
    if (!userId) {
      console.error("Cannot initialize socket: No userId provided");
      return;
    }

    const socketManager = SocketManager.getInstance();
    const status = socketManager.getConnectionStatus();

    if (status.connected) {
      set({
        socketConnected: true,
        socketConnecting: false,
        socketError: null,
      });
      return;
    }

    if (status.connecting) {
      console.log("Socket already connecting, waiting...");
      return;
    }

    set({ socketConnecting: true, socketError: null });

    try {
      await socketManager.connect();

      set({
        socketConnected: true,
        socketConnecting: false,
        socketError: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown socket error";

      set({
        socketConnected: false,
        socketConnecting: false,
        socketError: errorMessage,
      });
    }
  },

  retrySocketConnection: async (userId: string) => {
    console.log("🔄 Retrying socket connection for user:", userId);
    const socketManager = SocketManager.getInstance();
    socketManager.resetConnectionState();
    await get().initializeSocket(userId);
  },

  sendMessage: async (formData: FormData) => {
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

      const newMessage = response.data;

      // Add message to local state
      set({
        messages: [...messages, newMessage],
      });

      // Try to send via socket (non-blocking)
      const socketManager = SocketManager.getInstance();
      socketManager.sendMessage(newMessage).catch((error) => {
        console.warn("Failed to send message via socket:", error);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  sendFormattedMessage: async (content: string) => {
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

      const completeMessage: Message = {
        ...newMessage,
        senderId: newMessage.sender.id,
        receiverId: selectedUser.id || newMessage.receiver.id,
        sender: newMessage.sender,
        receiver: selectedUser || newMessage.receiver,
        createdAt: new Date().toISOString(),
      };

      set({
        messages: [...messages, completeMessage],
      });

      // Try to send via socket (non-blocking)
      const socketManager = SocketManager.getInstance();
      socketManager.sendMessage(completeMessage).catch((error) => {
        console.warn("Failed to send message via socket:", error);
      });

      get().resetFormatting();
    } catch (error) {
      console.error("Error sending formatted message:", error);
    }
  },

  addReaction: async (messageId: string, emoji: any) => {
    try {
      const response = await api.post("/reactions", {
        messageId,
        emoji: {
          id: emoji.id,
          native: emoji.native,
          name: emoji.name,
        },
      });

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

  removeReaction: async (messageId: string, emojiId: string) => {
    try {
      await api.delete("/reactions", {
        data: { messageId, emojiId },
      });

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

  setSelectedUser: (user: User) => {
    set({ selectedUser: user });
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.warn("Cannot subscribe to messages: No user selected");
      return;
    }

    console.log("🔔 Subscribing to socket events for user:", selectedUser.id);

    const socketManager = SocketManager.getInstance();

    // Wait for connection first
    const isConnected = await socketManager.waitForConnection();

    if (!isConnected) {
      console.warn("⚠️ Cannot subscribe - socket not connected");
      return;
    }
    try {
      // Try to subscribe - this will gracefully fail if socket is not available
      const messageSubscribed = await socketManager.onMessage(
        (newMessage: Message) => {
          console.log("📨 New message received:", newMessage);

          const currentState = get();
          const isMessageFromSelectedUser =
            newMessage.senderId === currentState.selectedUser?._id ||
            newMessage.senderId === currentState.selectedUser?.id;

          if (!isMessageFromSelectedUser) return;

          set({
            messages: [...currentState.messages, newMessage],
          });
        }
      );

      const typingSubscribed = await socketManager.onTyping(
        ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
          const currentState = get();
          const isFromSelectedUser =
            senderId === currentState.selectedUser?._id ||
            senderId === currentState.selectedUser?.id;
          if (isFromSelectedUser) {
            set({ isTyping });
          }
        }
      );

      const readSubscribed = await socketManager.onMessageRead(
        ({ messageId, read }: { messageId: string; read: boolean }) => {
          const { messages } = get();
          const updatedMessages = messages.map((msg) =>
            msg.id === messageId || msg._id === messageId
              ? { ...msg, read }
              : msg
          );
          set({ messages: updatedMessages });
        }
      );

      console.log("✅ Socket event subscriptions completed:", {
        messages: messageSubscribed,
        typing: typingSubscribed,
        read: readSubscribed,
      });

      console.log("✅ Subscriptions completed successfully");
    } catch (error) {
      console.warn(
        "Socket subscription failed, continuing without real-time features:",
        error
      );
    }
  },

  unsubscribeFromMessages: () => {
    console.log("🔕 Unsubscribing from socket events");
    const socketManager = SocketManager.getInstance();
    socketManager.offMessage();
    socketManager.offTyping();
    socketManager.offMessageRead();
  },

  setTypingStatus: (isTyping: boolean, authUser: User) => {
    const { selectedUser } = get();

    if (!selectedUser || !authUser) {
      console.warn("Cannot set typing status: Missing user data");
      return;
    }

    const socketManager = SocketManager.getInstance();
    socketManager.setTypingStatus({
      senderId: authUser._id || authUser.id || "",
      receiverId: selectedUser._id || selectedUser.id || "",
      isTyping,
    });
  },

  markMessageAsRead: (messageId: string) => {
    const { messages } = get();
    const message = messages.find(
      (msg) => msg.id === messageId || msg._id === messageId
    );

    if (!message) return;

    const socketManager = SocketManager.getInstance();
    socketManager.markMessageAsRead({
      messageId,
      senderId: message.senderId,
    });

    // Update local state
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId || msg._id === messageId
        ? { ...msg, read: true }
        : msg
    );
    set({ messages: updatedMessages });
  },

  // Formatting actions (unchanged)
  toggleBold: () => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, bold: !formatting.bold },
    });
  },

  toggleItalic: () => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, italic: !formatting.italic },
    });
  },

  toggleUnderline: () => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, underline: !formatting.underline },
    });
  },

  toggleUnorderedList: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        unorderedList: !formatting.unorderedList,
        orderedList: false,
      },
    });
  },

  toggleOrderedList: () => {
    const { formatting } = get();
    set({
      formatting: {
        ...formatting,
        orderedList: !formatting.orderedList,
        unorderedList: false,
      },
    });
  },

  setFontSize: (fontSize: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, fontSize },
    });
  },

  setLinkTitle: (linkTitle: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, linkTitle },
    });
  },

  setLinkTarget: (linkTarget: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, linkTarget },
    });
  },

  setEmoji: (emoji: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, emoji },
    });
  },

  setImageUrl: (imageUrl: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, imageUrl },
    });
  },

  setImageName: (imageName: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, imageName },
    });
  },

  setCodeLanguage: (codeLanguage: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, codeLanguage },
    });
  },

  setCodeContent: (codeContent: string) => {
    const { formatting } = get();
    set({
      formatting: { ...formatting, codeContent },
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
