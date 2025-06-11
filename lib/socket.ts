import { io, type Socket } from "socket.io-client"

class SocketManager {
  private socket: Socket | null = null
  private static instance: SocketManager

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  connect(userId: string): Socket {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001", {
        query: { userId },
      })
    }
    return this.socket
  }

  getSocket(): Socket | null {
    return this.socket
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default SocketManager
