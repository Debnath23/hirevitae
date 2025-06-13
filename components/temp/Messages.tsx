// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { useChatStore } from "@/store/useChatStore";
// import { useAuthStore } from "@/store/useAuthStore";
// import { Smile, Check, CheckCheck } from "lucide-react";
// import {
//   DeviceMobileCamera,
//   Emoji1,
//   Emoji2,
//   Emoji3,
//   FileImage,
//   FolderOpen,
//   LinkSimple,
// } from "@/public/icons/index";

// // Format time
// function formatMessageTime(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
//   return diffInHours < 24
//     ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     : date.toLocaleDateString();
// }

// // API message type
// interface ApiMessage {
//   id: number;
//   text: string;
//   bold: boolean;
//   italic: boolean;
//   underline: boolean;
//   unorderedList: boolean;
//   orderedList: boolean;
//   fontSize: string;
//   linkTitle: string | null;
//   linkTarget: string | null;
//   emoji: string | null;
//   imageName: string | null;
//   imageUrl: string | null;
//   codeLanguage: string | null;
//   codeContent: string | null;
//   seen: number;
//   senderId: number;
//   receiverId: number;
//   createdAt: string;
//   updatedAt: string;
//   sender: {
//     id: number;
//     name: string;
//     email: string;
//   };
//   receiver: {
//     id: number;
//     name: string;
//     email: string;
//   };
//   reactions?: {
//     emoji: {
//       native: string;
//     };
//     count: number;
//   }[];
// }

// function Messages() {
//   const {
//     messages,
//     getMessages,
//     selectedUser,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//     addReaction,
//     isMessagesLoading,
//     isTyping,
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   // Fetch and subscribe
//   useEffect(() => {
//     if (!selectedUser?.id) return;
//     getMessages(selectedUser.id);
//     subscribeToMessages();
//     return () => unsubscribeFromMessages();
//   }, [selectedUser?.id]);

//   // Scroll to latest message
//   useEffect(() => {
//     if (messageEndRef.current && messages.length > 0) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleAddReaction = async (messageId: string, emoji: string) => {
//     await addReaction(messageId, {
//       id: emoji,
//       native: emoji,
//       name: emoji,
//     });
//   };

//   const parseMessageText = (
//     text: string,
//     linkTitle: string | null,
//     imageUrl: string | null
//   ) => {
//     let cleanText = text;
//     if (linkTitle && text.includes(linkTitle)) {
//       cleanText = cleanText.replace(linkTitle, "").trim();
//     }
//     if (imageUrl && text.includes("[Image:")) {
//       cleanText = cleanText.replace(/\[Image:.*?\]/g, "").trim();
//     }
//     return cleanText;
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <h3 className="text-lg font-medium">Select a conversation</h3>
//           <p className="text-muted-foreground">
//             Choose a contact to start messaging
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isMessagesLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
//       {isTyping && (
//         <div className="flex justify-start">
//           <div className="bg-gray-100 rounded-lg px-4 py-2">
//             <div className="flex space-x-1">
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
//             </div>
//           </div>
//         </div>
//       )}

//       {messages.map((message: any, index: number) => {
//         const apiMessage = message as ApiMessage;
//         const isOwnMessage =
//           apiMessage.senderId === authUser?.id ||
//           apiMessage.senderId === Number(authUser?.id);

//         const senderName = apiMessage.sender?.name || "Unknown User";
//         const cleanMessageText = parseMessageText(
//           apiMessage.text,
//           apiMessage.linkTitle,
//           apiMessage.imageUrl
//         );

//         return (
//           <div
//             key={apiMessage.id || index}
//             className={`chat flex ${
//               isOwnMessage ? "chat-end justify-end" : "chat-start justify-start"
//             }`}
//           >
//             <div className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm w-full group">
//               {!isOwnMessage && (
//                 <div className="w-8 h-8 flex-shrink-0">
//                   <Image
//                     src={"/images/avatar.png"}
//                     alt={`${senderName} Avatar`}
//                     width={32}
//                     height={32}
//                     className="rounded-full object-cover"
//                   />
//                 </div>
//               )}

//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <span className="font-[700] text-base text-[#1E293B]">
//                     {senderName}
//                   </span>
//                   <span className="text-[#94A3B8] text-sm font-[500]">
//                     {formatMessageTime(apiMessage.createdAt)}
//                   </span>
//                   {isOwnMessage && (
//                     <span className="text-xs">
//                       {apiMessage.seen ? (
//                         <CheckCheck className="h-3 w-3 text-blue-500" />
//                       ) : (
//                         <Check className="h-3 w-3" />
//                       )}
//                     </span>
//                   )}
//                 </div>

//                 <div
//                   className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3"
//                   style={{
//                     fontSize: `${apiMessage.fontSize}px`,
//                     fontWeight: apiMessage.bold ? "bold" : "normal",
//                     fontStyle: apiMessage.italic ? "italic" : "normal",
//                     textDecoration: apiMessage.underline ? "underline" : "none",
//                     listStyleType: apiMessage.unorderedList
//                       ? "disc"
//                       : apiMessage.orderedList
//                       ? "decimal"
//                       : "none",
//                     paddingLeft:
//                       apiMessage.unorderedList || apiMessage.orderedList
//                         ? "20px"
//                         : "12px",
//                   }}
//                 >
//                   {cleanMessageText}
//                   {apiMessage.emoji && (
//                     <span className="ml-0">{apiMessage.emoji}</span>
//                   )}
//                 </div>

//                 {apiMessage.codeContent && (
//                   <div className="bg-gray-900 text-green-400 p-3 rounded-md mb-3 font-mono text-sm overflow-x-auto">
//                     <div className="text-xs text-gray-400 mb-2">
//                       {apiMessage.codeLanguage || "code"}
//                     </div>
//                     <pre>{apiMessage.codeContent}</pre>
//                   </div>
//                 )}

//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {apiMessage.linkTitle && apiMessage.linkTarget && (
//                     <a
//                       href={apiMessage.linkTarget}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-block"
//                     >
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
//                       >
//                         <Image
//                           src={LinkSimple}
//                           width={16}
//                           height={16}
//                           alt="image-icon"
//                           className="w-4 h-4 mr-2"
//                         />
//                         <p className="text-[#475569] font-[700] text-sm">
//                           {apiMessage.linkTitle}
//                         </p>
//                       </Button>
//                     </a>
//                   )}

//                   {apiMessage.imageName && (
//                     <a
//                       href={apiMessage.imageUrl || "#"}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-block"
//                     >
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
//                       >
//                         <Image
//                           src={FolderOpen}
//                           width={16}
//                           height={16}
//                           alt="image-icon"
//                           className="w-4 h-4 mr-2"
//                         />
//                         <p className="text-[#475569] font-[700] text-sm">
//                           {apiMessage.imageName}
//                         </p>
//                       </Button>
//                     </a>
//                   )}
//                 </div>

//                 {/* {apiMessage.reactions && apiMessage.reactions.length > 0 && (
//                   <div className="flex items-center space-x-2 flex-wrap mb-2">
//                     {apiMessage.reactions.map((reaction, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center space-x-1 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer hover:bg-[#E2E8F0]"
//                         onClick={() =>
//                           handleAddReaction(
//                             String(apiMessage.id),
//                             reaction.emoji?.native || "👍"
//                           )
//                         }
//                       >
//                         <span>{reaction.emoji?.native || "👍"}</span>
//                         <span className="text-sm font-[700] text-[#475569]">
//                           {reaction.count || 1}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )} */}

//                 {/* <div className="flex items-center space-x-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                     onClick={() =>
//                       handleAddReaction(String(apiMessage.id), "👍")
//                     }
//                   >
//                     <Smile className="h-3 w-3" />
//                   </Button>
//                 </div> */}
//               </div>

//               {isOwnMessage && (
//                 <div className="w-8 h-8 flex-shrink-0">
//                   <Image
//                     src={authUser?.avatar}
//                     alt="Your Avatar"
//                     width={32}
//                     height={32}
//                     className="rounded-full object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//       <div ref={messageEndRef} />
//     </div>
//   );
// }

// export default Messages;

// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { useChatStore } from "@/store/useChatStore";
// import { useAuthStore } from "@/store/useAuthStore";
// import { Check, CheckCheck, RefreshCw, AlertTriangle } from "lucide-react";

// // Format time
// function formatMessageTime(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
//   return diffInHours < 24
//     ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     : date.toLocaleDateString();
// }

// // API message type
// interface ApiMessage {
//   id: number;
//   text: string;
//   bold: boolean;
//   italic: boolean;
//   underline: boolean;
//   unorderedList: boolean;
//   orderedList: boolean;
//   fontSize: string;
//   linkTitle: string | null;
//   linkTarget: string | null;
//   emoji: string | null;
//   imageName: string | null;
//   imageUrl: string | null;
//   codeLanguage: string | null;
//   codeContent: string | null;
//   seen: number;
//   senderId: number;
//   receiverId: number;
//   createdAt: string;
//   updatedAt: string;
//   sender: {
//     id: number;
//     name: string;
//     email: string;
//   };
//   receiver: {
//     id: number;
//     name: string;
//     email: string;
//   };
//   reactions?: {
//     emoji: {
//       native: string;
//     };
//     count: number;
//   }[];
// }

// function Messages() {
//   const {
//     messages,
//     getMessages,
//     selectedUser,
//     initializeSocket,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//     addReaction,
//     isMessagesLoading,
//     isTyping,
//     socketConnected,
//     socketConnecting,
//     socketError,
//     retrySocketConnection,
//   } = useChatStore();

//   const { authUser, checkAuth } = useAuthStore();
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   // Initialize socket when authUser is available
//   useEffect(() => {
//     checkAuth();
//     if (authUser?.id && !socketConnected && !socketConnecting && !socketError) {
//       initializeSocket(authUser.id);
//     }
//   }, [
//     authUser?.id,
//     socketConnected,
//     socketConnecting,
//     socketError,
//     initializeSocket,
//   ]);

//   // Fetch messages and subscribe when user is selected AND socket is ready
//   useEffect(() => {
//     if (!selectedUser?.id) return;

//     getMessages(selectedUser.id);

//     if (socketConnected) {
//       subscribeToMessages();
//     } else {
//       console.log("Socket not connected, skipping subscription");
//     }

//     return () => {
//       unsubscribeFromMessages();
//     };
//   }, [
//     selectedUser?.id,
//     socketConnected,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//     getMessages,
//   ]);

//   // Subscribe to socket events when socket becomes connected
//   useEffect(() => {
//     if (socketConnected && selectedUser?.id) {
//       subscribeToMessages();
//     }
//   }, [socketConnected, selectedUser?.id, subscribeToMessages]);

//   // Scroll to latest message
//   useEffect(() => {
//     if (messageEndRef.current && messages.length > 0) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleAddReaction = async (messageId: string, emoji: string) => {
//     await addReaction(messageId, {
//       id: emoji,
//       native: emoji,
//       name: emoji,
//     });
//   };

//   const handleRetryConnection = () => {
//     if (authUser?.id) {
//       retrySocketConnection(authUser.id);
//     }
//   };

//   const parseMessageText = (
//     text: string,
//     linkTitle: string | null,
//     imageUrl: string | null
//   ) => {
//     let cleanText = text;
//     if (linkTitle && text.includes(linkTitle)) {
//       cleanText = cleanText.replace(linkTitle, "").trim();
//     }
//     if (imageUrl && text.includes("[Image:")) {
//       cleanText = cleanText.replace(/\[Image:.*?\]/g, "").trim();
//     }
//     return cleanText;
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <h3 className="text-lg font-medium">Select a conversation</h3>
//           <p className="text-muted-foreground">
//             Choose a contact to start messaging
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isMessagesLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
//       {/* Socket connection status */}
//       {socketError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="w-4 h-4 text-red-500" />
//               <span className="text-sm text-red-700">
//                 Real-time chat unavailable:{" "}
//                 {socketError.includes("timeout")
//                   ? "Server not responding"
//                   : socketError}
//               </span>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRetryConnection}
//               disabled={socketConnecting}
//             >
//               <RefreshCw
//                 className={`w-3 h-3 mr-1 ${
//                   socketConnecting ? "animate-spin" : ""
//                 }`}
//               />
//               Retry
//             </Button>
//           </div>
//         </div>
//       )}

//       {socketConnecting && !socketError && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//             <span className="text-sm text-blue-700">
//               Connecting to real-time chat...
//             </span>
//           </div>
//         </div>
//       )}

//       {socketConnected && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="text-sm text-green-700">
//               Real-time chat connected
//             </span>
//           </div>
//         </div>
//       )}

//       {isTyping && (
//         <div className="flex justify-start">
//           <div className="bg-gray-100 rounded-lg px-4 py-2">
//             <div className="flex space-x-1">
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
//             </div>
//           </div>
//         </div>
//       )}

//       {messages.map((message: any, index: number) => {
//         const apiMessage = message as ApiMessage;
//         const isOwnMessage =
//           apiMessage.senderId === authUser?.id ||
//           apiMessage.senderId === Number(authUser?.id);

//         const senderName = apiMessage.sender?.name || "Unknown User";
//         const cleanMessageText = parseMessageText(
//           apiMessage.text,
//           apiMessage.linkTitle,
//           apiMessage.imageUrl
//         );

//         return (
//           <div
//             key={apiMessage.id || index}
//             className={`chat flex ${
//               isOwnMessage ? "chat-end justify-end" : "chat-start justify-start"
//             }`}
//           >
//             <div className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm w-full group">
//               {!isOwnMessage && (
//                 <div className="w-8 h-8 flex-shrink-0">
//                   <Image
//                     src={"/images/avatar.png"}
//                     alt={`${senderName} Avatar`}
//                     width={32}
//                     height={32}
//                     className="rounded-full object-cover"
//                   />
//                 </div>
//               )}

//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <span className="font-[700] text-base text-[#1E293B]">
//                     {senderName}
//                   </span>
//                   <span className="text-[#94A3B8] text-sm font-[500]">
//                     {formatMessageTime(apiMessage.createdAt)}
//                   </span>
//                   {isOwnMessage && (
//                     <span className="text-xs">
//                       {apiMessage.seen ? (
//                         <CheckCheck className="h-3 w-3 text-blue-500" />
//                       ) : (
//                         <Check className="h-3 w-3" />
//                       )}
//                     </span>
//                   )}
//                 </div>

//                 <div
//                   className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3"
//                   style={{
//                     fontSize: `${apiMessage.fontSize}px`,
//                     fontWeight: apiMessage.bold ? "bold" : "normal",
//                     fontStyle: apiMessage.italic ? "italic" : "normal",
//                     textDecoration: apiMessage.underline ? "underline" : "none",
//                     listStyleType: apiMessage.unorderedList
//                       ? "disc"
//                       : apiMessage.orderedList
//                       ? "decimal"
//                       : "none",
//                     paddingLeft:
//                       apiMessage.unorderedList || apiMessage.orderedList
//                         ? "20px"
//                         : "12px",
//                   }}
//                 >
//                   {cleanMessageText}
//                   {apiMessage.emoji && (
//                     <span className="ml-0">{apiMessage.emoji}</span>
//                   )}
//                 </div>

//                 {apiMessage.codeContent && (
//                   <div className="bg-gray-900 text-green-400 p-3 rounded-md mb-3 font-mono text-sm overflow-x-auto">
//                     <div className="text-xs text-gray-400 mb-2">
//                       {apiMessage.codeLanguage || "code"}
//                     </div>
//                     <pre>{apiMessage.codeContent}</pre>
//                   </div>
//                 )}

//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {apiMessage.linkTitle && apiMessage.linkTarget && (
//                     <a
//                       href={apiMessage.linkTarget}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-block"
//                     >
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
//                       >
//                         <span className="w-4 h-4 mr-2">🔗</span>
//                         <p className="text-[#475569] font-[700] text-sm">
//                           {apiMessage.linkTitle}
//                         </p>
//                       </Button>
//                     </a>
//                   )}

//                   {apiMessage.imageName && (
//                     <a
//                       href={apiMessage.imageUrl || "#"}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-block"
//                     >
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
//                       >
//                         <span className="w-4 h-4 mr-2">📁</span>
//                         <p className="text-[#475569] font-[700] text-sm">
//                           {apiMessage.imageName}
//                         </p>
//                       </Button>
//                     </a>
//                   )}
//                 </div>
//               </div>

//               {isOwnMessage && (
//                 <div className="w-8 h-8 flex-shrink-0">
//                   <Image
//                     src={authUser?.avatar || "/images/avatar.png"}
//                     alt="Your Avatar"
//                     width={32}
//                     height={32}
//                     className="rounded-full object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//       <div ref={messageEndRef} />
//     </div>
//   );
// }

// export default Messages;

"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Check, CheckCheck, Reply, Forward, Link2, Trash2 } from "lucide-react";
import { LinkSimple } from "@/public/icons";
import formatMessageTime from "@/lib/format-message-time";

// Emoji data
const emojiReactions = [
  { emoji: "👍", name: "thumbsUp" },
  { emoji: "❤️", name: "heart" },
  { emoji: "😄", name: "smile" },
  { emoji: "🥰", name: "love" },
];

function Messages() {
  const {
    messages,
    getMessages,
    selectedUser,
    initializeSocket,
    subscribeToMessages,
    unsubscribeFromMessages,
    addReaction,
    isMessagesLoading,
    isTyping,
    socketConnected,
    socketConnecting,
    socketError,
    retrySocketConnection,
    setReplyToMessage,
  } = useChatStore();

  const { authUser, checkAuth } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Initialize socket when authUser is available
  useEffect(() => {
    checkAuth();
    if (authUser?.id && !socketConnected && !socketConnecting && !socketError) {
      initializeSocket(authUser.id);
    }
  }, [
    authUser?.id,
    socketConnected,
    socketConnecting,
    socketError,
    initializeSocket,
    checkAuth,
  ]);

  // Fetch messages and subscribe when user is selected AND socket is ready
  useEffect(() => {
    if (!selectedUser?.id) return;

    getMessages(selectedUser.id);

    if (socketConnected) {
      subscribeToMessages();
    } else {
      console.log("Socket not connected, skipping subscription");
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?.id,
    socketConnected,
    subscribeToMessages,
    unsubscribeFromMessages,
    getMessages,
  ]);

  // Subscribe to socket events when socket becomes connected
  useEffect(() => {
    if (socketConnected && selectedUser?.id) {
      subscribeToMessages();
    }
  }, [socketConnected, selectedUser?.id, subscribeToMessages]);

  // Scroll to latest message
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowReactionMenu(false);
      setShowActionMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleAddReaction = async (messageId: string, emoji: string) => {
    await addReaction(messageId, {
      id: emoji,
      native: emoji,
      name: emoji,
    });
    setShowReactionMenu(false);
  };

  const handleRetryConnection = () => {
    if (authUser?.id) {
      retrySocketConnection(authUser.id);
    }
  };

  const handleReply = (message: any) => {
    setReplyToMessage(message);
    setShowActionMenu(false);
    // Focus the message input
    const messageInput = document.querySelector(".DraftEditor-root");
    if (messageInput) {
      (messageInput as HTMLElement).focus();
    }
  };

  const parseMessageText = (
    text: string,
    linkTitle: string | null,
    imageUrl: string | null
  ) => {
    let cleanText = text;
    if (linkTitle && text && text.includes(linkTitle)) {
      cleanText = cleanText.replace(linkTitle, "").trim();
    }
    if (imageUrl && text && text.includes("[Image:")) {
      cleanText = cleanText.replace(/\[Image:.*?\]/g, "").trim();
    }
    return cleanText;
  };

  const toggleReactionMenu = (e: React.MouseEvent, messageId: number) => {
    e.stopPropagation();
    setActiveMessageId(messageId);
    setShowReactionMenu((prev) => !prev);
    setShowActionMenu(false);
  };

  const toggleActionMenu = (e: React.MouseEvent, messageId: number) => {
    e.stopPropagation();
    setActiveMessageId(messageId);
    setShowActionMenu((prev) => !prev);
    setShowReactionMenu(false);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a contact to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
      {messages.map((message: any, index: number) => {
        const isOwnMessage =
          message.senderId === authUser?.id ||
          message.senderId === Number(authUser?.id) ||
          message.sender?.id === authUser?.id ||
          message.sender?.id === Number(authUser?.id);

        const senderName = message.sender?.name || "Unknown User";
        const cleanMessageText = parseMessageText(
          message.text || message.content,
          message.linkTitle,
          message.imageUrl
        );

        // Check if this message has a date separator
        const showDateSeparator = message.date !== undefined;

        return (
          <div key={message.id || index}>
            {/* Date separator */}
            {showDateSeparator && (
              <div className="flex justify-center my-6">
                <span className="text-[#475569] text-sm font-[700]">
                  {message.date}
                </span>
              </div>
            )}

            <div
              className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm relative group"
              onMouseEnter={() => setActiveMessageId(message.id)}
              onMouseLeave={() => setActiveMessageId(null)}
            >
              <div className="w-8 h-8">
                <Image
                  src={
                    isOwnMessage
                      ? authUser?.avatar || "/images/avatar.png"
                      : "/images/avatar.png"
                  }
                  alt={senderName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-[700] text-base text-[#1E293B]">
                    {senderName}
                  </span>
                  {message.sender?.id === 1 && (
                    <Badge className="bg-[#EEF2FF] text-[#4F46E5] text-xs px-2 py-1 rounded-[3px] font-[700]">
                      Admin
                    </Badge>
                  )}
                  <span className="text-[#94A3B8] text-sm font-[500]">
                    {formatMessageTime(message.createdAt)}
                  </span>
                  {isOwnMessage && (
                    <span className="text-xs">
                      {message.seen ? (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>

                {/* Quote */}
                {(message.quote || message.replyToMessage) && (
                  <div className="border-l-4 border-[#0053F2] bg-[#FCFCFC] p-2 mb-3 rounded-r">
                    <div className="flex items-center space-x-2 mb-1">
                      <Image
                        src={
                          // message.quote?.avatar ||
                          // message.replyToMessage?.sender?.avatar ||
                          "/images/avatar.png"
                        }
                        alt="Quote author"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="text-[#0053F2] text-sm font-[400]">
                          {message.quote?.text ||
                            message.replyToMessage?.text ||
                            message.replyToMessage?.content ||
                            ""}
                        </div>
                        <div className="text-[#656F7D] text-sm font-[400]">
                          —{" "}
                          {message.quote?.parts ||
                            message.replyToMessage?.sender?.name ||
                            "User"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p
                  className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3"
                  style={{
                    fontSize: `${message.fontSize}px`,
                    fontWeight: message.bold ? "bold" : "normal",
                    fontStyle: message.italic ? "italic" : "normal",
                    textDecoration: message.underline ? "underline" : "none",
                    listStyleType: message.unorderedList
                      ? "disc"
                      : message.orderedList
                      ? "decimal"
                      : "none",
                    paddingLeft:
                      message.unorderedList || message.orderedList
                        ? "20px"
                        : "12px",
                  }}
                >
                  {cleanMessageText}
                  {message.emoji && (
                    <span className="ml-0">{message.emoji}</span>
                  )}
                </p>

                {/* Attachments */}
                {(message.linkTitle || message.imageName) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {message.linkTitle && message.linkTarget && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                      >
                        <Image
                          src={LinkSimple}
                          width={16}
                          height={16}
                          alt="icon"
                          className="mr-2"
                        />
                        <p className="text-[#475569] font-[700] text-sm">
                          {message.linkTitle}
                        </p>
                      </Button>
                    )}

                    {message.imageName && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                      >
                        <Image
                          src="/images/avatar.png"
                          width={16}
                          height={16}
                          alt="icon"
                          className="mr-2"
                        />
                        <p className="text-[#475569] font-[700] text-sm">
                          {message.imageName}
                        </p>
                      </Button>
                    )}
                  </div>
                )}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center space-x-4">
                    {message.reactions.map((reaction: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-1.5 ${
                          !message.quote
                            ? "bg-[#F1F5F9] py-1 px-2 rounded-[3px]"
                            : "bg-[#F7F7F7] border border-[#EEEDF0] py-1 px-2 rounded-[19px]"
                        } cursor-pointer`}
                      >
                        <span
                          className={`${
                            !message.quote
                              ? "text-base font-[700] text-[#475569]"
                              : "text-xs font-[400] text-[#646464]"
                          }`}
                        >
                          {reaction.count}
                        </span>
                        <span>{reaction.emoji.native}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emoji reaction and action menu (visible on hover) */}
              {activeMessageId === message.id && (
                <div className="absolute right-3 top-[-30px] flex items-center space-x-2 bg-[#1E1E1E] rounded-full px-2 py-1 shadow-lg z-10">
                  <div className="flex space-x-1">
                    {emojiReactions.map((item) => (
                      <button
                        key={item.name}
                        className="hover:bg-gray-700 p-1 rounded-full transition-colors"
                        onClick={(e) =>
                          handleAddReaction(message.id.toString(), item.emoji)
                        }
                      >
                        <span className="text-lg">{item.emoji}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="text-white hover:bg-gray-700 p-1 rounded-full transition-colors"
                    onClick={(e) => toggleActionMenu(e, message.id)}
                  >
                    <span className="text-xl cursor-pointer">⋯</span>
                  </button>
                </div>
              )}

              {/* Action menu (visible when clicked) */}
              {!showActionMenu && activeMessageId === message.id && (
                <div className="absolute right-3 top-10 bg-white rounded-md shadow-lg z-20 w-48 py-1 border border-gray-200">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left text-sm"
                    onClick={() => handleReply(message)}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  {/* <button className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left text-sm">
                    <Forward className="w-4 h-4" />
                    <span>Forward</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left text-sm">
                    <Link2 className="w-4 h-4" />
                    <span>Copy link</span>
                  </button> */}
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left text-sm">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
}

export default Messages;
