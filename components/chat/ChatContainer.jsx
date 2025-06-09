"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore.js";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.tsx";
import EmojiPicker from "./EmojiPicker.tsx";
import MessageReactions from "./MessageReactions.tsx";
import { MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore.js";
import { formatMessageTime } from "@/lib/utils";

function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?.id) {
      getMessages(selectedUser.id);
    }
  }, [selectedUser?.id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat flex ${
                message.senderId === authUser.id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full">
                  <img
                    src={
                      message.senderId === authUser.id
                        ? authUser.avatar
                        : selectedUser.avatar
                    }
                    alt="profile pic"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="chat-bubble flex flex-col ml-1 relative group">
                  {message.fileUrl && (
                    <img
                      src={message.fileUrl || "/placeholder.svg"}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p className="text-lg">{message.text}</p>}

                  {/* Emoji Picker - shows on hover */}
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EmojiPicker messageId={message.id} />
                  </div>
                </div>

                {/* Message Reactions */}
                <MessageReactions
                  reactions={message.reactions || []}
                  messageId={message.id}
                />

                <div className="chat-header">
                  <time className="text-xs opacity-50">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-1 flex-col items-center justify-center p-16 bg-slate-200 rounded-lg">
            <div className="max-w-md text-center space-y-6">
              <div className="flex justify-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                    <MessageSquare className="w-8 h-8 text-primary " />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold">No Messages found!</h2>
            </div>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
