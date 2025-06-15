// import { create } from "zustand";
// import { api } from "@/lib/axios";
// import SocketManager from "@/lib/socket";
// import { toast } from "sonner";

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
//   text?: string;
//   formatting?: FormattingState;
//   reactions?: any[];
//   createdAt: string;
//   image?: string;
//   read?: boolean;
//   seen?: number
//   sender?: {
//     id: string | number
//     name: string
//     email: string
//     avatar?: string
//   }
//   receiver?: {
//     id: string | number
//     name: string
//     email: string
//     avatar?: string
//   }
//   // Reply-related fields
//   replyToId?: string | number | null
//   replyToMessage?: Message | null
//   quote?: {
//     text: string
//     avatar: string
//     parts: string
//   }
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
//   onlineUsers: User[] | [],
//   typingUsers: User[] | [],
//   isUsersLoading: boolean;
//   isMessagesLoading: boolean;
//   isTyping: boolean;
//   formatting: FormattingState;
//   socketConnected: boolean;
//   socketConnecting: boolean;
//   socketError: string | null;
//   replyToMessage: Message | null;
//   isMessageSending: boolean;

//   // Actions
//   getUsers: () => Promise<void>;
//   getMessages: (userId: string) => Promise<void>;
//   sendMessage: (formData: FormData) => Promise<void>;
//   sendFormattedMessage: (content: string, replyToMessage?: Message | null) => Promise<void>;
//   addReaction: (messageId: string, emoji: any) => Promise<any>;
//   removeReaction: (messageId: string, emojiId: string) => Promise<void>;
//   setSelectedUser: (user: User) => void;
//   initializeSocket: (userId: string) => Promise<void>;
//   subscribeToMessages: () => Promise<void>;
//   unsubscribeFromMessages: () => void;
//   setTypingStatus: (isTyping: boolean, authUser: User) => void;
//   markMessageAsRead: (messageId: string) => void;
//   retrySocketConnection: (userId: string) => Promise<void>;

//   // Reply functionality
//   setReplyToMessage: (message: Message | null) => void
//   clearReplyToMessage: () => void

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
//   onlineUsers: [],
//   typingUsers: [],
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isTyping: false,
//   socketConnected: false,
//   socketConnecting: false,
//   socketError: null,
//   replyToMessage: null,
//   isMessageSending: false,

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
//     codeLanguage: "",
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

//   initializeSocket: async (userId: string) => {
//     if (!userId) {
//       console.error("Cannot initialize socket: No userId provided");
//       return;
//     }

//     const socketManager = SocketManager.getInstance();
//     const status = socketManager.getConnectionStatus();

//     if (status.connected) {
//       set({
//         socketConnected: true,
//         socketConnecting: false,
//         socketError: null,
//       });
//       return;
//     }

//     if (status.connecting) {
//       console.log("Socket already connecting, waiting...");
//       return;
//     }

//     set({ socketConnecting: true, socketError: null });

//     try {
//       await socketManager.connect();

//       set({
//         socketConnected: true,
//         socketConnecting: false,
//         socketError: null,
//       });
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown socket error";

//       set({
//         socketConnected: false,
//         socketConnecting: false,
//         socketError: errorMessage,
//       });
//     }
//   },

//   retrySocketConnection: async (userId: string) => {
//     console.log("🔄 Retrying socket connection for user:", userId);
//     const socketManager = SocketManager.getInstance();
//     socketManager.resetConnectionState();
//     await get().initializeSocket(userId);
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

//       // Try to send via socket (non-blocking)
//       const socketManager = SocketManager.getInstance();
//       socketManager.sendMessage(newMessage).catch((error) => {
//         console.warn("Failed to send message via socket:", error);
//       });
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   },

//   // sendFormattedMessage: async (content: string) => {
//   //   const { selectedUser, messages, formatting } = get();

//   //   try {
//   //     if (!selectedUser) {
//   //       console.error("No user selected");
//   //       return;
//   //     }

//   //     const payload = {
//   //       content,
//   //       formatting,
//   //       selectedUser,
//   //     };

//   //     const response = await api.post(
//   //       `/messages/send/${selectedUser.id}`,
//   //       payload
//   //     );
//   //     const newMessage = response.data;

//   //     const completeMessage: Message = {
//   //       ...newMessage,
//   //       senderId: newMessage.sender.id,
//   //       receiverId: selectedUser.id || newMessage.receiver.id,
//   //       sender: newMessage.sender,
//   //       receiver: selectedUser || newMessage.receiver,
//   //       createdAt: new Date().toISOString(),
//   //     };

//   //     set({
//   //       messages: [...messages, completeMessage],
//   //     });

//   //     // Try to send via socket (non-blocking)
//   //     const socketManager = SocketManager.getInstance();
//   //     socketManager.sendMessage(completeMessage).catch((error) => {
//   //       console.warn("Failed to send message via socket:", error);
//   //     });

//   //     get().resetFormatting();
//   //   } catch (error) {
//   //     console.error("Error sending formatted message:", error);
//   //   }
//   // },

//   // addReaction: async (messageId: string, emoji: any) => {
//   //   try {
//   //     const response = await api.post("/reactions", {
//   //       messageId,
//   //       emoji: {
//   //         id: emoji.id,
//   //         native: emoji.native,
//   //         name: emoji.name,
//   //       },
//   //     });

//   //     const { messages } = get();
//   //     const updatedMessages = messages.map((msg) =>
//   //       msg.id === messageId
//   //         ? { ...msg, reactions: [...(msg.reactions || []), response.data] }
//   //         : msg
//   //     );
//   //     set({ messages: updatedMessages });

//   //     return response.data;
//   //   } catch (error) {
//   //     console.error("Error adding reaction:", error);
//   //   }
//   // },

//   // removeReaction: async (messageId: string, emojiId: string) => {
//   //   try {
//   //     await api.delete("/reactions", {
//   //       data: { messageId, emojiId },
//   //     });

//   //     const { messages } = get();
//   //     const updatedMessages = messages.map((msg) =>
//   //       msg.id === messageId
//   //         ? {
//   //             ...msg,
//   //             reactions: (msg.reactions || []).filter(
//   //               (r: any) => r.emojiId !== emojiId
//   //             ),
//   //           }
//   //         : msg
//   //     );
//   //     set({ messages: updatedMessages });
//   //   } catch (error) {
//   //     console.error("Error removing reaction:", error);
//   //   }
//   // },

//   // setSelectedUser: (user: User) => {
//   //   set({ selectedUser: user });
//   // },

//   sendFormattedMessage: async (content: string, replyToMessage: Message | null = null) => {
//     const { selectedUser, messages, formatting } = get()
//     const replyToMessageState = replyToMessage || get().replyToMessage

//     set({ isMessageSending: true });
//     try {
//       if (!selectedUser) {
//         console.error("No user selected")
//         return
//       }

//       // Prepare payload with reply information if available
//       const payload = {
//         content,
//         formatting,
//         selectedUser,
//         replyToId: replyToMessageState?.id || null,
//         replyToSenderId: replyToMessageState?.senderId || null,
//         replyToContent: replyToMessageState?.text || replyToMessageState?.content || null,
//       }

//       const response = await api.post(`/messages/send/${selectedUser.id}`, payload)
//       const newMessage = response.data

//       // Create a complete message object with reply information
//       const completeMessage: Message = {
//         ...newMessage,
//         senderId: newMessage.sender?.id || newMessage.senderId,
//         receiverId: selectedUser.id || newMessage.receiver?.id || newMessage.receiverId,
//         sender: newMessage.sender,
//         receiver: selectedUser || newMessage.receiver,
//         createdAt: newMessage.createdAt || new Date().toISOString(),
//         replyToId: replyToMessageState?.id || null,
//         replyToMessage: replyToMessageState,
//         // Add quote information for UI display
//         quote: replyToMessageState
//           ? {
//               text: replyToMessageState.text || replyToMessageState.content || "",
//               avatar: replyToMessageState.sender?.avatar || "/placeholder.svg",
//               parts: replyToMessageState.sender?.name || "User",
//             }
//           : undefined,
//       }

//       set({
//         messages: [...messages, completeMessage],
//         replyToMessage: null, // Clear reply state after sending
//       })

//       // Try to send via socket (non-blocking)
//       const socketManager = SocketManager.getInstance()
//       socketManager.sendMessage(completeMessage).catch((error) => {
//         console.warn("Failed to send message via socket:", error)
//       })

//       get().resetFormatting()
//     } catch (error) {
//       toast.error("Failed to send message!")
//     } finally {
//       set({ isMessageSending: false });
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
//       })

//       const { messages } = get()
//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId ? { ...msg, reactions: [...(msg.reactions || []), response.data] } : msg,
//       )
//       set({ messages: updatedMessages })

//       return response.data
//     } catch (error) {
//       console.error("Error adding reaction:", error)
//     }
//   },

//   removeReaction: async (messageId: string, emojiId: string) => {
//     try {
//       await api.delete("/reactions", {
//         data: { messageId, emojiId },
//       })

//       const { messages } = get()
//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? {
//               ...msg,
//               reactions: (msg.reactions || []).filter((r: any) => r.emojiId !== emojiId),
//             }
//           : msg,
//       )
//       set({ messages: updatedMessages })
//     } catch (error) {
//       console.error("Error removing reaction:", error)
//     }
//   },

//   setSelectedUser: (user: User) => {
//     set({ selectedUser: user })
//   },

//   // Reply functionality methods
//   setReplyToMessage: (message: Message | null) => {
//     set({ replyToMessage: message })
//   },

//   clearReplyToMessage: () => {
//     set({ replyToMessage: null })
//   },

//   subscribeToMessages: async () => {
//     const { selectedUser } = get();
//     if (!selectedUser) {
//       console.warn("Cannot subscribe to messages: No user selected");
//       return;
//     }

//     console.log("🔔 Subscribing to socket events for user:", selectedUser.id);

//     const socketManager = SocketManager.getInstance();

//     // Wait for connection first
//     const isConnected = await socketManager.waitForConnection();

//     if (!isConnected) {
//       console.warn("⚠️ Cannot subscribe - socket not connected");
//       return;
//     }
//     try {
//       // Try to subscribe - this will gracefully fail if socket is not available
//       const messageSubscribed = await socketManager.onMessage(
//         (newMessage: Message) => {
//           console.log("📨 New message received:", newMessage);

//           const currentState = get();
//           const isMessageFromSelectedUser =
//             newMessage.senderId === currentState.selectedUser?._id ||
//             newMessage.senderId === currentState.selectedUser?.id;

//           if (!isMessageFromSelectedUser) return;

//           set({
//             messages: [...currentState.messages, newMessage],
//           });
//         }
//       );

//       const typingSubscribed = await socketManager.onTyping(
//         ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
//           const currentState = get();
//           const isFromSelectedUser =
//             senderId === currentState.selectedUser?._id ||
//             senderId === currentState.selectedUser?.id;
//           if (isFromSelectedUser) {
//             set({ isTyping });
//           }
//         }
//       );

//       const readSubscribed = await socketManager.onMessageRead(
//         ({ messageId, read }: { messageId: string; read: boolean }) => {
//           const { messages } = get();
//           const updatedMessages = messages.map((msg) =>
//             msg.id === messageId || msg._id === messageId
//               ? { ...msg, read }
//               : msg
//           );
//           set({ messages: updatedMessages });
//         }
//       );

//       console.log("✅ Socket event subscriptions completed:", {
//         messages: messageSubscribed,
//         typing: typingSubscribed,
//         read: readSubscribed,
//       });

//       console.log("✅ Subscriptions completed successfully");
//     } catch (error) {
//       console.warn(
//         "Socket subscription failed, continuing without real-time features:",
//         error
//       );
//     }
//   },

//   unsubscribeFromMessages: () => {
//     console.log("🔕 Unsubscribing from socket events");
//     const socketManager = SocketManager.getInstance();
//     socketManager.offMessage();
//     socketManager.offTyping();
//     socketManager.offMessageRead();
//   },

//   setTypingStatus: (isTyping: boolean, authUser: User) => {
//     const { selectedUser } = get();

//     if (!selectedUser || !authUser) {
//       console.warn("Cannot set typing status: Missing user data");
//       return;
//     }

//     const socketManager = SocketManager.getInstance();
//     socketManager.setTypingStatus({
//       senderId: authUser._id || authUser.id || "",
//       receiverId: selectedUser._id || selectedUser.id || "",
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

//   // Formatting actions (unchanged)
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
import SocketManager from "@/lib/socket";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";
import { v4 as uuidv4 } from "uuid";

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
  tempId?: string;
  senderId: string;
  receiverId: string;
  content: string;
  text?: string;
  formatting?: FormattingState;
  reactions?: any[];
  createdAt: string;
  image?: string;
  read?: boolean;
  seen?: number;
  isReacting?: boolean;
  sender?: {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
  };
  receiver?: {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
  };
  replyToId?: string | number | null;
  replyToMessage?: Message | null;
  quote?: {
    text: string;
    avatar: string;
    parts: string;
  };
}

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  onlineUsers: string[];
  typingUsers: TypingUser[];
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isTyping: boolean;
  formatting: FormattingState;
  socketConnected: boolean;
  socketConnecting: boolean;
  socketError: string | null;
  replyToMessage: Message | null;
  isMessageSending: boolean;

  // Actions
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (formData: FormData) => Promise<void>;
  sendFormattedMessage: (
    content: string,
    replyToMessage?: Message | null
  ) => Promise<void>;
  addReaction: (messageId: string, emoji: any) => Promise<any>;
  removeReaction: (messageId: string, emojiId: string) => Promise<void>;
  setSelectedUser: (user: User) => void;
  initializeSocket: (userId: string) => Promise<void>;
  subscribeToMessages: () => Promise<void>;
  unsubscribeFromMessages: () => void;
  setTypingStatus: (isTyping: boolean, authUser: User) => void;
  markMessageAsRead: (messageId: string) => void;
  retrySocketConnection: (userId: string) => Promise<void>;

  // Online status management
  updateOnlineUsers: (userIds: string[]) => void;
  isUserOnline: (userId: string) => boolean;

  // Typing status management
  updateTypingStatus: (
    senderId: string,
    senderName: string,
    isTyping: boolean
  ) => void;
  getTypingUsers: () => TypingUser[];
  clearTypingStatus: (userId: string) => void;

  // Message read status
  updateMessageReadStatus: (messageId: string, read: boolean) => void;

  // Reply functionality
  setReplyToMessage: (message: Message | null) => void;
  clearReplyToMessage: () => void;

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
  onlineUsers: [],
  typingUsers: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  socketConnected: false,
  socketConnecting: false,
  socketError: null,
  replyToMessage: null,
  isMessageSending: false,

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
      const users = response.data.map((user: User) => ({
        ...user,
        isOnline: get().onlineUsers.includes(user.id || user._id),
      }));
      set({ users: users, isUsersLoading: false });
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

  updateOnlineUsers: (userIds: string[]) => {
    set({ onlineUsers: userIds });

    // Update users list with online status
    const { users } = get();
    const updatedUsers = users.map((user) => ({
      ...user,
      isOnline: userIds.includes(user.id || user._id),
    }));
    set({ users: updatedUsers });
  },

  isUserOnline: (userId: string) => {
    return get().onlineUsers.includes(userId);
  },

  updateTypingStatus: (
    senderId: string,
    senderName: string,
    isTyping: boolean
  ) => {
    const { typingUsers } = get();

    // Update typing status for the specific user
    const updatedTypingUsers = typingUsers.filter(
      (user) => user.userId !== senderId
    );
    if (isTyping) {
      updatedTypingUsers.push({
        userId: senderId,
        userName: senderName,
        isTyping,
      });
    }

    set({ typingUsers: updatedTypingUsers, isTyping });
  },

  getTypingUsers: () => {
    return get().typingUsers.filter((user) => user.isTyping);
  },

  clearTypingStatus: (userId: string) => {
    set({
      typingUsers: get().typingUsers.filter((user) => user.userId !== userId),
      isTyping: false,
    });
  },

  updateMessageReadStatus: (messageId: string, read: boolean) => {
    const { messages } = get();
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId || msg._id === messageId ? { ...msg, read } : msg
    );
    set({ messages: updatedMessages });
  },

  // subscribeToMessages: async () => {
  //   const { selectedUser } = get()
  //   if (!selectedUser?.id) {
  //     console.warn("Cannot subscribe to messages: No user selected")
  //     return
  //   }

  //   const socketManager = SocketManager.getInstance()

  //   // Wait for connection first
  //   const isConnected = await socketManager.waitForConnection()
  //   if (!isConnected) {
  //     console.warn("⚠️ Cannot subscribe - socket not connected")
  //     return
  //   }

  //   try {
  //     // Subscribe to new messages
  //     await socketManager.onMessage((newMessage: Message) => {
  //       const currentState = get()
  //       const isMessageFromSelectedUser =
  //         newMessage.senderId === currentState.selectedUser?._id ||
  //         newMessage.senderId === currentState.selectedUser?.id

  //       if (!isMessageFromSelectedUser) return

  //       set({
  //         messages: [...currentState.messages, newMessage],
  //       })
  //     })

  //     // Subscribe to online users updates
  //     await socketManager.onOnlineUsers((onlineUserIds: string[]) => {
  //       get().updateOnlineUsers(onlineUserIds)
  //     })

  //     // Subscribe to typing status
  //     await socketManager.onTyping(({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
  //       console.log(`⌨️ User ${senderId} typing: ${isTyping}`)
  //       const currentState = get()
  //       const isFromSelectedUser =
  //         senderId === currentState.selectedUser?._id || senderId === currentState.selectedUser?.id

  //       if (isFromSelectedUser) {
  //         const senderName = currentState.selectedUser?.name || "User"
  //         get().updateTypingStatus(senderId, senderName, isTyping)
  //       }
  //     })

  //     // Subscribe to message read updates
  //     await socketManager.onMessageRead(({ messageId, read }: { messageId: string; read: boolean }) => {
  //       console.log(`📖 Message ${messageId} read status: ${read}`)
  //       get().updateMessageReadStatus(messageId, read)
  //     })

  //     await socketManager.onReaction(({ messageId, reaction }) => {
  //       const { messages } = get()
  //       const updatedMessages = messages.map((msg) =>
  //         msg.id === messageId
  //           ? {
  //               ...msg,
  //               reactions: [...(msg.reactions || []), reaction],
  //             }
  //           : msg,
  //       )
  //       set({ messages: updatedMessages })
  //     })

  //     // Subscribe to reaction updates from socket
  //     const socket = socketManager.getSocket()
  //     if (socket) {
  //       socket.on("reactionAdded", (data: { messageId: string; reaction: any }) => {
  //         console.log("🎭 Reaction received via socket:", data)
  //         const currentState = get()
  //         const { authUser } = useAuthStore.getState()

  //         // Don't update if this reaction was added by the current user (already updated locally)
  //         if (data.reaction.userId === authUser?.id || data.reaction.userId === authUser?._id) {
  //           console.log("🎭 Ignoring own reaction from socket")
  //           return
  //         }

  //         const updatedMessages = currentState.messages.map((msg) => {
  //           if (msg.id === data.messageId || msg._id === data.messageId) {
  //             const existingReactions = msg.reactions || []
  //             const existingIndex = existingReactions.findIndex(
  //               (r) => r.emoji?.name === data.reaction.emoji?.name || r.name === data.reaction.name,
  //             )

  //             let newReactions
  //             if (existingIndex >= 0) {
  //               newReactions = existingReactions.map((r, index) =>
  //                 index === existingIndex
  //                   ? {
  //                       ...r,
  //                       count: (r.count || 0) + 1,
  //                       userIds: [...(r.userIds || []), data.reaction.userId],
  //                     }
  //                   : r,
  //               )
  //             } else {
  //               newReactions = [...existingReactions, data.reaction]
  //             }

  //             return { ...msg, reactions: newReactions }
  //           }
  //           return msg
  //         })

  //         set({ messages: updatedMessages })
  //       })
  //     }

  //     console.log("✅ Socket event subscriptions completed")
  //   } catch (error) {
  //     console.warn("Socket subscription failed, continuing without real-time features:", error)
  //   }
  // },

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser?.id) {
      console.warn("Cannot subscribe to messages: No user selected");
      return;
    }

    const socketManager = SocketManager.getInstance();
    const isConnected = await socketManager.waitForConnection();
    if (!isConnected) {
      console.warn("⚠️ Cannot subscribe - socket not connected");
      return;
    }

    const socket = socketManager.getSocket();
    if (!socket) return;

    // Clean up old listeners
    socket.off("newMessage");
    socket.off("messageSent");

    // Handle messages from receiver
    socket.on("newMessage", (newMessage: Message) => {
      const currentState = get();

      const isFromSelectedUser =
        newMessage.senderId === currentState.selectedUser?.id ||
        newMessage.senderId === currentState.selectedUser?._id;

      if (!isFromSelectedUser) return;

      const alreadyExists = currentState.messages.some(
        (msg) =>
          msg.id === newMessage.id && msg.createdAt === newMessage.createdAt
      );

      if (!alreadyExists) {
        set({ messages: [...currentState.messages, newMessage] });
      }
    });

    // Handle confirmation to sender
    socket.on("messageSent", (sentMessage: Message) => {
      const currentState = get();

      const alreadyExists = currentState.messages.some(
        (msg) =>
          msg.id === sentMessage.id && msg.createdAt === sentMessage.createdAt
      );

      if (!alreadyExists) {
        set({ messages: [...currentState.messages, sentMessage] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    console.log("🔕 Unsubscribing from socket events");
    const socketManager = SocketManager.getInstance();

    socketManager.offMessage();
    socketManager.offOnlineUsers();
    socketManager.offTyping();
    socketManager.offMessageRead();

    // Unsubscribe from reaction events
    const socket = socketManager.getSocket();
    if (socket) {
      socket.off("reactionAdded");
    }
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
    get().updateMessageReadStatus(messageId, true);
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

      // Send via socket using SocketManager wrapper
      const socketManager = SocketManager.getInstance();
      await socketManager.sendMessage(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  sendFormattedMessage: async (
    content: string,
    replyToMessage: Message | null = null
  ) => {
    const { selectedUser, messages, formatting } = get();
    const replyToMessageState = replyToMessage || get().replyToMessage;

    set({ isMessageSending: true });
    try {
      if (!selectedUser) {
        console.error("No user selected");
        return;
      }

      const payload = {
        content,
        formatting,
        selectedUser,
        replyToId: replyToMessageState?.id || null,
        replyToSenderId: replyToMessageState?.senderId || null,
        replyToContent:
          replyToMessageState?.text || replyToMessageState?.content || null,
      };

      const response = await api.post(
        `/messages/send/${selectedUser.id}`,
        payload
      );
      const newMessage = response.data;

      const completeMessage: Message = {
        ...newMessage,
        senderId: newMessage.sender?.id || newMessage.senderId,
        receiverId:
          selectedUser.id || newMessage.receiver?.id || newMessage.receiverId,
        sender: newMessage.sender,
        receiver: selectedUser || newMessage.receiver,
        createdAt: newMessage.createdAt || new Date().toISOString(),
        replyToId: replyToMessageState?.id || null,
        replyToMessage: replyToMessageState,
        quote: replyToMessageState
          ? {
              text:
                replyToMessageState.text || replyToMessageState.content || "",
              avatar: replyToMessageState.sender?.avatar || "/placeholder.svg",
              parts: replyToMessageState.sender?.name || "User",
            }
          : undefined,
      };

      set({
        messages: [...messages, completeMessage],
        replyToMessage: null,
      });

      // Send via socket using SocketManager wrapper
      const socketManager = SocketManager.getInstance();
      await socketManager.sendMessage(completeMessage);

      get().resetFormatting();
    } catch (error) {
      toast.error("Failed to send message!");
    } finally {
      set({ isMessageSending: false });
    }
  },

  // sendFormattedMessage: async (content: string, replyToMessage: Message | null = null) => {
  //   const { selectedUser, messages, formatting } = get();
  //   const replyToMessageState = replyToMessage || get().replyToMessage;
  //   const { authUser } = useAuthStore.getState();

  //   set({ isMessageSending: true });

  //   // Generate a temporary unique ID for optimistic UI
  //   const tempId = `temp-${uuidv4()}`;

  //   try {
  //     if (!selectedUser || !authUser) {
  //       console.error("No user selected or not authenticated");
  //       return;
  //     }

  //     // Create optimistic message
  //     const optimisticMessage: Message = {
  //       tempId,
  //       id: tempId, // Will be replaced by server ID
  //       content,
  //       senderId: authUser.id,
  //       receiverId: selectedUser.id,
  //       createdAt: new Date().toISOString(),
  //       formatting,
  //       replyToId: replyToMessageState?.id || null,
  //       replyToMessage: replyToMessageState,
  //       quote: replyToMessageState ? {
  //         text: replyToMessageState.text || replyToMessageState.content || "",
  //         avatar: replyToMessageState.sender?.avatar || "/placeholder.svg",
  //         parts: replyToMessageState.sender?.name || "User",
  //       } : undefined,
  //     };

  //     // Add optimistic message immediately
  //     set({
  //       messages: [...messages, optimisticMessage],
  //       replyToMessage: null,
  //     });

  //     const payload = {
  //       content,
  //       formatting,
  //       selectedUser,
  //       replyToId: replyToMessageState?.id || null,
  //       replyToSenderId: replyToMessageState?.senderId || null,
  //       replyToContent: replyToMessageState?.text || replyToMessageState?.content || null,
  //     };

  //     const response = await api.post(`/messages/send/${selectedUser.id}`, payload);
  //     const newMessage = response.data;

  //     // Create complete message with server data
  //     const completeMessage: Message = {
  //       ...newMessage,
  //       senderId: newMessage.sender?.id || newMessage.senderId,
  //       receiverId: selectedUser.id || newMessage.receiver?.id || newMessage.receiverId,
  //       sender: newMessage.sender,
  //       receiver: selectedUser || newMessage.receiver,
  //       createdAt: newMessage.createdAt || new Date().toISOString(),
  //       status: 'sent',
  //       replyToId: replyToMessageState?.id || null,
  //       replyToMessage: replyToMessageState,
  //       quote: replyToMessageState ? {
  //         text: replyToMessageState.text || replyToMessageState.content || "",
  //         avatar: replyToMessageState.sender?.avatar || "/placeholder.svg",
  //         parts: replyToMessageState.sender?.name || "User",
  //       } : undefined,
  //     };

  //     // Replace optimistic message with server response
  //     set({
  //       messages: get().messages.map(msg =>
  //         msg.tempId === tempId ? completeMessage : msg
  //       ),
  //     });

  //     // Send via socket
  //     const socketManager = SocketManager.getInstance();
  //     await socketManager.sendMessage(completeMessage);

  //     get().resetFormatting();
  //   } catch (error) {
  //     // Mark message as failed
  //     set({
  //       messages: get().messages.map(msg =>
  //         msg.tempId === tempId
  //           ? { ...msg, status: 'failed' }
  //           : msg
  //       ),
  //     });
  //     toast.error("Failed to send message!");
  //   } finally {
  //     set({ isMessageSending: false });
  //   }
  // },

  addReaction: async (messageId: string, emoji: any) => {
    try {
      console.log("🎭 Adding reaction:", { messageId, emoji });

      // Get current state and auth user
      const currentState = get();
      const { authUser } = useAuthStore.getState();

      if (!authUser?.id && !authUser?._id) {
        console.error("No authenticated user found");
        return;
      }

      const userId = authUser.id || authUser._id;

      // Set loading state for the message
      const updatedMessages = currentState.messages.map((msg) =>
        msg.id === messageId || msg._id === messageId
          ? { ...msg, isReacting: true }
          : msg
      );
      set({ messages: updatedMessages });

      // Make API call
      const response = await api.post("/reactions", {
        messageId,
        emoji: {
          id: emoji.id,
          native: emoji.native,
          name: emoji.name,
        },
      });

      console.log("🎭 Reaction API response:", response.data);

      // Create the reaction object with proper structure
      const newReaction = {
        id: response.data.id || Date.now().toString(),
        emoji: {
          id: emoji.id,
          native: emoji.native,
          name: emoji.name,
        },
        name: emoji.name,
        count: 1,
        userIds: [userId],
        userId: userId,
      };

      // Update local state immediately for instant UI feedback
      const latestState = get();
      const finalUpdatedMessages = latestState.messages.map((msg) => {
        if (msg.id === messageId || msg._id === messageId) {
          const existingReactions = msg.reactions || [];

          // Check if this emoji already exists in reactions
          const existingReactionIndex = existingReactions.findIndex(
            (r) =>
              r.emoji?.id === emoji.id ||
              r.emoji?.name === emoji.name ||
              r.name === emoji.name
          );

          let newReactions;

          if (existingReactionIndex >= 0) {
            // Increment count for existing reaction
            newReactions = existingReactions.map((r, index) =>
              index === existingReactionIndex
                ? {
                    ...r,
                    count: (r.count || 0) + 1,
                    userIds: [...(r.userIds || []), userId],
                  }
                : r
            );
          } else {
            // Add new reaction
            newReactions = [...existingReactions, newReaction];
          }

          return {
            ...msg,
            reactions: newReactions,
            isReacting: false,
          };
        }
        return msg;
      });

      // Update the state with the new reactions
      set({ messages: finalUpdatedMessages });

      console.log("🎭 Updated message reactions locally");

      // Send reaction via socket for other users
      const socketManager = SocketManager.getInstance();
      await socketManager.sendReaction({
        messageId,
        reaction: newReaction,
      });

      console.log("🎭 Reaction sent via socket");

      return response.data;
    } catch (error) {
      console.error("🎭💥 Error adding reaction:", error);

      // Reset loading state on error
      const currentState = get();
      const resetMessages = currentState.messages.map((msg) =>
        msg.id === messageId || msg._id === messageId
          ? { ...msg, isReacting: false }
          : msg
      );
      set({ messages: resetMessages });

      throw error;
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

  setReplyToMessage: (message: Message | null) => {
    set({ replyToMessage: message });
  },

  clearReplyToMessage: () => {
    set({ replyToMessage: null });
  },

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
        imageUrl: "",
        imageName: "",
        codeLanguage: "javascript",
        codeContent: "",
      },
    });
  },
}));

// import { create } from "zustand"
// import { api } from "@/lib/axios"
// import SocketManager from "@/lib/socket"
// import { toast } from "sonner"
// import { useAuthStore } from "./useAuthStore"

// interface FormattingState {
//   bold: boolean
//   italic: boolean
//   underline: boolean
//   unorderedList: boolean
//   orderedList: boolean
//   fontSize: string
//   linkTitle: string
//   linkTarget: string
//   emoji: string
//   imageName: string
//   imageUrl: string
//   codeLanguage: string
//   codeContent: string
// }

// interface Message {
//   id: string
//   _id?: string
//   senderId: string
//   receiverId: string
//   content: string
//   text?: string
//   formatting?: FormattingState
//   reactions?: any[]
//   createdAt: string
//   image?: string
//   read?: boolean
//   seen?: number
//   isReacting?: boolean
//   sender?: {
//     id: string | number
//     name: string
//     email: string
//     avatar?: string
//   }
//   receiver?: {
//     id: string | number
//     name: string
//     email: string
//     avatar?: string
//   }
//   replyToId?: string | number | null
//   replyToMessage?: Message | null
//   quote?: {
//     text: string
//     avatar: string
//     parts: string
//   }
// }

// interface User {
//   _id: string
//   id: string
//   name: string
//   email: string
//   avatar?: string
//   isOnline?: boolean
//   lastMessage: string
//   lastMessageSeen: number
//   lastMessageSenderId: number
// }

// interface TypingUser {
//   userId: string
//   userName: string
//   isTyping: boolean
// }

// interface ChatStore {
//   messages: Message[]
//   users: User[]
//   selectedUser: User | null
//   onlineUsers: string[]
//   typingUsers: TypingUser[]
//   isUsersLoading: boolean
//   isMessagesLoading: boolean
//   isTyping: boolean
//   formatting: FormattingState
//   socketConnected: boolean
//   socketConnecting: boolean
//   socketError: string | null
//   replyToMessage: Message | null
//   isMessageSending: boolean

//   // Actions
//   getUsers: () => Promise<void>
//   getMessages: (userId: string) => Promise<void>
//   sendMessage: (formData: FormData) => Promise<void>
//   sendFormattedMessage: (content: string, replyToMessage?: Message | null) => Promise<void>
//   addReaction: (messageId: string, emoji: any) => Promise<any>
//   removeReaction: (messageId: string, emojiId: string) => Promise<void>
//   setSelectedUser: (user: User) => void
//   initializeSocket: (userId: string) => Promise<void>
//   subscribeToMessages: () => Promise<void>
//   unsubscribeFromMessages: () => void
//   setTypingStatus: (isTyping: boolean, authUser: User) => void
//   markMessageAsRead: (messageId: string) => void
//   retrySocketConnection: (userId: string) => Promise<void>

//   // Online status management
//   updateOnlineUsers: (userIds: string[]) => void
//   isUserOnline: (userId: string) => boolean

//   // Typing status management
//   updateTypingStatus: (senderId: string, senderName: string, isTyping: boolean) => void
//   getTypingUsers: () => TypingUser[]
//   clearTypingStatus: (userId: string) => void

//   // Message read status
//   updateMessageReadStatus: (messageId: string, read: boolean) => void

//   // Reply functionality
//   setReplyToMessage: (message: Message | null) => void
//   clearReplyToMessage: () => void

//   // Formatting actions
//   toggleBold: () => void
//   toggleItalic: () => void
//   toggleUnderline: () => void
//   toggleUnorderedList: () => void
//   toggleOrderedList: () => void
//   setFontSize: (fontSize: string) => void
//   setLinkTitle: (linkTitle: string) => void
//   setLinkTarget: (linkTarget: string) => void
//   setEmoji: (emoji: string) => void
//   setImageName: (imageName: string) => void
//   setImageUrl: (imageUrl: string) => void
//   setCodeLanguage: (codeLanguage: string) => void
//   setCodeContent: (codeContent: string) => void
//   resetFormatting: () => void
// }

// export const useChatStore = create<ChatStore>((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   onlineUsers: [],
//   typingUsers: [],
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isTyping: false,
//   socketConnected: false,
//   socketConnecting: false,
//   socketError: null,
//   replyToMessage: null,
//   isMessageSending: false,

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
//     codeLanguage: "",
//     codeContent: "",
//   },

//   getUsers: async () => {
//     set({ isUsersLoading: true })
//     try {
//       const response = await api.get("/users")
//       const { onlineUsers } = get()
//       const users = response.data.map((user: User) => ({
//         ...user,
//         isOnline: onlineUsers.includes(user.id?.toString() || user._id?.toString()),
//       }))
//       set({ users: users, isUsersLoading: false })
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       set({ isUsersLoading: false })
//     }
//   },

//   getMessages: async (userId: string) => {
//     set({ isMessagesLoading: true })
//     try {
//       const response = await api.get(`/messages/${userId}`)
//       set({ messages: response.data, isMessagesLoading: false })

//       // Mark messages as read when fetching
//       const unreadMessages = response.data.filter(
//         (msg: Message) => msg.senderId === userId && !msg.read && msg.seen !== 1,
//       )

//       for (const message of unreadMessages) {
//         get().markMessageAsRead(message.id)
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error)
//       set({ isMessagesLoading: false })
//     }
//   },

//   initializeSocket: async (userId: string) => {
//     if (!userId) {
//       console.error("Cannot initialize socket: No userId provided")
//       return
//     }

//     const socketManager = SocketManager.getInstance()
//     const status = socketManager.getConnectionStatus()

//     if (status.connected) {
//       set({
//         socketConnected: true,
//         socketConnecting: false,
//         socketError: null,
//       })
//       return
//     }

//     if (status.connecting) {
//       console.log("Socket already connecting, waiting...")
//       return
//     }

//     set({ socketConnecting: true, socketError: null })

//     try {
//       await socketManager.connect()

//       set({
//         socketConnected: true,
//         socketConnecting: false,
//         socketError: null,
//       })

//       console.log("✅ Socket initialized successfully")
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Unknown socket error"

//       set({
//         socketConnected: false,
//         socketConnecting: false,
//         socketError: errorMessage,
//       })

//       console.error("❌ Socket initialization failed:", errorMessage)
//     }
//   },

//   retrySocketConnection: async (userId: string) => {
//     console.log("🔄 Retrying socket connection for user:", userId)
//     const socketManager = SocketManager.getInstance()
//     socketManager.resetConnectionState()
//     await get().initializeSocket(userId)
//   },

//   updateOnlineUsers: (userIds: string[]) => {
//     console.log("👥 Updating online users:", userIds)
//     set({ onlineUsers: userIds })

//     // Update auth store
//     const { setOnlineUsers } = useAuthStore.getState()
//     setOnlineUsers(userIds)

//     // Update users list with online status
//     const { users } = get()
//     const updatedUsers = users.map((user) => ({
//       ...user,
//       isOnline: userIds.includes(user.id?.toString() || user._id?.toString()),
//     }))
//     set({ users: updatedUsers })
//   },

//   isUserOnline: (userId: string) => {
//     return get().onlineUsers.includes(userId)
//   },

//   updateTypingStatus: (senderId: string, senderName: string, isTyping: boolean) => {
//     const { typingUsers } = get()

//     const updatedTypingUsers = typingUsers.filter((user) => user.userId !== senderId)
//     if (isTyping) {
//       updatedTypingUsers.push({
//         userId: senderId,
//         userName: senderName,
//         isTyping,
//       })
//     }

//     set({ typingUsers: updatedTypingUsers })
//     console.log("⌨️ Updated typing users:", updatedTypingUsers)
//   },

//   getTypingUsers: () => {
//     return get().typingUsers.filter((user) => user.isTyping)
//   },

//   clearTypingStatus: (userId: string) => {
//     set({
//       typingUsers: get().typingUsers.filter((user) => user.userId !== userId),
//     })
//   },

//   updateMessageReadStatus: (messageId: string, read: boolean) => {
//     const { messages } = get()
//     const updatedMessages = messages.map((msg) =>
//       msg.id === messageId || msg._id === messageId ? { ...msg, read, seen: read ? 1 : 0 } : msg,
//     )
//     set({ messages: updatedMessages })
//     console.log("👁️ Updated message read status:", messageId, read)
//   },

//   subscribeToMessages: async () => {
//     const { selectedUser } = get()
//     if (!selectedUser?.id) {
//       console.warn("Cannot subscribe to messages: No user selected")
//       return
//     }

//     console.log("🔔 Subscribing to socket events for user:", selectedUser.id)

//     const socketManager = SocketManager.getInstance()

//     const isConnected = await socketManager.waitForConnection()
//     if (!isConnected) {
//       console.warn("⚠️ Cannot subscribe - socket not connected")
//       return
//     }

//     try {
//       // Subscribe to new messages
//       await socketManager.onMessage((newMessage: Message) => {
//         console.log("📨 New message received:", newMessage)
//         const currentState = get()
//         const isMessageFromSelectedUser =
//           newMessage.senderId === currentState.selectedUser?._id ||
//           newMessage.senderId === currentState.selectedUser?.id?.toString()

//         if (isMessageFromSelectedUser) {
//           set({
//             messages: [...currentState.messages, newMessage],
//           })

//           // Auto-mark as read if chat is open
//           setTimeout(() => {
//             get().markMessageAsRead(newMessage.id)
//           }, 1000)
//         }
//       })

//       // Subscribe to online users updates
//       await socketManager.onOnlineUsers((onlineUserIds: string[]) => {
//         get().updateOnlineUsers(onlineUserIds)
//       })

//       // Subscribe to typing status
//       await socketManager.onTyping(({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
//         console.log(`⌨️ User ${senderId} typing: ${isTyping}`)
//         const currentState = get()
//         const isFromSelectedUser =
//           senderId === currentState.selectedUser?._id || senderId === currentState.selectedUser?.id?.toString()

//         if (isFromSelectedUser) {
//           const senderName = currentState.selectedUser?.name || "User"
//           get().updateTypingStatus(senderId, senderName, isTyping)

//           // Clear typing status after 3 seconds
//           if (isTyping) {
//             setTimeout(() => {
//               get().clearTypingStatus(senderId)
//             }, 3000)
//           }
//         }
//       })

//       // Subscribe to message read updates
//       await socketManager.onMessageRead(({ messageId, read }: { messageId: string; read: boolean }) => {
//         console.log(`📖 Message ${messageId} read status: ${read}`)
//         get().updateMessageReadStatus(messageId, read)
//       })

//       // Subscribe to reactions
//       await socketManager.onReaction(({ messageId, reaction }) => {
//         console.log("🎭 Reaction received via socket:", { messageId, reaction })
//         const { messages } = get()
//         const { authUser } = useAuthStore.getState()

//         if (reaction.userId === authUser?.id || reaction.userId === authUser?._id) {
//           console.log("🎭 Ignoring own reaction from socket")
//           return
//         }

//         const updatedMessages = messages.map((msg) => {
//           if (msg.id === messageId || msg._id === messageId) {
//             const existingReactions = msg.reactions || []
//             const existingIndex = existingReactions.findIndex(
//               (r) => r.emoji?.name === reaction.emoji?.name || r.name === reaction.name,
//             )

//             let newReactions
//             if (existingIndex >= 0) {
//               newReactions = existingReactions.map((r, index) =>
//                 index === existingIndex
//                   ? {
//                       ...r,
//                       count: (r.count || 0) + 1,
//                       userIds: [...(r.userIds || []), reaction.userId],
//                     }
//                   : r,
//               )
//             } else {
//               newReactions = [...existingReactions, reaction]
//             }

//             return { ...msg, reactions: newReactions }
//           }
//           return msg
//         })

//         set({ messages: updatedMessages })
//       })

//       console.log("✅ Socket event subscriptions completed")
//     } catch (error) {
//       console.warn("Socket subscription failed, continuing without real-time features:", error)
//     }
//   },

//   unsubscribeFromMessages: () => {
//     console.log("🔕 Unsubscribing from socket events")
//     const socketManager = SocketManager.getInstance()

//     socketManager.offMessage()
//     socketManager.offOnlineUsers()
//     socketManager.offTyping()
//     socketManager.offMessageRead()

//     const socket = socketManager.getSocket()
//     if (socket) {
//       socket.off("reactionAdded")
//     }
//   },

//   setTypingStatus: (isTyping: boolean, authUser: User) => {
//     const { selectedUser } = get()

//     if (!selectedUser || !authUser) {
//       console.warn("Cannot set typing status: Missing user data")
//       return
//     }

//     const socketManager = SocketManager.getInstance()
//     socketManager.setTypingStatus({
//       senderId: authUser._id || authUser.id || "",
//       receiverId: selectedUser._id || selectedUser.id || "",
//       isTyping,
//     })
//   },

//   markMessageAsRead: (messageId: string) => {
//     const { messages } = get()
//     const message = messages.find((msg) => msg.id === messageId || msg._id === messageId)

//     if (!message) {
//       console.warn("Message not found for read receipt:", messageId)
//       return
//     }

//     // Don't mark own messages as read
//     const { authUser } = useAuthStore.getState()
//     if (message.senderId === authUser?.id?.toString() || message.senderId === authUser?._id) {
//       return
//     }

//     const socketManager = SocketManager.getInstance()
//     socketManager.markMessageAsRead({
//       messageId,
//       senderId: message.senderId,
//     })

//     // Update local state
//     get().updateMessageReadStatus(messageId, true)
//   },

//   sendMessage: async (formData: FormData) => {
//     const { selectedUser, messages } = get()
//     try {
//       if (!selectedUser) {
//         console.error("No user selected")
//         return
//       }

//       const response = await api.post(`/messages/send/${selectedUser.id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       const newMessage = response.data

//       set({
//         messages: [...messages, newMessage],
//       })

//       const socketManager = SocketManager.getInstance()
//       await socketManager.sendMessage(newMessage)
//     } catch (error) {
//       console.error("Error sending message:", error)
//       toast.error("Failed to send message!")
//     }
//   },

//   sendFormattedMessage: async (content: string, replyToMessage: Message | null = null) => {
//     const { selectedUser, messages, formatting } = get()
//     const replyToMessageState = replyToMessage || get().replyToMessage

//     set({ isMessageSending: true })
//     try {
//       if (!selectedUser) {
//         console.error("No user selected")
//         return
//       }

//       const payload = {
//         content,
//         formatting,
//         selectedUser,
//         replyToId: replyToMessageState?.id || null,
//         replyToSenderId: replyToMessageState?.senderId || null,
//         replyToContent: replyToMessageState?.text || replyToMessageState?.content || null,
//       }

//       const response = await api.post(`/messages/send/${selectedUser.id}`, payload)
//       const newMessage = response.data

//       const completeMessage: Message = {
//         ...newMessage,
//         senderId: newMessage.sender?.id || newMessage.senderId,
//         receiverId: selectedUser.id || newMessage.receiver?.id || newMessage.receiverId,
//         sender: newMessage.sender,
//         receiver: selectedUser || newMessage.receiver,
//         createdAt: newMessage.createdAt || new Date().toISOString(),
//         replyToId: replyToMessageState?.id || null,
//         replyToMessage: replyToMessageState,
//         quote: replyToMessageState
//           ? {
//               text: replyToMessageState.text || replyToMessageState.content || "",
//               avatar: replyToMessageState.sender?.avatar || "/placeholder.svg",
//               parts: replyToMessageState.sender?.name || "User",
//             }
//           : undefined,
//       }

//       set({
//         messages: [...messages, completeMessage],
//         replyToMessage: null,
//       })

//       const socketManager = SocketManager.getInstance()
//       await socketManager.sendMessage(completeMessage)

//       get().resetFormatting()
//     } catch (error) {
//       console.error("Error sending formatted message:", error)
//       toast.error("Failed to send message!")
//     } finally {
//       set({ isMessageSending: false })
//     }
//   },

//   addReaction: async (messageId: string, emoji: any) => {
//     try {
//       console.log("🎭 Adding reaction:", { messageId, emoji })

//       const currentState = get()
//       const { authUser } = useAuthStore.getState()

//       if (!authUser?.id && !authUser?._id) {
//         console.error("No authenticated user found")
//         return
//       }

//       const userId = authUser.id || authUser._id

//       const updatedMessages = currentState.messages.map((msg) =>
//         msg.id === messageId || msg._id === messageId ? { ...msg, isReacting: true } : msg,
//       )
//       set({ messages: updatedMessages })

//       const response = await api.post("/reactions", {
//         messageId,
//         emoji: {
//           id: emoji.id,
//           native: emoji.native,
//           name: emoji.name,
//         },
//       })

//       console.log("🎭 Reaction API response:", response.data)

//       const newReaction = {
//         id: response.data.id || Date.now().toString(),
//         emoji: {
//           id: emoji.id,
//           native: emoji.native,
//           name: emoji.name,
//         },
//         name: emoji.name,
//         count: 1,
//         userIds: [userId],
//         userId: userId,
//       }

//       const latestState = get()
//       const finalUpdatedMessages = latestState.messages.map((msg) => {
//         if (msg.id === messageId || msg._id === messageId) {
//           const existingReactions = msg.reactions || []

//           const existingReactionIndex = existingReactions.findIndex(
//             (r) => r.emoji?.id === emoji.id || r.emoji?.name === emoji.name || r.name === emoji.name,
//           )

//           let newReactions

//           if (existingReactionIndex >= 0) {
//             newReactions = existingReactions.map((r, index) =>
//               index === existingReactionIndex
//                 ? {
//                     ...r,
//                     count: (r.count || 0) + 1,
//                     userIds: [...(r.userIds || []), userId],
//                   }
//                 : r,
//             )
//           } else {
//             newReactions = [...existingReactions, newReaction]
//           }

//           return {
//             ...msg,
//             reactions: newReactions,
//             isReacting: false,
//           }
//         }
//         return msg
//       })

//       set({ messages: finalUpdatedMessages })

//       const socketManager = SocketManager.getInstance()
//       await socketManager.sendReaction({
//         messageId,
//         reaction: newReaction,
//       })

//       console.log("🎭 Reaction sent via socket")

//       return response.data
//     } catch (error) {
//       console.error("🎭💥 Error adding reaction:", error)

//       const currentState = get()
//       const resetMessages = currentState.messages.map((msg) =>
//         msg.id === messageId || msg._id === messageId ? { ...msg, isReacting: false } : msg,
//       )
//       set({ messages: resetMessages })

//       throw error
//     }
//   },

//   removeReaction: async (messageId: string, emojiId: string) => {
//     try {
//       await api.delete("/reactions", {
//         data: { messageId, emojiId },
//       })

//       const { messages } = get()
//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? {
//               ...msg,
//               reactions: (msg.reactions || []).filter((r: any) => r.emojiId !== emojiId),
//             }
//           : msg,
//       )
//       set({ messages: updatedMessages })
//     } catch (error) {
//       console.error("Error removing reaction:", error)
//     }
//   },

//   setSelectedUser: (user: User) => {
//     set({ selectedUser: user })
//   },

//   setReplyToMessage: (message: Message | null) => {
//     set({ replyToMessage: message })
//   },

//   clearReplyToMessage: () => {
//     set({ replyToMessage: null })
//   },

//   toggleBold: () => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, bold: !formatting.bold },
//     })
//   },

//   toggleItalic: () => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, italic: !formatting.italic },
//     })
//   },

//   toggleUnderline: () => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, underline: !formatting.underline },
//     })
//   },

//   toggleUnorderedList: () => {
//     const { formatting } = get()
//     set({
//       formatting: {
//         ...formatting,
//         unorderedList: !formatting.unorderedList,
//         orderedList: false,
//       },
//     })
//   },

//   toggleOrderedList: () => {
//     const { formatting } = get()
//     set({
//       formatting: {
//         ...formatting,
//         orderedList: !formatting.orderedList,
//         unorderedList: false,
//       },
//     })
//   },

//   setFontSize: (fontSize: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, fontSize },
//     })
//   },

//   setLinkTitle: (linkTitle: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, linkTitle },
//     })
//   },

//   setLinkTarget: (linkTarget: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, linkTarget },
//     })
//   },

//   setEmoji: (emoji: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, emoji },
//     })
//   },

//   setImageUrl: (imageUrl: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, imageUrl },
//     })
//   },

//   setImageName: (imageName: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, imageName },
//     })
//   },

//   setCodeLanguage: (codeLanguage: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, codeLanguage },
//     })
//   },

//   setCodeContent: (codeContent: string) => {
//     const { formatting } = get()
//     set({
//       formatting: { ...formatting, codeContent },
//     })
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
//         imageUrl: "",
//         imageName: "",
//         codeLanguage: "javascript",
//         codeContent: "",
//       },
//     })
//   },
// }))
