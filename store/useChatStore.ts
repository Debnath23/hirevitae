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

interface Message {
  id: string;
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
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

  // Actions
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  addMessage: (message: any) => void;
  sendFormattedMessage: (
    content: string,
    replyToMessage?: Message | null
  ) => Promise<void>;
  setSelectedUser: (user: User) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;

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
  isUsersLoading: false,
  isMessagesLoading: false,
  replyToMessage: null,
  isMessageSending: false,
  isSubscribed: false,

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
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  subscribeToMessages: () => {
    const { socket } = require("@/store/useAuthStore").useAuthStore.getState();
    const { selectedUser, isSubscribed } = get();

    const hasSelectedUser = !!selectedUser;
    const hasSocket = !!socket;
    const hasAuthUser =
      !!require("@/store/useAuthStore").useAuthStore.getState().authUser;
    const socketConnected = socket?.connected;

    console.log("Subscription conditions:", {
      isSubscribed,
      hasSelectedUser,
      hasSocket,
      hasAuthUser,
      socketConnected,
    });

    if (
      isSubscribed ||
      !hasSelectedUser ||
      !hasSocket ||
      !hasAuthUser ||
      !socketConnected
    ) {
      console.log("Subscription conditions not met:", {
        isSubscribed,
        hasSelectedUser,
        hasSocket,
        hasAuthUser,
        socketConnected,
      });
      return;
    }

    // Listen for incoming messages
    socket.on("newMessage", (message: Message) => {
      console.log("📥 Received new message via socket:", message);
      get().addMessage(message);
    });

    set({ isSubscribed: true });
    console.log("✅ Message subscription set up successfully");
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
          receiverId: selectedUser.id,
        });
      }
    } catch (error) {
      console.error("Error sending formatted message:", error);
    }
  },

  setSelectedUser: (user: User) => {
    const currentUser = get().selectedUser;

    // If switching users, unsubscribe from current and subscribe to new
    if (currentUser?.id !== user.id) {
      get().unsubscribeFromMessages();
      set({ selectedUser: user, messages: [] });

      // Small delay to ensure clean state transition
      setTimeout(() => {
        get().subscribeToMessages();
      }, 100);
    }

    console.log("Selected user changed to:", user);
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
