import { io, type Socket } from "socket.io-client"
import { useAuthStore } from "@/store/useAuthStore"

interface SocketMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
}

interface TypingData {
  senderId: string
  receiverId: string
  isTyping: boolean
}

interface UserTypingData {
  senderId: string
  isTyping: boolean
}

interface MessageReadData {
  messageId: string
  senderId: string
}

interface MessageReadUpdate {
  messageId: string
  read: boolean
}

class SocketManager {
  private static instance: SocketManager
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectDelay = 2000
  private connectionPromise: Promise<Socket> | null = null
  private _isConnecting = false
  private connectionFailed = false

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  private getUserId(): string | null {
    const authUser = useAuthStore.getState().authUser
    return authUser?.id?.toString() || authUser?._id?.toString() || null
  }

  public async waitForConnection(): Promise<boolean> {
    if (this.socket?.connected) return true

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.socket?.connected) {
          clearInterval(checkInterval)
          resolve(true)
        }

        if (this.connectionFailed) {
          clearInterval(checkInterval)
          resolve(false)
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkInterval)
        resolve(false)
      }, 5000)
    })
  }

  async connect(): Promise<Socket> {
    const userId = this.getUserId()

    if (!userId) {
      throw new Error("Cannot connect: No authenticated user found")
    }

    if (this.connectionFailed) {
      this.resetConnectionState()
    }

    if (this.socket?.connected && this.getUserId() === userId) {
      return this.socket
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = this.createConnection(userId)

    try {
      const socket = await this.connectionPromise
      this.connectionFailed = false
      return socket
    } catch (error) {
      this.connectionFailed = true
      throw error
    } finally {
      this.connectionPromise = null
    }
  }

  private createConnection(userId: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001"

      this.socket = io(serverUrl, {
        query: { userId },
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
        autoConnect: true,
      })

      this.setupEventListeners()

      const connectionTimeout = setTimeout(() => {
        this._isConnecting = false
        if (this.socket) {
          this.socket.disconnect()
        }
        reject(new Error("Socket connection timeout - server may not be running"))
      }, 15000)

      this.socket.on("connect", () => {
        clearTimeout(connectionTimeout)
        this.reconnectAttempts = 0
        this._isConnecting = false
        console.log("✅ Socket connected successfully")
        resolve(this.socket!)
      })

      this.socket.on("connect_error", (error) => {
        clearTimeout(connectionTimeout)
        this.reconnectAttempts++
        this._isConnecting = false
        console.error("❌ Socket connection error:", error)

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error(`Failed to connect after ${this.maxReconnectAttempts} attempts: ${error.message}`))
        }
      })

      this._isConnecting = true
    })
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on("reconnect", (attemptNumber) => {
      this.connectionFailed = false
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts")
    })

    this.socket.on("reconnect_failed", () => {
      this.connectionFailed = true
      console.error("❌ Socket reconnection failed")
    })

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason)
    })
  }

  getSocket(): Socket | null {
    return this.socket
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.connectionPromise = null
    this._isConnecting = false
    this.connectionFailed = false
  }

  resetConnectionState(): void {
    this.connectionFailed = false
    this.reconnectAttempts = 0
  }

  async sendMessage(message: SocketMessage): Promise<void> {
    try {
      const userId = this.getUserId()
      if (!userId) {
        console.warn("📤❌ Cannot send message: No user ID")
        return
      }

      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("📤❌ Cannot send message: Socket not connected")
        return
      }

      console.log("📤 Sending message via socket:", message)
      socket.emit("sendMessage", message)
    } catch (error) {
      console.warn("📤💥 Failed to send message via socket:", error)
    }
  }

  async sendReaction(data: { messageId: string; reaction: any }): Promise<void> {
    try {
      console.log("🎭 SocketManager: Sending reaction via socket:", data)
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("🎭💥 Cannot send reaction: Socket not connected")
        return
      }

      socket.emit("reaction", data)
      console.log("🎭 SocketManager: Reaction emitted successfully")
    } catch (error) {
      console.warn("🎭💥 Failed to send reaction:", error)
    }
  }

  async onReaction(callback: (data: { messageId: string; reaction: any }) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) return false

      socket.on("reaction", callback)
      socket.on("reactionAdded", callback)
      console.log("🎭 SocketManager: Subscribed to reaction events")
      return true
    } catch (error) {
      console.warn("🎭💥 Failed to subscribe to reactions:", error)
      return false
    }
  }

  async setTypingStatus(data: TypingData): Promise<void> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("⌨️❌ Cannot set typing status: Socket not connected")
        return
      }

      console.log("⌨️ Setting typing status:", data)
      socket.emit("typing", data)
    } catch (error) {
      console.warn("⌨️💥 Failed to set typing status:", error)
    }
  }

  async markMessageAsRead(data: MessageReadData): Promise<void> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("👁️❌ Cannot mark message as read: Socket not connected")
        return
      }

      console.log("👁️ Marking message as read:", data)
      socket.emit("messageRead", data)
    } catch (error) {
      console.warn("👁️💥 Failed to mark message as read:", error)
    }
  }

  private async ensureConnection(): Promise<Socket | null> {
    const userId = this.getUserId()

    if (!userId) {
      console.warn("❌ Cannot ensure connection: No user ID")
      return null
    }

    if (this.socket?.connected) {
      return this.socket
    }

    if (this.connectionFailed) {
      console.warn("❌ Connection failed, not retrying")
      return null
    }

    if (this.connectionPromise) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Connection timeout")), 10000)
        })

        const socket = await Promise.race([this.connectionPromise, timeoutPromise])
        return socket
      } catch (error) {
        console.warn("💥 Connection attempt failed:", error)
        return null
      }
    }

    try {
      return await this.connect()
    } catch (error) {
      console.warn("🔄💥 Reconnection failed:", error)
      return null
    }
  }

  async onMessage(callback: (message: SocketMessage) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("📨❌ Cannot subscribe to messages: Socket not available")
        return false
      }
      socket.on("newMessage", callback)
      console.log("📨✅ Subscribed to new messages")
      return true
    } catch (error) {
      console.warn("📨💥 Failed to subscribe to messages:", error)
      return false
    }
  }

  async onTyping(callback: (data: UserTypingData) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("⌨️❌ Cannot subscribe to typing: Socket not available")
        return false
      }
      socket.on("userTyping", callback)
      console.log("⌨️✅ Subscribed to typing events")
      return true
    } catch (error) {
      console.warn("⌨️💥 Failed to subscribe to typing events:", error)
      return false
    }
  }

  async onMessageRead(callback: (data: MessageReadUpdate) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("👁️❌ Cannot subscribe to message read: Socket not available")
        return false
      }
      socket.on("messageReadUpdate", callback)
      console.log("👁️✅ Subscribed to message read events")
      return true
    } catch (error) {
      console.warn("👁️💥 Failed to subscribe to message read events:", error)
      return false
    }
  }

  async onOnlineUsers(callback: (users: string[]) => void): Promise<boolean> {
    try {
      const socket = await this.ensureConnection()
      if (!socket) {
        console.warn("👥❌ Cannot subscribe to online users: Socket not available")
        return false
      }
      socket.on("getOnlineUsers", (users) => {
        console.log("👥 Online users updated:", users)
        callback(users)
      })
      console.log("👥✅ Subscribed to online users events")
      return true
    } catch (error) {
      console.warn("👥💥 Failed to subscribe to online users:", error)
      return false
    }
  }

  // Remove event listeners
  offMessage(): void {
    if (!this.socket) return
    this.socket.off("newMessage")
  }

  offTyping(): void {
    if (!this.socket) return
    this.socket.off("userTyping")
  }

  offMessageRead(): void {
    if (!this.socket) return
    this.socket.off("messageReadUpdate")
  }

  offOnlineUsers(): void {
    if (!this.socket) return
    this.socket.off("getOnlineUsers")
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getIsConnecting(): boolean {
    return this._isConnecting
  }

  hasConnectionFailed(): boolean {
    return this.connectionFailed
  }

  getConnectionId(): string | undefined {
    return this.socket?.id
  }

  getCurrentUserId(): string | null {
    return this.getUserId()
  }

  getConnectionStatus(): {
    connected: boolean
    connecting: boolean
    failed: boolean
    id?: string
    serverUrl: string
    userId?: string
  } {
    const userId = this.getUserId()
    return {
      connected: this.socket?.connected || false,
      connecting: this._isConnecting,
      failed: this.connectionFailed,
      id: this.socket?.id,
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001",
      userId: userId || undefined,
    }
  }

  hasUserId(): boolean {
    return !!this.getUserId()
  }
}

export default SocketManager
