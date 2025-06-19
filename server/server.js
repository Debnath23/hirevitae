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

  // Set user online
  userSocketMap[userId] = {
    socketId: socket.id,
    isOnline: true,
  };

  // Emit updated online user list
  io.emit(
    "getOnlineUsers",
    Object.entries(userSocketMap).map(([id, data]) => ({
      userId: id,
      isOnline: data.isOnline,
      lastSeen: data.lastSeen,
    }))
  );

  // New message handler
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

  // Reaction handler
  socket.on("reaction", (reaction, receiverId) => {
    try {
      console.log("reaction", reaction);
      console.log("receiverId", receiverId);

      const senderSocketId = String(socket.handshake.query.userId);
      const receiverSocketId = getReceiverSocketId(receiverId);

      console.log("senderSocketId", senderSocketId);
      console.log("receiverSocketId", receiverSocketId);
      

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("reaction", reaction);
        console.log("Triggered");
        
      }

      if (senderSocketId && senderSocketId !== receiverSocketId) {
        io.to(senderSocketId).emit("reaction", reaction);
        console.log("Triggered 2");
      }
    } catch (error) {
      console.error("💥 Error handling reaction:", error);
    }
  });

  // Typing indicator
  socket.on("userTyping", ({ receiverId, isTyping, senderId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId,
        isTyping,
      });
    }
  });

  // Mark messages as read
  socket.on("markMessagesRead", async ({ senderId, receiverId }) => {
    try {

      console.log("senderId", senderId);
      console.log("receiverId", receiverId);

      const senderSocketId = getReceiverSocketId(senderId);
      const receiverSocketId = getReceiverSocketId(receiverId);

      console.log("senderSocketId", senderSocketId);
      console.log("receiverSocketId", receiverSocketId);

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

  // Optional: Client manually disconnects
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

  // Socket disconnect handler
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

  // Log socket errors
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
