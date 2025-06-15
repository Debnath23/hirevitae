// "use client";

// import React from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Call, Inbox, MonotoneAdd, Search2 } from "@/public/icons/index";
// import { useChatStore } from "@/store/useChatStore";

// function ConversationHeader() {
//   const { selectedUser } = useChatStore();
//   return (
//     <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <Image
//               src="/images/avatar.png"
//               alt="Azunyan U. Wu"
//               width={48}
//               height={48}
//               className="rounded-full"
//             />
//           </div>
//           <div>
//             <div className="flex items-center space-x-2">
//               <h2 className="font-[700] text-[#1E293B] text-base">
//                 {selectedUser?.name}
//               </h2>
//               <Badge className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E] font-[700] text-xs px-2 py-1 rounded-[3px]">
//                 <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>{" "}
//                 Online
//               </Badge>
//             </div>

//             <span className="text-[#475569] text-sm font-[500]">
//               {selectedUser?.email || "No email provided"}
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="bg-[#F4ECFB] text-[#883DCF] hover:bg-[#dfd9e9] rounded-full cursor-pointer"
//           >
//             <Image src={Inbox} alt="inbox" width={16.31} height={16.31} />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="bg-[#883DCF] text-[#FFFFF] hover:bg-[#7c3aed] rounded-full cursor-pointer"
//           >
//             <Image src={Call} alt="inbox" width={19.58} height={19.58} />
//           </Button>
//           <Button className="bg-[#4F46E5] text-white text-sm font-[700] hover:bg-[#5b56e8] rounded-[3px] px-4 cursor-pointer">
//             View Profile
//           </Button>
//           <Button variant="ghost" size="icon">
//             <Image
//               src={Search2}
//               width={24}
//               height={24}
//               alt="search"
//               className="text-[#475569] cursor-pointer"
//             />
//           </Button>
//           <Button variant="ghost" size="icon">
//             <Image
//               src={MonotoneAdd}
//               width={24}
//               height={24}
//               alt="search"
//               className="text-[#CBD5E1] cursor-pointer"
//             />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConversationHeader;

// "use client"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Call, Inbox, MonotoneAdd, Search2 } from "@/public/icons/index"
// import { useChatStore } from "@/store/useChatStore"

// function ConversationHeader() {
//   const { selectedUser, isUserOnline, typingUsers, getTypingUsers } = useChatStore()

//   // Check if selected user is online
//   const userIsOnline = selectedUser ? isUserOnline(selectedUser.id || selectedUser._id) : false

//   // Check if selected user is typing
//   const userIsTyping = selectedUser
//     ? typingUsers.some((user) => user.userId === (selectedUser.id || selectedUser._id))
//     : false

//   // Get typing users for display
//   const currentTypingUsers = getTypingUsers()

//   if (!selectedUser) {
//     return (
//       <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
//         <div className="flex items-center justify-center">
//           <span className="text-[#475569] text-sm font-[500]">Select a conversation to start chatting</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <Image
//               src={selectedUser?.avatar || "/images/avatar.png"}
//               alt={selectedUser?.name || "User"}
//               width={48}
//               height={48}
//               className="rounded-full"
//             />
//             {/* Online Status Indicator */}
//             {userIsOnline ? (
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
//             ) : (
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#CBD5E1] border-2 border-white rounded-full"></div>
//             )}
//           </div>
//           <div>
//             <div className="flex items-center space-x-2">
//               <h2 className="font-[700] text-[#1E293B] text-base">{selectedUser?.name || "Unknown User"}</h2>
//               {/* Dynamic Online/Offline Badge */}
//               {userIsOnline ? (
//                 <Badge className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E] font-[700] text-xs px-2 py-1 rounded-[3px]">
//                   <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full mr-1"></span>
//                   Online
//                 </Badge>
//               ) : (
//                 <Badge className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] font-[700] text-xs px-2 py-1 rounded-[3px]">
//                   <span className="w-1.5 h-1.5 bg-[#CBD5E1] rounded-full mr-1"></span>
//                   Offline
//                 </Badge>
//               )}
//             </div>

//             {/* Status Text - Shows typing or email */}
//             <div className="flex items-center space-x-2">
//               {userIsTyping ? (
//                 <div className="flex items-center space-x-1">
//                   <div className="flex space-x-1">
//                     <div className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"></div>
//                     <div
//                       className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                   <span className="text-[#22C55E] text-sm font-[500]">typing...</span>
//                 </div>
//               ) : (
//                 <span className="text-[#475569] text-sm font-[500]">{selectedUser?.email || "No email provided"}</span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="bg-[#F4ECFB] text-[#883DCF] hover:bg-[#dfd9e9] rounded-full cursor-pointer"
//             title="Inbox"
//           >
//             <Image src={Inbox || "/placeholder.svg"} alt="inbox" width={16.31} height={16.31} />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="bg-[#883DCF] text-[#FFFFFF] hover:bg-[#7c3aed] rounded-full cursor-pointer"
//             title="Call"
//             disabled={!userIsOnline}
//           >
//             <Image src={Call || "/placeholder.svg"} alt="call" width={19.58} height={19.58} />
//           </Button>
//           <Button
//             className="bg-[#4F46E5] text-white text-sm font-[700] hover:bg-[#5b56e8] rounded-[3px] px-4 cursor-pointer"
//             title="View Profile"
//           >
//             View Profile
//           </Button>
//           <Button variant="ghost" size="icon" title="Search in conversation">
//             <Image
//               src={Search2 || "/placeholder.svg"}
//               width={24}
//               height={24}
//               alt="search"
//               className="text-[#475569] cursor-pointer"
//             />
//           </Button>
//           <Button variant="ghost" size="icon" title="More options">
//             <Image
//               src={MonotoneAdd || "/placeholder.svg"}
//               width={24}
//               height={24}
//               alt="more options"
//               className="text-[#CBD5E1] cursor-pointer"
//             />
//           </Button>
//         </div>
//       </div>

//       {/* Global Typing Indicator (if multiple people are typing) */}
//       {currentTypingUsers.length > 1 && (
//         <div className="mt-2 pt-2 border-t border-[#F1F5F9]">
//           <div className="flex items-center space-x-2">
//             <div className="flex space-x-1">
//               <div className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"></div>
//               <div
//                 className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"
//                 style={{ animationDelay: "0.1s" }}
//               ></div>
//               <div
//                 className="w-1 h-1 bg-[#22C55E] rounded-full animate-bounce"
//                 style={{ animationDelay: "0.2s" }}
//               ></div>
//             </div>
//             <span className="text-[#22C55E] text-sm font-[500]">{currentTypingUsers.length} people are typing...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ConversationHeader

"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Call, Inbox, MonotoneAdd, Search2 } from "@/public/icons/index"
import { useChatStore } from "@/store/useChatStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function ConversationHeader() {
  const { selectedUser, isUserOnline, typingUsers, getTypingUsers, socketConnected } = useChatStore()
  const { authUser } = useAuthStore()
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  // Check if selected user is online
  const userIsOnline = selectedUser ? isUserOnline(selectedUser.id?.toString() || selectedUser._id?.toString()) : false

  // Check if selected user is typing
  const userIsTyping = selectedUser
    ? typingUsers.some(
        (user) => user.userId === (selectedUser.id?.toString() || selectedUser._id?.toString()) && user.isTyping,
      )
    : false

  // Get typing users for display (excluding current selected user from global count)
  const currentTypingUsers = getTypingUsers().filter(
    (user) => user.userId !== (selectedUser?.id?.toString() || selectedUser?._id?.toString()),
  )

  // Format last seen time (you can implement this based on your needs)
  const getLastSeenText = () => {
    if (userIsOnline) return "Online"
    // You can add logic here to show "Last seen X minutes ago" etc.
    return "Offline"
  }

  if (!selectedUser) {
    return (
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex items-center justify-center">
          <span className="text-[#475569] text-sm font-[500]">Select a conversation to start chatting</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={selectedUser?.avatar || "/images/avatar.png"}
              alt={selectedUser?.name || "User"}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            {/* Online Status Indicator */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                userIsOnline ? "bg-[#22C55E]" : "bg-[#CBD5E1]"
              }`}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="font-[700] text-[#1E293B] text-base truncate">{selectedUser?.name || "Unknown User"}</h2>
              {/* Dynamic Online/Offline Badge */}
              <Badge
                className={`${
                  userIsOnline
                    ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E]"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
                } font-[700] text-xs px-2 py-1 rounded-[3px] flex items-center`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1 ${userIsOnline ? "bg-[#22C55E]" : "bg-[#CBD5E1]"}`}
                ></span>
                {userIsOnline ? "Online" : "Offline"}
              </Badge>
              {/* Connection Status Indicator */}
              {!socketConnected && (
                <Badge className="bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] font-[500] text-xs px-2 py-1 rounded-[3px]">
                  Disconnected
                </Badge>
              )}
            </div>

            {/* Status Text - Shows typing or email */}
            <div className="flex items-center space-x-2">
              {userIsTyping ? (
                <div className="flex items-center space-x-1">
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
                  <span className="text-[#22C55E] text-sm font-[500]">typing...</span>
                </div>
              ) : (
                <span className="text-[#475569] text-sm font-[500] truncate">
                  {selectedUser?.email || "No email provided"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#F4ECFB] text-[#883DCF] hover:bg-[#dfd9e9] rounded-full cursor-pointer transition-colors"
            title="Inbox"
          >
            <Image src={Inbox || "/placeholder.svg"} alt="inbox" width={16} height={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full transition-colors ${
              userIsOnline && socketConnected
                ? "bg-[#883DCF] text-[#FFFFFF] hover:bg-[#7c3aed] cursor-pointer"
                : "bg-[#E2E8F0] text-[#64748B] cursor-not-allowed"
            }`}
            title={userIsOnline && socketConnected ? "Call" : "User is offline"}
            disabled={!userIsOnline || !socketConnected}
          >
            <Image src={Call || "/placeholder.svg"} alt="call" width={19} height={19} />
          </Button>

          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#4F46E5] text-white text-sm font-[700] hover:bg-[#5b56e8] rounded-[3px] px-4 cursor-pointer transition-colors"
                title="View Profile"
              >
                View Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 p-4">
                <div className="relative">
                  <Image
                    src={selectedUser?.avatar || "/images/avatar.png"}
                    alt={selectedUser?.name || "User"}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${
                      userIsOnline ? "bg-[#22C55E]" : "bg-[#CBD5E1]"
                    }`}
                  ></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-[#1E293B]">{selectedUser?.name || "Unknown User"}</h3>
                  <p className="text-[#475569]">{selectedUser?.email || "No email provided"}</p>
                  <Badge
                    className={`${
                      userIsOnline
                        ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E]"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
                    } font-[500]`}
                  >
                    {getLastSeenText()}
                  </Badge>
                </div>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Status:</span>
                    <span className={userIsOnline ? "text-[#22C55E]" : "text-[#64748B]"}>
                      {userIsOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Connection:</span>
                    <span className={socketConnected ? "text-[#22C55E]" : "text-[#EF4444]"}>
                      {socketConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  {selectedUser?.id && (
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">User ID:</span>
                      <span className="text-[#475569] font-mono text-xs">{selectedUser.id || selectedUser._id}</span>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[#F1F5F9] rounded-full transition-colors"
            title="Search in conversation"
          >
            <Image
              src={Search2 || "/placeholder.svg"}
              width={20}
              height={20}
              alt="search"
              className="text-[#475569] cursor-pointer"
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[#F1F5F9] rounded-full transition-colors"
            title="More options"
          >
            <Image
              src={MonotoneAdd || "/placeholder.svg"}
              width={20}
              height={20}
              alt="more options"
              className="text-[#CBD5E1] cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {/* Global Typing Indicator (if multiple people are typing) */}
      {/* {currentTypingUsers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
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
            <span className="text-[#22C55E] text-sm font-[500]">
              {currentTypingUsers.length === 1
                ? `${currentTypingUsers[0].userName} is typing...`
                : `${currentTypingUsers.length} people are typing...`}
            </span>
          </div>
        </div>
      )} */}

      {/* Connection Warning */}
      {/* {!socketConnected && (
        <div className="mt-3 pt-3 border-t border-[#FEE2E2]">
          <div className="flex items-center justify-between bg-[#FEF2F2] px-3 py-2 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
              <span className="text-[#EF4444] text-sm font-[500]">Connection lost - messages may not be delivered</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEE2E2]"
              onClick={() => {
                // You can implement reconnection logic here
                window.location.reload()
              }}
            >
              Refresh
            </Button>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default ConversationHeader
