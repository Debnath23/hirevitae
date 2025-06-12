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

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Check, CheckCheck, RefreshCw, AlertTriangle } from "lucide-react";

// Format time
function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffInHours < 24
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString();
}

// API message type
interface ApiMessage {
  id: number;
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  fontSize: string;
  linkTitle: string | null;
  linkTarget: string | null;
  emoji: string | null;
  imageName: string | null;
  imageUrl: string | null;
  codeLanguage: string | null;
  codeContent: string | null;
  seen: number;
  senderId: number;
  receiverId: number;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
  };
  reactions?: {
    emoji: {
      native: string;
    };
    count: number;
  }[];
}

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
  } = useChatStore();

  const { authUser, checkAuth } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

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

  const handleAddReaction = async (messageId: string, emoji: string) => {
    await addReaction(messageId, {
      id: emoji,
      native: emoji,
      name: emoji,
    });
  };

  const handleRetryConnection = () => {
    if (authUser?.id) {
      retrySocketConnection(authUser.id);
    }
  };

  const parseMessageText = (
    text: string,
    linkTitle: string | null,
    imageUrl: string | null
  ) => {
    let cleanText = text;
    if (linkTitle && text.includes(linkTitle)) {
      cleanText = cleanText.replace(linkTitle, "").trim();
    }
    if (imageUrl && text.includes("[Image:")) {
      cleanText = cleanText.replace(/\[Image:.*?\]/g, "").trim();
    }
    return cleanText;
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
      {/* Socket connection status */}
      {socketError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">
                Real-time chat unavailable:{" "}
                {socketError.includes("timeout")
                  ? "Server not responding"
                  : socketError}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryConnection}
              disabled={socketConnecting}
            >
              <RefreshCw
                className={`w-3 h-3 mr-1 ${
                  socketConnecting ? "animate-spin" : ""
                }`}
              />
              Retry
            </Button>
          </div>
        </div>
      )}

      {socketConnecting && !socketError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700">
              Connecting to real-time chat...
            </span>
          </div>
        </div>
      )}

      {socketConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">
              Real-time chat connected
            </span>
          </div>
        </div>
      )}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}

      {messages.map((message: any, index: number) => {
        const apiMessage = message as ApiMessage;
        const isOwnMessage =
          apiMessage.senderId === authUser?.id ||
          apiMessage.senderId === Number(authUser?.id);

        const senderName = apiMessage.sender?.name || "Unknown User";
        const cleanMessageText = parseMessageText(
          apiMessage.text,
          apiMessage.linkTitle,
          apiMessage.imageUrl
        );

        return (
          <div
            key={apiMessage.id || index}
            className={`chat flex ${
              isOwnMessage ? "chat-end justify-end" : "chat-start justify-start"
            }`}
          >
            <div className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm w-full group">
              {!isOwnMessage && (
                <div className="w-8 h-8 flex-shrink-0">
                  <Image
                    src={"/images/avatar.png"}
                    alt={`${senderName} Avatar`}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-[700] text-base text-[#1E293B]">
                    {senderName}
                  </span>
                  <span className="text-[#94A3B8] text-sm font-[500]">
                    {formatMessageTime(apiMessage.createdAt)}
                  </span>
                  {isOwnMessage && (
                    <span className="text-xs">
                      {apiMessage.seen ? (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>

                <div
                  className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3"
                  style={{
                    fontSize: `${apiMessage.fontSize}px`,
                    fontWeight: apiMessage.bold ? "bold" : "normal",
                    fontStyle: apiMessage.italic ? "italic" : "normal",
                    textDecoration: apiMessage.underline ? "underline" : "none",
                    listStyleType: apiMessage.unorderedList
                      ? "disc"
                      : apiMessage.orderedList
                      ? "decimal"
                      : "none",
                    paddingLeft:
                      apiMessage.unorderedList || apiMessage.orderedList
                        ? "20px"
                        : "12px",
                  }}
                >
                  {cleanMessageText}
                  {apiMessage.emoji && (
                    <span className="ml-0">{apiMessage.emoji}</span>
                  )}
                </div>

                {apiMessage.codeContent && (
                  <div className="bg-gray-900 text-green-400 p-3 rounded-md mb-3 font-mono text-sm overflow-x-auto">
                    <div className="text-xs text-gray-400 mb-2">
                      {apiMessage.codeLanguage || "code"}
                    </div>
                    <pre>{apiMessage.codeContent}</pre>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {apiMessage.linkTitle && apiMessage.linkTarget && (
                    <a
                      href={apiMessage.linkTarget}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                      >
                        <span className="w-4 h-4 mr-2">🔗</span>
                        <p className="text-[#475569] font-[700] text-sm">
                          {apiMessage.linkTitle}
                        </p>
                      </Button>
                    </a>
                  )}

                  {apiMessage.imageName && (
                    <a
                      href={apiMessage.imageUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                      >
                        <span className="w-4 h-4 mr-2">📁</span>
                        <p className="text-[#475569] font-[700] text-sm">
                          {apiMessage.imageName}
                        </p>
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {isOwnMessage && (
                <div className="w-8 h-8 flex-shrink-0">
                  <Image
                    src={authUser?.avatar || "/images/avatar.png"}
                    alt="Your Avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
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
