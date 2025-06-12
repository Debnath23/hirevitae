import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// Create Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users: { userId: socketId }
const userSocketMap = {};

// Helper function to get a user's socket ID
export function getReceiverSocketId(receiverId) {
  return userSocketMap[receiverId];
}

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Get userId from handshake query
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} is now online`);

    // Broadcast online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn("User connected without valid userId:", userId);
  }

  // Handle new message event
  socket.on("sendMessage", (message) => {
    console.log("New message:", message);

    try {
      const receiverSocketId = getReceiverSocketId(message.receiverId);

      if (receiverSocketId) {
        // Send message to specific user
        io.to(receiverSocketId).emit("newMessage", message);
        console.log(`Message sent to user ${message.receiverId}`);
      } else {
        console.log(`Receiver ${message.receiverId} is not online`);
      }
    } catch (error) {
      console.error("Error handling sendMessage:", error);
    }
  });

  // Handle typing status
  socket.on("typing", ({ senderId, receiverId, isTyping }) => {
    console.log(`User ${senderId} typing status: ${isTyping} to ${receiverId}`);

    try {
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          senderId,
          isTyping,
        });
      }
    } catch (error) {
      console.error("Error handling typing:", error);
    }
  });

  // Handle read receipts
  socket.on("messageRead", ({ messageId, senderId }) => {
    console.log(
      `Message ${messageId} read by user, notifying sender ${senderId}`
    );

    try {
      const senderSocketId = getReceiverSocketId(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageReadUpdate", {
          messageId,
          read: true,
        });
      }
    } catch (error) {
      console.error("Error handling messageRead:", error);
    }
  });

  // Handle room joining (for future group chat functionality)
  socket.on("joinRoom", (roomId) => {
    console.log(`User ${userId} joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("leaveRoom", (roomId) => {
    console.log(`User ${userId} leaving room ${roomId}`);
    socket.leave(roomId);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Find and remove user from online users
    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        console.log(`User ${key} is now offline`);
        break;
      }
    }

    // Broadcast updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// API routes
app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
