// import { useChatStore } from "@/store/useChatStore";
// import Image from "next/image";
// import React, { useEffect } from "react";
// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { Plus, Filter, Search, SeenCheckmark } from "@/public/icons/index";
// import { Input } from "../ui/input";

// export default function MessagesSection() {
//   const {
//     getUsers,
//     users,
//     selectedUser,
//     setSelectedUser,
//     isUsersLoading,
//     getMessages,
//   } = useChatStore();

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);
//   return (
//     <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
//       {/* Messages Header */}
//       <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-[800] text-[#1E293B]">Messages</h1>
//           <Badge className="bg-[#FFF1F2] text-[#F43F5E] border border-[#FFE4E6] rounded-full px-2 py-1 text-sm">
//             25
//           </Badge>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="ghost" size="icon" className="cursor-pointer">
//             <Image src={Plus} width={24} height={24} alt="plus" />
//           </Button>
//           <Button variant="ghost" size="icon" className="cursor-pointer">
//             <Image src={Filter} width={24} height={24} alt="filter" />
//           </Button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 bg-[#EEF2FF] border-b border-[#CBD5E1]">
//         <div className="relative">
//           <Image
//             src={Search}
//             width={20}
//             height={20}
//             alt="search"
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
//           />
//           <Input
//             type="text"
//             placeholder="Search..."
//             className="pl-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-full h-12 text-[#475569] text-base font-[500]"
//           />
//         </div>
//       </div>

//       {/* Conversations List */}
//       <div className="flex-1 overflow-y-auto hide-scrollbar">
//         {users.map((user: any) => (
//           <div
//             key={user.id}
//             className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
//               user?.online && user?.unread > 0
//                 ? " border-l-2 border-l-[#6e6af0]"
//                 : "bg-[#FFFFFF]"
//             } ${
//                 selectedUser?.id === user.id
//                   ? "border-l-2 border-l-[#6e6af0]"
//                   : "bg-[#FFFFFF]"
//               }`}
//             onClick={() => setSelectedUser(user)}
//           >
//             {/* Avatar */}
//             <div className="relative mr-3">
//               <Image
//                 src={user?.avatar || "/images/avatar-47.png"}
//                 alt={user.name}
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               {user?.online ? (
//                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
//               ) : (
//                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#CBD5E1] border-2 border-white rounded-full"></div>
//               )}
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between mb-1">
//                 <h3 className="font-[700] text-[#1E293B] truncate text-base">
//                   {user.name}
//                 </h3>
//                 <span className="text-xs text-[##5F5F5F] ml-2 font-[400]">
//                   {user?.time}
//                   12:25
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p
//                   className={`truncate ${
//                     user?.isTyping
//                       ? "text-[#24D059] font-[400] text-xs"
//                       : "text-[#475569] text-sm font-[500]"
//                   }`}
//                 >
//                   {user?.message}
//                   Enter your message description he...
//                 </p>
//                 <div className="flex items-center space-x-2 ml-2">
//                   {user?.hasCheckmark && (
//                     <div className="text-[#22c55e]">
//                       <Image
//                         src={SeenCheckmark}
//                         width={20}
//                         height={20}
//                         alt="seen-checkmark"
//                       />
//                     </div>
//                   )}
//                   {user?.unread > 0 && (
//                     <Badge
//                       className={`${
//                         user?.online
//                           ? "bg-[#4F46E5] text-white"
//                           : "bg-[#E2E8F0] text-black"
//                       } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center`}
//                     >
//                       {user?.unread}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client"

import { useChatStore } from "@/store/useChatStore"
import Image from "next/image"
import { useEffect } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Plus, Filter, Search, SeenCheckmark } from "@/public/icons/index"
import { Input } from "../ui/input"
import formatMessageTime from "@/lib/format-message-time"

export default function MessagesSection() {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getMessages,
    onlineUsers,
    typingUsers,
    isUserOnline,
    getTypingUsers,
    messages,
  } = useChatStore()

  useEffect(() => {
    getUsers()
  }, [getUsers])

  // Helper function to get the last message for a user
  const getLastMessage = (userId: string) => {
    const userMessages = messages.filter((msg) => msg.senderId === userId || msg.receiverId === userId)
    return userMessages[userMessages.length - 1]
  }

  // Helper function to get unread message count for a user
  const getUnreadCount = (userId: string) => {
    return messages.filter((msg) => msg.senderId === userId && !msg.read).length
  }

  // Helper function to check if user is typing
  const isUserTyping = (userId: string) => {
    return typingUsers.some((typingUser) => typingUser.userId === userId && typingUser.isTyping)
  }

  // Helper function to format time
  const formatTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  // Helper function to truncate message
  const truncateMessage = (text: string, maxLength = 35) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

   if (isUsersLoading) {
    return (
      <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
        {/* Loading Header */}
        <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Loading Search Bar */}
        <div className="px-6 py-4 bg-[#EEF2FF] border-b border-[#CBD5E1] animate-pulse">
          <div className="h-12 bg-gray-200 rounded-full"></div>
        </div>

        {/* Loading Online Status */}
        <div className="px-6 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Loading Conversation List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-[#f2f2f9] animate-pulse">
              <div className="flex items-center space-x-3">
                {/* Avatar Skeleton */}
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                
                {/* Content Skeleton */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
      {/* Messages Header */}
      <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-[800] text-[#1E293B]">Messages</h1>
          <Badge className="bg-[#FFF1F2] text-[#F43F5E] border border-[#FFE4E6] rounded-full px-2 py-1 text-sm">
            {/* {users.length}  */}
            {/* == here must be the number of messages are unread for the user */}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Image src={Plus || "/placeholder.svg"} width={24} height={24} alt="plus" />
          </Button>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Image src={Filter || "/placeholder.svg"} width={24} height={24} alt="filter" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-[#EEF2FF] border-b border-[#CBD5E1]">
        <div className="relative">
          <Image
            src={Search || "/placeholder.svg"}
            width={20}
            height={20}
            alt="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
          />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-full h-12 text-[#475569] text-base font-[500]"
          />
        </div>
      </div>

      {/* Online Users Count */}
      {/* <div className="px-6 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
          <span className="text-sm text-[#475569] font-[500]">{onlineUsers.length} online</span>
        </div>
      </div> */}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {users.map((user: any) => {
          const lastMessage = getLastMessage(user.id)
          const unreadCount = getUnreadCount(user.id)
          const userIsOnline = isUserOnline(user.id)
          const userIsTyping = isUserTyping(user.id)
          const isSelected = selectedUser?.id === user.id

          return (
            <div
              key={user.id}
              className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
                userIsOnline && unreadCount > 0 ? "border-l-2 border-l-[#6e6af0]" : "bg-[#FFFFFF]"
              } ${isSelected ? "border-l-2 border-l-[#6e6af0] bg-[#f8fafc]" : "bg-[#FFFFFF]"}`}
              onClick={() => setSelectedUser(user)}
            >
              {/* Avatar */}
              <div className="relative mr-3">
                <Image
                  src={user?.avatar || "/images/avatar.png"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                {/* Online Status Indicator */}
                {userIsOnline ? (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#CBD5E1] border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-[700] text-[#1E293B] truncate text-base">{user.name}</h3>
                    {userIsOnline && <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>}
                  </div>
                  <span className="text-xs text-[#5F5F5F] ml-2 font-[400]">
                    {lastMessage ? formatMessageTime(lastMessage.createdAt) : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {userIsTyping ? (
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-[#24D059] rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-[#24D059] rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-[#24D059] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-[#24D059] font-[400] text-xs ml-2">typing...</span>
                      </div>
                    ) : (
                      <p className="text-[#475569] text-sm font-[500] truncate">
                        {lastMessage
                          ? truncateMessage(lastMessage.text || lastMessage.content || "")
                          : "No messages yet"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {lastMessage && lastMessage.read && (
                      <div className="text-[#22c55e]">
                        <Image src={SeenCheckmark || "/placeholder.svg"} width={16} height={16} alt="seen-checkmark" />
                      </div>
                    )}
                    {unreadCount > 0 && (
                      <Badge
                        className={`${
                          userIsOnline ? "bg-[#4F46E5] text-white" : "bg-[#E2E8F0] text-[#475569]"
                        } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {users.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-[#1E293B] mb-2">No conversations</h3>
              <p className="text-[#475569] text-sm">Start a new conversation to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Typing Users Summary (if any) */}
      {getTypingUsers().length > 0 && (
        <div className="px-6 py-2 bg-[#F0FDF4] border-t border-[#E2E8F0]">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"></div>
              <div
                className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-sm text-[#22C55E] font-[500]">
              {getTypingUsers().length === 1
                ? `${getTypingUsers()[0].userName} is typing...`
                : `${getTypingUsers().length} people are typing...`}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// "use client"

// import { useChatStore } from "@/store/useChatStore"
// import { useAuthStore } from "@/store/useAuthStore"
// import Image from "next/image"
// import { useEffect, useState } from "react"
// import { Badge } from "../ui/badge"
// import { Button } from "../ui/button"
// import { Plus, Filter, Search, SeenCheckmark } from "@/public/icons/index"
// import { Input } from "../ui/input"
// import formatMessageTime from "@/lib/format-message-time"

// export default function MessagesSection() {
//   const {
//     getUsers,
//     users,
//     selectedUser,
//     setSelectedUser,
//     isUsersLoading,
//     getMessages,
//     onlineUsers,
//     typingUsers,
//     initializeSocket,
//     subscribeToMessages,
//     socketConnected,
//     socketConnecting,
//     socketError,
//     retrySocketConnection,
//   } = useChatStore()

//   const { authUser, checkAuth} = useAuthStore()
//   const [searchTerm, setSearchTerm] = useState("")

//   // Helper function to normalize user ID for comparison
//   const normalizeId = (id: any): string => {
//     if (id === null || id === undefined) return ""
//     return id.toString()
//   }

//   // Initialize socket and load data when component mounts
//   useEffect(() => {
//     checkAuth()
//     const initializeApp = async () => {
//       if (authUser?.id) {
//         console.log("🚀 Initializing app for user:", authUser.id)

//         // 1. Initialize socket connection first
//         await initializeSocket(authUser.id.toString())

//         // 2. Load users (which includes last message data)
//         await getUsers()

//         console.log("✅ App initialization complete")
//       }
//     }

//     initializeApp()
//   }, [authUser?.id, initializeSocket, getUsers])

//   // Subscribe to socket events when socket is connected
//   useEffect(() => {
//     if (authUser?.id && socketConnected) {
//       console.log("📡 Socket connected, subscribing to events")
//       subscribeToMessages()
//     }
//   }, [authUser?.id, socketConnected, subscribeToMessages])

//   // Helper function to check if user is online
//   const checkUserOnline = (userId: string) => {
//     const normalizedUserId = normalizeId(userId)
//     const isOnline = onlineUsers.includes(normalizedUserId)
//     console.log(`🟢 User ${normalizedUserId} online status:`, isOnline, "Online users:", onlineUsers)
//     return isOnline
//   }

//   // Helper function to check if user is typing
//   const isUserTyping = (userId: string) => {
//     const normalizedUserId = normalizeId(userId)
//     const typing = typingUsers.some((typingUser) => {
//       const normalizedTypingUserId = normalizeId(typingUser.userId)
//       return normalizedTypingUserId === normalizedUserId && typingUser.isTyping
//     })
//     console.log(`⌨️ User ${normalizedUserId} typing status:`, typing)
//     return typing
//   }

//   // Helper function to get unread count for a user
//   const getUnreadCount = (user: any) => {
//     const normalizedAuthId = normalizeId(authUser?.id)
//     const normalizedUserId = normalizeId(user.id)
//     const normalizedSenderId = normalizeId(user.lastMessageSenderId)

//     // If there's no last message, no unread count
//     if (!user.lastMessage) return 0

//     // If the last message was sent by the current user, no unread count
//     if (normalizedSenderId === normalizedAuthId) return 0

//     // If the last message was sent by the other user and not seen, it's unread
//     if (normalizedSenderId === normalizedUserId && user.lastMessageSeen === 0) {
//       console.log(`📊 User ${normalizedUserId} has 1 unread message`)
//       return 1
//     }

//     console.log(`📊 User ${normalizedUserId} has 0 unread messages`)
//     return 0
//   }

//   // Helper function to truncate message
//   const truncateMessage = (text: string, maxLength = 35) => {
//     if (!text) return ""
//     return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
//   }

//   // Filter users based on search term
//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   // Calculate total unread messages across all users
//   const totalUnreadMessages = filteredUsers.reduce((total, user) => {
//     const unreadCount = getUnreadCount(user)
//     return total + unreadCount
//   }, 0)

//   console.log("📈 Total unread messages:", totalUnreadMessages)

//   // Handle user selection
//   const handleUserSelect = (user: any) => {
//     console.log("👤 Selecting user:", user.name, "ID:", user.id)
//     setSelectedUser(user)
//     if (user.id) {
//       getMessages(user.id)
//     }
//   }

//   // Handle retry connection
//   const handleRetryConnection = () => {
//     if (authUser?.id) {
//       console.log("🔄 Retrying connection for user:", authUser.id)
//       retrySocketConnection(authUser.id.toString())
//     }
//   }

//   // Debug logging for real-time updates
//   useEffect(() => {
//     console.log("🔍 Real-time Status Update:")
//     console.log("- Socket Connected:", socketConnected)
//     console.log("- Online Users:", onlineUsers)
//     console.log("- Total Unread:", totalUnreadMessages)
//     console.log(
//       "- Users with data:",
//       users.map((u) => ({
//         name: u.name,
//         id: u.id,
//         online: checkUserOnline(u.id),
//         unread: getUnreadCount(u),
//         typing: isUserTyping(u.id),
//         lastMessage: u.lastMessage,
//         lastMessageSeen: u.lastMessageSeen,
//         lastMessageSenderId: u.lastMessageSenderId,
//       })),
//     )
//   }, [socketConnected, onlineUsers, totalUnreadMessages, users])

//   if (isUsersLoading) {
//     return (
//       <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
//         {/* Loading Header */}
//         <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between animate-pulse">
//           <div className="flex items-center space-x-4">
//             <div className="h-8 w-32 bg-gray-200 rounded"></div>
//             <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//             <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//           </div>
//         </div>

//         {/* Loading Search Bar */}
//         <div className="px-6 py-4 bg-[#EEF2FF] border-b border-[#CBD5E1] animate-pulse">
//           <div className="h-12 bg-gray-200 rounded-full"></div>
//         </div>

//         {/* Loading Online Status */}
//         <div className="px-6 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] animate-pulse">
//           <div className="h-4 w-24 bg-gray-200 rounded"></div>
//         </div>

//         {/* Loading Conversation List */}
//         <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <div key={index} className="px-6 py-4 border-b border-[#f2f2f9] animate-pulse">
//               <div className="flex items-center space-x-3">
//                 <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="flex justify-between">
//                     <div className="h-4 w-32 bg-gray-200 rounded"></div>
//                     <div className="h-3 w-12 bg-gray-200 rounded"></div>
//                   </div>
//                   <div className="flex justify-between">
//                     <div className="h-3 w-40 bg-gray-200 rounded"></div>
//                     <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
//       {/* Messages Header */}
//       <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-[800] text-[#1E293B]">Messages</h1>
//           {totalUnreadMessages > 0 && (
//             <Badge className="bg-[#F43F5E] text-white border-0 rounded-full px-3 py-1 text-sm font-bold animate-pulse">
//               {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
//             </Badge>
//           )}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-[#E0E7FF]">
//             <Image src={Plus || "/placeholder.svg"} width={24} height={24} alt="plus" />
//           </Button>
//           <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-[#E0E7FF]">
//             <Image src={Filter || "/placeholder.svg"} width={24} height={24} alt="filter" />
//           </Button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 bg-[#EEF2FF] border-b border-[#CBD5E1]">
//         <div className="relative">
//           <Image
//             src={Search || "/placeholder.svg"}
//             width={20}
//             height={20}
//             alt="search"
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
//           />
//           <Input
//             type="text"
//             placeholder="Search conversations..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-full h-12 text-[#475569] text-base font-[500] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
//           />
//         </div>
//       </div>

//       {/* Connection Status */}
//       <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div
//               className={`w-2 h-2 rounded-full transition-colors ${
//                 socketConnected ? "bg-[#22C55E]" : socketConnecting ? "bg-[#F59E0B] animate-pulse" : "bg-[#EF4444]"
//               }`}
//             ></div>
//             <span className="text-sm text-[#475569] font-[500]">
//               {socketConnected
//                 ? `${onlineUsers.length} online • ${totalUnreadMessages} unread`
//                 : socketConnecting
//                   ? "Connecting..."
//                   : "Offline"}
//             </span>
//           </div>
//           {socketError && !socketConnected && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleRetryConnection}
//               className="text-xs text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEE2E2] px-2 py-1"
//             >
//               Retry
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Conversations List */}
//       <div className="flex-1 overflow-y-auto hide-scrollbar">
//         {filteredUsers.length === 0 && searchTerm ? (
//           <div className="flex-1 flex items-center justify-center p-8">
//             <div className="text-center">
//               <h3 className="text-lg font-medium text-[#1E293B] mb-2">No results found</h3>
//               <p className="text-[#475569] text-sm">Try searching with different keywords</p>
//             </div>
//           </div>
//         ) : (
//           filteredUsers.map((user: any) => {
//             const unreadCount = getUnreadCount(user)
//             const userIsOnline = checkUserOnline(user.id)
//             const userIsTyping = isUserTyping(user.id)
//             const isSelected = selectedUser?.id === user.id

//             return (
//               <div
//                 key={user.id}
//                 className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative transition-all duration-200 ${
//                   isSelected
//                     ? "border-l-4 border-l-[#6366F1] bg-[#F0F4FF]"
//                     : unreadCount > 0
//                       ? "border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]"
//                       : "bg-[#FFFFFF] hover:border-l-4 hover:border-l-[#E5E7EB]"
//                 }`}
//                 onClick={() => handleUserSelect(user)}
//               >
//                 {/* Avatar */}
//                 <div className="relative mr-3">
//                   <Image
//                     src={user?.avatar || "/images/avatar.png"}
//                     alt={user.name}
//                     width={48}
//                     height={48}
//                     className="rounded-full object-cover"
//                   />
//                   {/* Online Status Indicator */}
//                   <div
//                     className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full transition-all duration-300 ${
//                       userIsOnline ? "bg-[#22C55E] shadow-lg" : "bg-[#CBD5E1]"
//                     }`}
//                     title={userIsOnline ? "Online" : "Offline"}
//                   ></div>
//                   {/* Typing indicator on avatar */}
//                   {userIsTyping && (
//                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6366F1] rounded-full flex items-center justify-center">
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <div className="flex items-center space-x-2">
//                       <h3
//                         className={`truncate text-base ${
//                           unreadCount > 0 ? "font-[800] text-[#1E293B]" : "font-[600] text-[#374151]"
//                         }`}
//                       >
//                         {user.name}
//                       </h3>
//                       {userIsOnline && (
//                         <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" title="Online"></div>
//                       )}
//                     </div>
//                     <span className="text-xs text-[#6B7280] ml-2 font-[400]">
//                       {user.lastMessageTime ? formatMessageTime(user.lastMessageTime) : ""}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1 min-w-0">
//                       {userIsTyping ? (
//                         <div className="flex items-center space-x-1">
//                           <div className="flex space-x-1">
//                             <div className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce"></div>
//                             <div
//                               className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce"
//                               style={{ animationDelay: "0.1s" }}
//                             ></div>
//                             <div
//                               className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce"
//                               style={{ animationDelay: "0.2s" }}
//                             ></div>
//                           </div>
//                           <span className="text-[#6366F1] font-[500] text-sm ml-2">typing...</span>
//                         </div>
//                       ) : (
//                         <p
//                           className={`text-sm truncate ${
//                             unreadCount > 0 ? "font-[600] text-[#374151]" : "font-[400] text-[#6B7280]"
//                           }`}
//                         >
//                           {user.lastMessage ? truncateMessage(user.lastMessage) : "No messages yet"}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex items-center space-x-2 ml-2">
//                       {/* Read Receipt for sent messages */}
//                       {user.lastMessage &&
//                         normalizeId(user.lastMessageSenderId) === normalizeId(authUser?.id) &&
//                         user.lastMessageSeen === 1 && (
//                           <div className="text-[#22c55e]" title="Message read">
//                             <Image
//                               src={SeenCheckmark || "/placeholder.svg"}
//                               width={14}
//                               height={14}
//                               alt="seen-checkmark"
//                             />
//                           </div>
//                         )}
//                       {/* Unread count badge */}
//                       {unreadCount > 0 && (
//                         <Badge
//                           className={`${
//                             userIsOnline ? "bg-[#6366F1] text-white shadow-lg" : "bg-[#F59E0B] text-white"
//                           } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center font-bold border-0 animate-pulse`}
//                           title={`${unreadCount} unread messages`}
//                         >
//                           {unreadCount > 99 ? "99+" : unreadCount}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           })
//         )}

//         {/* Empty State */}
//         {users.length === 0 && !isUsersLoading && (
//           <div className="flex-1 flex items-center justify-center p-8">
//             <div className="text-center">
//               <div className="w-16 h-16 mx-auto mb-4 bg-[#F1F5F9] rounded-full flex items-center justify-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="32"
//                   height="32"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="text-[#64748B]"
//                 >
//                   <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
//                   <circle cx="9" cy="7" r="4"></circle>
//                   <path d="m22 2-5 10-5-5-5 10"></path>
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-[#1E293B] mb-2">No conversations</h3>
//               <p className="text-[#475569] text-sm">Start a new conversation to get started</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Typing Users Summary (if any) */}
//       {typingUsers.filter((u) => u.isTyping).length > 0 && (
//         <div className="px-6 py-3 bg-[#F0F4FF] border-t border-[#E0E7FF]">
//           <div className="flex items-center space-x-2">
//             <div className="flex space-x-1">
//               <div className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce"></div>
//               <div
//                 className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce"
//                 style={{ animationDelay: "0.1s" }}
//               ></div>
//               <div
//                 className="w-1 h-1 bg-[#6366F1] rounded-full animate-bounce"
//                 style={{ animationDelay: "0.2s" }}
//               ></div>
//             </div>
//             <span className="text-sm text-[#6366F1] font-[600]">
//               {typingUsers.filter((u) => u.isTyping).length === 1
//                 ? `${typingUsers.filter((u) => u.isTyping)[0].userName} is typing...`
//                 : `${typingUsers.filter((u) => u.isTyping).length} people are typing...`}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Connection Error Banner */}
//       {socketError && !socketConnected && (
//         <div className="px-6 py-3 bg-[#FEF2F2] border-t border-[#FECACA]">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
//               <span className="text-sm text-[#EF4444] font-[500]">Connection lost</span>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleRetryConnection}
//               className="text-xs text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEE2E2] px-2 py-1"
//             >
//               Reconnect
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
