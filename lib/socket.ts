import { io, type Socket } from "socket.io-client";
import type {
  SocketMessage,
  TypingData,
  MessageReadData,
  MessageReadUpdate,
  UserTypingData,
} from "@/types/socket";
import { useAuthStore } from "@/store/useAuthStore";

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private connectionPromise: Promise<Socket> | null = null;
  private _isConnecting = false;
  private connectionFailed = false;

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private getUserId(): string | null {
    const authUser = useAuthStore.getState().authUser;
    return authUser?.id || null;
  }

  public async waitForConnection(): Promise<boolean> {
    if (this.socket?.connected) return true;

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.socket?.connected) {
          clearInterval(checkInterval);
          resolve(true);
        }

        if (this.connectionFailed) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 5000);
    });
  }

  async connect(): Promise<Socket> {
    const userId = this.getUserId();

    if (!userId) {
      throw new Error("Cannot connect: No authenticated user found");
    }

    if (this.connectionFailed) {
      this.resetConnectionState();
    }

    if (this.socket?.connected && this.getUserId() === userId) {
      return this.socket;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.createConnection(userId);

    try {
      const socket = await this.connectionPromise;
      this.connectionFailed = false;
      return socket;
    } catch (error) {
      this.connectionFailed = true;
      throw error;
    } finally {
      this.connectionPromise = null;
    }
  }

  private createConnection(userId: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }

      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

      this.socket = io(serverUrl, {
        query: { userId },
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
        autoConnect: true,
      });

      this.setupEventListeners();

      const connectionTimeout = setTimeout(() => {
        this._isConnecting = false;
        if (this.socket) {
          this.socket.disconnect();
        }
        reject(
          new Error("Socket connection timeout - server may not be running")
        );
      }, 15000);

      this.socket.on("connect", () => {
        clearTimeout(connectionTimeout);
        this.reconnectAttempts = 0;
        this._isConnecting = false;
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (error) => {
        clearTimeout(connectionTimeout);
        this.reconnectAttempts++;
        this._isConnecting = false;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(
            new Error(
              `Failed to connect after ${this.maxReconnectAttempts} attempts: ${error.message}`
            )
          );
        }
      });

      this._isConnecting = true;
    });
  }

  private async testServerConnection(serverUrl: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${serverUrl}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      try {
        const basicResponse = await fetch(serverUrl, {
          method: "GET",
          mode: "no-cors",
        });
        return true;
      } catch (basicError) {
        return false;
      }
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // this.socket.on("disconnect", (reason) => {
    //   console.log("🔌❌ Socket disconnected:", reason);
    //   if (reason === "io server disconnect") {
    //     console.log("🖥️ Server initiated disconnect");
    //   }
    // });

    this.socket.on("reconnect", (attemptNumber) => {
      this.connectionFailed = false;
    });

    // this.socket.on("reconnect_attempt", (attemptNumber) => {
    //   console.log("🔄🔄 Socket reconnection attempt", attemptNumber);
    // });

    // this.socket.on("reconnect_error", (error) => {
    //   console.error("🔄❌ Socket reconnection error:", error);
    // });

    this.socket.on("reconnect_failed", () => {
      this.connectionFailed = true;
    });

    // Add debug event listeners
    // this.socket.onAny((eventName, ...args) => {
    //   console.log("📡⬇️ Socket event received:", eventName, args);
    // });

    // this.socket.onAnyOutgoing((eventName, ...args) => {
    //   console.log("📡⬆️ Socket event sent:", eventName, args);
    // });
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionPromise = null;
    this._isConnecting = false;
    this.connectionFailed = false;
  }

  resetConnectionState(): void {
    this.connectionFailed = false;
    this.reconnectAttempts = 0;
  }

  async sendMessage(message: SocketMessage): Promise<void> {
    try {
      const userId = this.getUserId();
      if (!userId) {
        return;
      }

      const socket = await this.ensureConnection();
      if (!socket) {
        return;
      }
      socket.emit("sendMessage", message);
    } catch (error) {
      console.warn("📤💥 Failed to send message via socket:", error);
    }
  }

  async setTypingStatus(data: TypingData): Promise<void> {
    try {
      const socket = await this.ensureConnection();
      if (!socket) {
        return;
      }
      socket.emit("typing", data);
    } catch (error) {
      console.warn("⌨️💥 Failed to set typing status:", error);
    }
  }

  async markMessageAsRead(data: MessageReadData): Promise<void> {
    try {
      const socket = await this.ensureConnection();
      if (!socket) {
        return;
      }
      socket.emit("messageRead", data);
    } catch (error) {
      console.warn("👁️💥 Failed to mark message as read:", error);
    }
  }

  private async ensureConnection(): Promise<Socket | null> {
    const userId = this.getUserId();

    if (!userId) {
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.connectionFailed) {
      return null;
    }

    if (this.connectionPromise) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Connection timeout")), 10000);
        });

        const socket = await Promise.race([
          this.connectionPromise,
          timeoutPromise,
        ]);
        return socket;
      } catch (error) {
        console.warn("💥 Connection attempt failed:", error);
        return null;
      }
    }

    try {
      return await this.connect();
    } catch (error) {
      console.warn("🔄💥 Reconnection failed:", error);
      return null;
    }
  }

  async onMessage(
    callback: (message: SocketMessage) => void
  ): Promise<boolean> {
    try {
      const socket = await this.ensureConnection();
      if (!socket) {
        console.warn("📨❌ Cannot subscribe to messages: Socket not available");
        return false;
      }
      socket.on("newMessage", callback);
      return true;
    } catch (error) {
      console.warn("📨💥 Failed to subscribe to messages:", error);
      return false;
    }
  }

  async onTyping(callback: (data: UserTypingData) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection();
      if (!socket) {
        return false;
      }
      socket.on("userTyping", callback);
      return true;
    } catch (error) {
      console.warn("⌨️💥 Failed to subscribe to typing events:", error);
      return false;
    }
  }

  async onMessageRead(
    callback: (data: MessageReadUpdate) => void
  ): Promise<boolean> {
    try {
      const socket = await this.ensureConnection();
      if (!socket) {
        return false;
      }
      socket.on("messageReadUpdate", callback);
      return true;
    } catch (error) {
      console.warn("👁️💥 Failed to subscribe to message read events:", error);
      return false;
    }
  }

  async onOnlineUsers(callback: (users: string[]) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection();
      if (!socket) {
        return false;
      }
      socket.on("getOnlineUsers", callback);
      return true;
    } catch (error) {
      console.warn("👥💥 Failed to subscribe to online users:", error);
      return false;
    }
  }

  // Remove event listeners
  offMessage(): void {
    if (!this.socket) return;
    this.socket.off("newMessage");
  }

  offTyping(): void {
    if (!this.socket) return;
    this.socket.off("userTyping");
  }

  offMessageRead(): void {
    if (!this.socket) return;
    this.socket.off("messageReadUpdate");
  }

  offOnlineUsers(): void {
    if (!this.socket) return;
    this.socket.off("getOnlineUsers");
  }

  // Check connection status
  isConnected(): boolean {
    const connected = this.socket?.connected || false;
    return connected;
  }

  // Check if currently connecting
  getIsConnecting(): boolean {
    return this._isConnecting;
  }

  // Check if connection failed
  hasConnectionFailed(): boolean {
    return this.connectionFailed;
  }

  // Get connection ID
  getConnectionId(): string | undefined {
    return this.socket?.id;
  }

  // Get current userId from store
  getCurrentUserId(): string | null {
    return this.getUserId();
  }

  // Get detailed connection status
  getConnectionStatus(): {
    connected: boolean;
    connecting: boolean;
    failed: boolean;
    id?: string;
    serverUrl: string;
    userId?: string;
  } {
    const userId = this.getUserId();
    const status = {
      connected: this.socket?.connected || false,
      connecting: this._isConnecting,
      failed: this.connectionFailed,
      id: this.socket?.id,
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001",
      userId: userId || undefined,
    };
    return status;
  }

  hasUserId(): boolean {
    return !!this.getUserId();
  }
}

export default SocketManager;
