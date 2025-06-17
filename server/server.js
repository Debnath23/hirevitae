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

  userSocketMap[userId] = socket.id;

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

  socket.on("typing", ({ receiverId, isTyping }) => {
    try {
      const senderId = String(socket.handshake.query.userId);
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          senderId,
          isTyping,
        });
      }
    } catch (error) {
      console.error("💥 Error handling typing:", error);
    }
  });

  socket.on("markMessagesRead", async ({ senderId, receiverId }) => {
    try {
      console.log(`Messages from ${senderId} to ${receiverId} marked as read`);

      // Notify both parties about the read status
      const senderSocketId = getReceiverSocketId(senderId);
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", {
          receiverId,
          readAt: new Date().toISOString(),
        });
      }

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messagesRead", {
          senderId,
          readAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    if (userSocketMap[userId] === socket.id) {
      userSocketMap[userId].isOnline = false;

      delete userSocketMap[userId];

      io.emit(
        "getOnlineUsers",
        Object.entries(userSocketMap).map(([id, data]) => ({
          userId: id,
          isOnline: data.isOnline,
        }))
      );
    }
  });

  socket.on("error", (error) => {
    console.error(`💥 Socket error for user ${userId}:`, error);
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    onlineUsers: Object.keys(userSocketMap).length,
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

export { io, getReceiverSocketId };
