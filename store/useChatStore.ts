import { create } from "zustand";
import { api } from "@/lib/axios";
import { toast } from "sonner";

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

interface Reaction {
  id: string;
  messageId: string;
  emojiId: string;
  emojiNative: string;
  emojiName: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  text?: string;
  formatting?: FormattingState;
  createdAt: string;
  image?: string;
  read?: boolean;
  readAt?: string;
  seen?: number;
  reactions?: Reaction[];
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
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isTyping?: boolean;
  lastMessage?: string;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  formatting: FormattingState;
  replyToMessage: Message | null;
  isMessageSending: boolean;
  isSubscribed: boolean;
  typingStatus: Record<string, boolean>;
  unreadCounts: Record<string, number>;
  isSocketInitialized: boolean;
  unreadMessages: {
    [userId: string]: {
      message: string;
      time: string;
    };
  };

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  addReaction: (reaction: Reaction) => void;
  sendFormattedMessage: (
    content: string,
    replyToMessage?: Message | null
  ) => Promise<void>;
  setSelectedUser: (user: User) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;

  setReplyToMessage: (message: Message | null) => void;
  clearReplyToMessage: () => void;

  setTypingStatus: (userId: string, isTyping: boolean) => void;
  incrementUnreadCount: (userId: string) => void;
  setUnreadCount: (userId: string, count: number) => void;
  resetUnreadCount: (userId: string) => void;
  markMessagesAsRead: (userId: string) => Promise<void>;

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
  replyToMessage: null,
  isMessageSending: false,
  isSubscribed: false,
  typingStatus: {},
  unreadCounts: {} as Record<string, number>,
  isSocketInitialized: false,
  unreadMessages: {} as Record<string, { message: string; time: string }>,

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

  addMessage: (message: Message) => {
    const authUser = require("@/store/useAuthStore").useAuthStore.getState()
      .authUser;
    const isIncoming = message.receiverId === authUser?.id;

    set((state) => {
      const updatedState: Partial<ChatStore> = {
        messages: [...state.messages, message],
      };

      const senderId = message.senderId;
      const receiverId = message.receiverId;
      const otherUserId = isIncoming ? senderId : receiverId;

      const lastMessageText = message.text ?? message.content ?? "";
      const lastMessageTime = message.createdAt;

      updatedState.users = state.users.map((user) =>
        user.id === otherUserId
          ? {
              ...user,
              lastMessage: lastMessageText,
              lastMessageTime,
              lastMessageSenderId: senderId,
              // lastMessageSeen:
              //   message.senderId === authUser?.id && !!message.readAt,
              lastMessageSeen:
                message.senderId === authUser?.id ? !!message.readAt : true,
            }
          : user
      );

      if (
        isIncoming &&
        (!state.selectedUser || senderId !== state.selectedUser.id)
      ) {
        updatedState.unreadCounts = {
          ...state.unreadCounts,
          [senderId]: (state.unreadCounts[senderId] || 0) + 1,
        };

        updatedState.unreadMessages = {
          ...state.unreadMessages,
          [senderId]: {
            message: lastMessageText,
            time: lastMessageTime,
          },
        };
      }

      return updatedState as ChatStore;
    });
  },

  addReaction: (reaction: Reaction) => {
    set((state) => {
      const updatedMessages = state.messages.map((msg) => {
        if (msg.id !== reaction.messageId) return msg;

        const updatedReactions = msg.reactions ? [...msg.reactions] : [];
        const existingIndex = updatedReactions.findIndex(
          (r) => r.userId === reaction.userId && r.emojiId === reaction.emojiId
        );

        if (existingIndex !== -1) {
          updatedReactions[existingIndex] = reaction;
        } else {
          updatedReactions.push(reaction);
        }

        return {
          ...msg,
          reactions: updatedReactions,
        };
      });

      return { messages: updatedMessages };
    });
  },

  subscribeToMessages: () => {
    const { socket } = require("@/store/useAuthStore").useAuthStore.getState();
    const { selectedUser, isSubscribed } = get();
    const authUser = require("@/store/useAuthStore").useAuthStore.getState()
      .authUser;

    const hasSelectedUser = !!selectedUser;
    const hasSocket = !!socket;
    const hasAuthUser = !!authUser;
    const socketConnected = socket?.connected;

    if (
      isSubscribed ||
      !hasSelectedUser ||
      !hasSocket ||
      !hasAuthUser ||
      !socketConnected
    ) {
      return;
    }

    socket.on("newMessage", (message: Message) => {
      const authUser = require("@/store/useAuthStore").useAuthStore.getState()
        .authUser;

      if (
        message.receiverId === authUser.id ||
        message.senderId === authUser.id
      ) {
        const { selectedUser } = get();

        const isCurrentChat =
          selectedUser &&
          (message.senderId === selectedUser.id ||
            message.receiverId === selectedUser.id);

        if (isCurrentChat) {
          get().addMessage(message);
        } else {
          get().addMessage(message);
        }
      }
    });

    socket.on("reaction", (reaction: any) => {
      get().addReaction(reaction);
    });

    set({ isSubscribed: true });
  },

  resetUnreadCount: (userId: string) => {
    set((state) => {
      const newUnreadCounts = { ...state.unreadCounts };
      const newUnreadMessages = { ...state.unreadMessages };
      delete newUnreadCounts[userId];
      delete newUnreadMessages[userId];
      return {
        unreadCounts: newUnreadCounts,
        unreadMessages: newUnreadMessages,
      };
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = require("@/store/useAuthStore").useAuthStore.getState();
    if (socket) {
      socket.off("newMessage");
    }
    set({ isSubscribed: false });
  },

  sendFormattedMessage: async (
    content: string,
    replyToMessage: Message | null = null
  ) => {
    const { selectedUser, formatting } = get();
    const replyToMessageState = replyToMessage || get().replyToMessage;
    if (!selectedUser) throw new Error("No recipient selected.");

    const payload = {
      content,
      receiverId: selectedUser.id,
      fontSize: formatting.fontSize,
      bold: formatting.bold,
      italic: formatting.italic,
      underline: formatting.underline,
      unorderedList: formatting.unorderedList,
      orderedList: formatting.orderedList,
      linkTitle: formatting.linkTitle,
      linkTarget: formatting.linkTarget,
      imageName: formatting.imageName,
      imageUrl: formatting.imageUrl,
      codeLanguage: formatting.codeLanguage,
      codeContent: formatting.codeContent,
      replyToMessageId: replyToMessage?.id || null,
      replyToId: replyToMessageState?.id || null,
      replyToSenderId: replyToMessageState?.senderId || null,
      replyToContent:
        replyToMessageState?.text || replyToMessageState?.content || null,
    };

    set({ isMessageSending: true });

    try {
      const response = await api.post(
        `/messages/send/${selectedUser.id}`,
        payload
      );
      const newMessage = response.data;

      const { socket } =
        require("@/store/useAuthStore").useAuthStore.getState();

      if (socket && socket.connected) {
        socket.emit("newMessage", {
          ...newMessage,
          senderId: newMessage.senderId,
        });
      }
    } catch (error) {
      toast.error("Failed to sent message!");
    } finally {
      set({ isMessageSending: false });
    }
  },

  setTypingStatus: (userId, isTyping) => {
    const { socket } = require("@/store/useAuthStore").useAuthStore.getState();

    set((state) => ({
      typingStatus: {
        ...state.typingStatus,
        [userId]: isTyping,
      },
      users: state.users.map((user) =>
        user.id === userId ? { ...user, isTyping } : user
      ),
    }));

    if (socket?.connected) {
      socket.emit("typing", {
        receiverId: userId,
        isTyping,
      });
    }
  },

  incrementUnreadCount: (userId: string) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    }));
  },

  setUnreadCount: (userId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: count,
      },
    })),

  markMessagesAsRead: async (userId: string) => {
    try {
      const authUser = require("@/store/useAuthStore").useAuthStore.getState()
        .authUser;
      if (!authUser) return;

      await api.post(`/messages/mark-read/${userId}`);

      get().resetUnreadCount(userId);

      set((state) => {
        const now = new Date().toISOString();

        const updatedMessages = state.messages.map((msg) =>
          msg.senderId === userId && !msg.read
            ? { ...msg, read: true, readAt: now }
            : msg
        );

        const updatedUsers = state.users.map((u) =>
          u.id === userId
            ? {
                ...u,
                lastMessageSeen: true,
              }
            : u
        );

        return {
          messages: updatedMessages,
          users: updatedUsers,
        };
      });

      const { socket } =
        require("@/store/useAuthStore").useAuthStore.getState();

      if (socket?.connected) {
        socket.emit("markMessagesRead", {
          senderId: userId,
          receiverId: authUser.id,
        });
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  setSelectedUser: async (user: User) => {
    const {
      selectedUser,
      unsubscribeFromMessages,
      markMessagesAsRead,
      resetUnreadCount,
      getMessages,
      subscribeToMessages,
    } = get();

    if (selectedUser?.id === user.id) return;

    unsubscribeFromMessages();

    set({ selectedUser: user, messages: [] });

    await Promise.all([markMessagesAsRead(user.id), getMessages(user.id)]);

    resetUnreadCount(user.id);

    subscribeToMessages();
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
      formatting: { ...formatting, bold: true },
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
