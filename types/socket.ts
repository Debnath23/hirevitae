export interface SocketMessage {
  id: string;
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  formatting?: any;
  reactions?: any[];
  createdAt: string;
  image?: string;
  read?: boolean;
}

export interface TypingData {
  senderId: string;
  receiverId: string;
  isTyping: boolean;
}

export interface MessageReadData {
  messageId: string;
  senderId: string;
}

export interface MessageReadUpdate {
  messageId: string;
  read: boolean;
}

export interface UserTypingData {
  senderId: string;
  isTyping: boolean;
}

export interface SocketEvents {
  // Client to server events
  sendMessage: (message: SocketMessage) => void;
  typing: (data: TypingData) => void;
  messageRead: (data: MessageReadData) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;

  // Server to client events
  newMessage: (message: SocketMessage) => void;
  userTyping: (data: UserTypingData) => void;
  messageReadUpdate: (data: MessageReadUpdate) => void;
  getOnlineUsers: (users: string[]) => void;
}
