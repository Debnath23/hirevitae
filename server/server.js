import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const userSocketMap = {};

function getReceiverSocketId(receiverId) {
  return userSocketMap[receiverId]?.socketId;
}

io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId);

  if (!userId || userId === "undefined") {
    socket.disconnect();
    return;
  }

  userSocketMap[userId] = {
    socketId: socket.id,
    isOnline: true,
  };

  io.emit(
    "getOnlineUsers",
    Object.entries(userSocketMap).map(([id, data]) => ({
      userId: id,
      isOnline: data.isOnline,
      lastSeen: data.lastSeen,
    }))
  );

  socket.on("newMessage", (message) => {
    try {
      const receiverSocketId = getReceiverSocketId(String(message.receiverId));
      const senderSocketId = getReceiverSocketId(String(userId));

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      } else {
        console.log(`📨 Receiver ${message.receiverId} is not online`);
      }

      if (senderSocketId && senderSocketId !== receiverSocketId) {
        io.to(senderSocketId).emit("newMessage", message);
      }
    } catch (error) {
      console.error("💥 Error handling newMessage:", error);
    }
  });

  socket.on("addReaction", (reaction, receiverId) => {
    try {
      const senderSocketId = socket.id;
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("reaction", reaction);
      }

      if (senderSocketId && senderSocketId !== receiverSocketId) {
        io.to(senderSocketId).emit("reaction", reaction);
      }
    } catch (error) {
      console.error("💥 Error handling reaction:", error);
    }
  });

  socket.on("userTyping", ({ receiverId, isTyping, senderId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId,
        isTyping,
      });
    }
  });

  socket.on("markMessagesRead", async ({ senderId, receiverId }) => {
    try {
      const senderSocketId = getReceiverSocketId(senderId);
      const receiverSocketId = getReceiverSocketId(receiverId);

      const payload = {
        readAt: new Date().toISOString(),
      };

      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", {
          receiverId,
          ...payload,
        });
      }

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messagesRead", {
          senderId,
          ...payload,
        });
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("setOffline", () => {
    const userData = userSocketMap[userId];
    if (userData) {
      userSocketMap[userId] = {
        ...userData,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      };

      io.emit(
        "getOnlineUsers",
        Object.entries(userSocketMap).map(([id, data]) => ({
          userId: id,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen,
        }))
      );
    }
  });

  socket.on("disconnect", () => {
    const userData = userSocketMap[userId];

    if (userData && userData.socketId === socket.id) {
      userSocketMap[userId] = {
        ...userData,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      };

      io.emit(
        "getOnlineUsers",
        Object.entries(userSocketMap).map(([id, data]) => ({
          userId: id,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen,
        }))
      );
    }
  });

  socket.on("error", (error) => {
    console.error(`💥 Socket error for user ${userId}:`, error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});

export { io, getReceiverSocketId };
