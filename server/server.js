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

// import express from "express"
// import http from "http"
// import { Server } from "socket.io"
// import cors from "cors"
// import dotenv from "dotenv"
// import { PrismaClient } from "@prisma/client"

// dotenv.config()

// const app = express()
// app.use(cors())
// app.use(express.json())

// const server = http.createServer(app)
// const prisma = new PrismaClient()

// // Create Socket.IO server with CORS configuration
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// })

// // Store online users: { userId: socketId }
// const userSocketMap = {}

// // Helper function to get a user's socket ID
// export function getReceiverSocketId(receiverId) {
//   return userSocketMap[receiverId]
// }

// // Helper function to update user online status in database
// async function updateUserOnlineStatus(userId, isOnline) {
//   try {
//     await prisma.user.update({
//       where: { id: Number.parseInt(userId) },
//       data: {
//         online: isOnline ? 1 : 0,
//         socket_ids: isOnline ? JSON.stringify([userSocketMap[userId]]) : null,
//       },
//     })
//     console.log(`Updated user ${userId} online status to ${isOnline}`)
//   } catch (error) {
//     console.error(`Error updating user ${userId} online status:`, error)
//   }
// }

// // Helper function to get all online users from database
// async function getOnlineUsersFromDB() {
//   try {
//     const onlineUsers = await prisma.user.findMany({
//       where: { online: 1 },
//       select: { id: true },
//     })
//     return onlineUsers.map((user) => user.id.toString())
//   } catch (error) {
//     console.error("Error fetching online users from DB:", error)
//     return []
//   }
// }

// // Socket.IO connection handler
// io.on("connection", async (socket) => {
//   console.log("A user connected:", socket.id)

//   // Get userId from handshake query
//   const userId = socket.handshake.query.userId

//   if (userId && userId !== "undefined") {
//     userSocketMap[userId] = socket.id
//     console.log(`User ${userId} is now online with socket ${socket.id}`)

//     // Update database with online status
//     await updateUserOnlineStatus(userId, true)

//     // Get updated online users list from database
//     const onlineUsers = await getOnlineUsersFromDB()
//     console.log("Online users from DB:", onlineUsers)

//     // Broadcast online users to all connected clients
//     io.emit("getOnlineUsers", onlineUsers)
//   } else {
//     console.warn("User connected without valid userId:", userId)
//   }

//   // Handle new message event
//   socket.on("sendMessage", async (message) => {
//     console.log("New message:", message)

//     try {
//       const receiverSocketId = getReceiverSocketId(message.receiverId)

//       if (receiverSocketId) {
//         // Send message to specific user
//         io.to(receiverSocketId).emit("newMessage", message)
//         console.log(`Message sent to user ${message.receiverId}`)
//       } else {
//         console.log(`Receiver ${message.receiverId} is not online`)
//       }

//       // Also emit to sender for confirmation
//       socket.emit("messageSent", { messageId: message.id, status: "delivered" })
//     } catch (error) {
//       console.error("Error handling sendMessage:", error)
//     }
//   })

// //   socket.on("sendMessage", async (message) => {
// //   console.log("New message:", message);

// //   try {
// //     const receiverSocketId = getReceiverSocketId(message.receiverId);

// //     if (receiverSocketId) {
// //       // Send only to receiver
// //       io.to(receiverSocketId).emit("newMessage", message);
// //       console.log(`Message sent to user ${message.receiverId}`);
// //     }

// //     // Emit to sender separately to confirm delivery
// //     socket.emit("messageSent", message);
// //   } catch (error) {
// //     console.error("Error handling sendMessage:", error);
// //   }
// // });


//   // Handle typing status
//   socket.on("typing", ({ senderId, receiverId, isTyping }) => {
//     console.log(`User ${senderId} typing status: ${isTyping} to ${receiverId}`)

//     try {
//       const receiverSocketId = getReceiverSocketId(receiverId)

//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("userTyping", {
//           senderId,
//           isTyping,
//         })
//         console.log(`Typing status sent to user ${receiverId}`)
//       } else {
//         console.log(`Receiver ${receiverId} is not online for typing status`)
//       }
//     } catch (error) {
//       console.error("Error handling typing:", error)
//     }
//   })

//   // Handle read receipts
//   socket.on("messageRead", async ({ messageId, senderId }) => {
//     console.log(`Message ${messageId} read by user, notifying sender ${senderId}`)

//     try {
//       // Update message as read in database
//       await prisma.message.update({
//         where: { id: Number.parseInt(messageId) },
//         data: { seen: 1 },
//       })

//       const senderSocketId = getReceiverSocketId(senderId)

//       if (senderSocketId) {
//         io.to(senderSocketId).emit("messageReadUpdate", {
//           messageId,
//           read: true,
//         })
//         console.log(`Read receipt sent to sender ${senderId}`)
//       } else {
//         console.log(`Sender ${senderId} is not online for read receipt`)
//       }
//     } catch (error) {
//       console.error("Error handling messageRead:", error)
//     }
//   })

//   // Handle reactions
//   socket.on("reaction", (data) => {
//     console.log("Reaction received:", data)

//     try {
//       // Broadcast reaction to all users in the conversation
//       socket.broadcast.emit("reactionAdded", data)
//     } catch (error) {
//       console.error("Error handling reaction:", error)
//     }
//   })

//   // Handle room joining (for future group chat functionality)
//   socket.on("joinRoom", (roomId) => {
//     console.log(`User ${userId} joining room ${roomId}`)
//     socket.join(roomId)
//   })

//   socket.on("leaveRoom", (roomId) => {
//     console.log(`User ${userId} leaving room ${roomId}`)
//     socket.leave(roomId)
//   })

//   // Handle disconnect
//   socket.on("disconnect", async () => {
//     console.log("A user disconnected:", socket.id)

//     // Find and remove user from online users
//     let disconnectedUserId = null
//     for (const [key, value] of Object.entries(userSocketMap)) {
//       if (value === socket.id) {
//         disconnectedUserId = key
//         delete userSocketMap[key]
//         console.log(`User ${key} is now offline`)
//         break
//       }
//     }

//     // Update database with offline status
//     if (disconnectedUserId) {
//       await updateUserOnlineStatus(disconnectedUserId, false)
//     }

//     // Get updated online users list from database
//     const onlineUsers = await getOnlineUsersFromDB()
//     console.log("Updated online users after disconnect:", onlineUsers)

//     // Broadcast updated online users
//     io.emit("getOnlineUsers", onlineUsers)
//   })
// })

// // API routes
// app.get("/", (req, res) => {
//   res.send("Socket.IO server is running")
// })

// app.get("/health", (req, res) => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() })
// })

// // API route to get online users
// app.get("/api/online-users", async (req, res) => {
//   try {
//     const onlineUsers = await getOnlineUsersFromDB()
//     res.json({ onlineUsers })
//   } catch (error) {
//     console.error("Error fetching online users:", error)
//     res.status(500).json({ error: "Failed to fetch online users" })
//   }
// })

// // Graceful shutdown
// process.on("SIGTERM", async () => {
//   console.log("SIGTERM received, shutting down gracefully")

//   // Set all users offline
//   try {
//     await prisma.user.updateMany({
//       data: { online: 0, socket_ids: null },
//     })
//     console.log("All users set to offline")
//   } catch (error) {
//     console.error("Error setting users offline:", error)
//   }

//   await prisma.$disconnect()
//   server.close(() => {
//     console.log("Server closed")
//     process.exit(0)
//   })
// })

// // Start server
// const PORT = process.env.PORT || 3001
// server.listen(PORT, () => {
//   console.log(`Socket.IO server running on port ${PORT}`)
// })
