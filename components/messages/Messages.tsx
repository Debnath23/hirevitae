"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Reply } from "lucide-react";
import {
  DeviceMobileCamera,
  Emoji1,
  Emoji2,
  Emoji3,
  FileImage,
  LinkSimple,
} from "@/public/icons";
import formatMessageTime from "@/lib/format-message-time";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), "style"],
    u: [],
  },
};

interface EmojiReaction {
  id: string;
  emoji: string;
  name: string;
}

const emojiReactions: EmojiReaction[] = [
  { id: "1", emoji: "👍", name: "thumbsUp" },
  { id: "2", emoji: "❤️", name: "heart" },
  { id: "3", emoji: "😊", name: "smile" },
];

function groupMessagesByDate(messages: any[]) {
  if (!messages || messages.length === 0) return [];

  const grouped: any[] = [];
  let currentDate: string | null = null;

  messages.forEach((message) => {
    const messageDateObj = new Date(message?.createdAt);
    const today = new Date();
    const isToday =
      messageDateObj.getDate() === today.getDate() &&
      messageDateObj.getMonth() === today.getMonth() &&
      messageDateObj.getFullYear() === today.getFullYear();

    const displayDate = isToday
      ? "Today"
      : messageDateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });

    if (displayDate !== currentDate) {
      grouped.push({ date: displayDate });
      currentDate = displayDate;
    }
    grouped.push(message);
  });

  return grouped;
}

function MessagesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
      {/* Date separator skeleton */}
      <div className="flex justify-center my-6">
        <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      {/* Message skeletons */}
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm relative group animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-3">
            {/* Header skeleton */}
            <div className="flex items-center space-x-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            {/* Message content skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
            {/* Attachment skeleton (randomly shown) */}
            {index % 3 === 0 && (
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Messages() {
  const {
    selectedUser,
    isMessagesLoading,
    setReplyToMessage,
    loadingSelectedUser,
  } = useChatStore();

  const messages = useChatStore((state) => state.messages);

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [codeBlockDialogOpen, setCodeBlockDialogOpen] = useState(false);

  const groupedMessages = groupMessagesByDate(messages);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowReactionMenu(false);
      setShowActionMenu(false);
      setActiveMessageId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleAddReaction = async (messageId: string, emoji: EmojiReaction) => {
    try {
      const response = await api.post(
        `/messages/reaction/${selectedUser?.id}`,
        {
          messageId,
          emoji: {
            id: emoji.id,
            native: emoji.emoji,
            name: emoji.name,
          },
        }
      );

      socket.emit("addReaction", response.data, selectedUser?.id);

      setShowReactionMenu(false);
      setActiveMessageId(null);
    } catch (error) {
      toast.error("🎭💥 Failed to add reaction!");
    }
  };

  const handleReply = (message: any) => {
    setReplyToMessage(message);
    setShowActionMenu(false);
    setActiveMessageId(null);
    const messageInput = document.querySelector(".DraftEditor-root");
    if (messageInput) {
      (messageInput as HTMLElement).focus();
    }
  };

  const parseMessageText = (text: string) => {
    let cleanText = text;
    return cleanText;
  };

  const toggleActionMenu = (e: React.MouseEvent, messageId: number) => {
    e.stopPropagation();
    setActiveMessageId(messageId);
    setShowActionMenu(true);
    setShowReactionMenu(false);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-48 h-48 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-60"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-80"></div>
          <div className="absolute inset-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          No conversation selected
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          Choose a contact from your list to start messaging or create a new
          conversation
        </p>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            New Contact
          </button>
          <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            New Group
          </button>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
        {/* Date separator skeleton */}
        <div className="flex justify-center my-6">
          <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Message skeletons */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm relative group animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

            <div className="flex-1 space-y-3">
              {/* Header skeleton */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>

              {/* Message content skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>

              {/* Attachment skeleton (randomly shown) */}
              {index % 3 === 0 && (
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loadingSelectedUser || isMessagesLoading) {
    return <MessagesSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white rounded-lg">
        <div className="relative w-25 h-25 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-80"></div>
          <div className="absolute inset-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="8" y1="10" x2="8" y2="10.01"></line>
              <line x1="12" y1="10" x2="12" y2="10.01"></line>
              <line x1="16" y1="10" x2="16" y2="10.01"></line>
            </svg>
          </div>
        </div>

        <h3 className="text-xl text-gray-800 mb-2 font-[600]">
          No messages yet
        </h3>
        <p className="text-gray-500 font-[400]">
          Start the conversation by sending your first message to{" "}
          {selectedUser?.name || "this user"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
      {groupedMessages.map((item: any, index: number) => {
        if (item?.date) {
          return (
            <div
              key={`date-${item.date}-${index}`}
              className="flex justify-center my-6"
            >
              <span className="text-[#475569] text-sm font-[700]">
                {item.date}
              </span>
            </div>
          );
        }

        const message = item;
        const messageKey =
          message.id && message.createdAt
            ? `${message.id}-${message.createdAt}-${index}`
            : `fallback-${message.senderId}-${message.createdAt}-${index}`;

        const isOwnMessage =
          message.senderId === authUser?.id ||
          message.senderId === Number(authUser?.id) ||
          message.sender?.id === authUser?.id ||
          message.sender?.id === Number(authUser?.id);

        const senderName = message.sender?.name || "Unknown User";
        const cleanMessageText = parseMessageText(
          message.text || message.content
        );

        const messageText = cleanMessageText.replace(
          /\+\+(.+?)\+\+/g,
          "<u>$1</u>"
        );

        return (
          <div key={messageKey}>
            <div
              className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm relative group"
              onMouseEnter={() => setActiveMessageId(message.id)}
              onMouseLeave={() => {
                if (!showReactionMenu && !showActionMenu) {
                  setActiveMessageId(null);
                }
              }}
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
                </div>

                {/* Quote */}
                {(message.quote || message.replyToMessage) && (
                  <div className="border-l-4 border-[#0053F2] bg-[#FCFCFC] p-2 mb-3 rounded-r">
                    <div className="flex items-center space-x-2 mb-1">
                      <Image
                        src="/images/avatar.png"
                        alt="Quote author"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="text-[#0053F2] text-sm font-[400]">
                          <ReactMarkdown
                            components={{
                              ul: ({ children }) => (
                                <ul className="list-disc pl-5 mb-2">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-5 mb-2">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="mb-1">{children}</li>
                              ),
                            }}
                            rehypePlugins={[
                              rehypeRaw,
                              [rehypeSanitize, customSchema],
                            ]}
                          >
                            {(
                              message.quote?.text ||
                              message.replyToMessage?.text ||
                              message.replyToMessage?.content ||
                              ""
                            ).replace(/\+\+(.+?)\+\+/g, "<u>$1</u>")}
                          </ReactMarkdown>
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

                <div className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3">
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                    }}
                    rehypePlugins={[rehypeRaw, [rehypeSanitize, customSchema]]}
                  >
                    {messageText}
                  </ReactMarkdown>
                </div>

                {/* Attachments */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {message.linkTitle && message.linkTarget && (
                    <a
                      href={message.linkTarget}
                      target="_blank"
                      rel="noreferrer"
                    >
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
                    </a>
                  )}

                  {message.imageName && message.imageUrl && (
                    <a href={message.imageUrl} target="_blank" rel="noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                      >
                        <Image
                          src={FileImage}
                          width={16}
                          height={16}
                          alt="icon"
                          className="mr-2"
                        />
                        <p className="text-[#475569] font-[700] text-sm">
                          {message.imageName}
                        </p>
                      </Button>
                    </a>
                  )}

                  {message.codeLanguage && message.codeContent && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                        onClick={() => setCodeBlockDialogOpen(true)}
                      >
                        <Image
                          src={DeviceMobileCamera}
                          width={16}
                          height={16}
                          alt="icon"
                          className="mr-2"
                        />
                        <p className="text-[#475569] font-[700] text-sm">
                          {message.codeLanguage} Code
                        </p>
                      </Button>

                      {/* Code Block Dialog */}
                      <Dialog
                        open={codeBlockDialogOpen}
                        onOpenChange={setCodeBlockDialogOpen}
                      >
                        <DialogTrigger asChild>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer"
                          >
                            <Image
                              src={TablerCode}
                              width={20}
                              height={20}
                              alt="icon"
                            />
                          </Button> */}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Code Block</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="code-language">Language</Label>
                              <p>{message.codeLanguage}</p>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="code-content">Code</Label>
                              <p
                                id="code-content"
                                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                              >
                                {message.codeContent}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setCodeBlockDialogOpen(false)}
                            >
                              Ok
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center space-x-4 mt-2">
                    {message.reactions.map((reaction: any, idx: number) => (
                      <div
                        key={`${reaction.id || idx}-${
                          reaction.emoji?.name || reaction.name
                        }`}
                        className={`flex items-center space-x-1.5 ${
                          !message.quote
                            ? "bg-[#F1F5F9] py-1 px-2 rounded-[3px]"
                            : "bg-[#F7F7F7] border border-[#EEEDF0] py-1 px-2 rounded-[19px]"
                        } cursor-pointer hover:bg-gray-200 transition-colors`}
                      >
                        <span
                          className={`${
                            !message.quote
                              ? "text-base font-[700] text-[#475569]"
                              : "text-xs font-[400] text-[#646464]"
                          }`}
                        >
                          {reaction.count || 1}
                        </span>
                        <span>
                          {(reaction.emoji?.name === "heart" ||
                            reaction.emojiName === "heart") && (
                            <Image
                              src={Emoji1}
                              width={16}
                              height={16}
                              alt="heart"
                            />
                          )}
                          {(reaction.emoji?.name === "thumbsUp" ||
                            reaction.emojiName === "thumbsUp") && (
                            <Image
                              src={Emoji2}
                              width={16}
                              height={16}
                              alt="thumbsUp"
                            />
                          )}
                          {(reaction.emoji?.name === "smile" ||
                            reaction.emojiName === "smile") && (
                            <Image
                              src={Emoji3}
                              width={16}
                              height={16}
                              alt="smile"
                            />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emoji reaction and action menu (visible on hover) */}
              {activeMessageId === message.id && (
                <div className="absolute right-3 top-[-30px] flex items-center space-x-2 bg-[#F8FAFC] rounded-full px-2 py-1 shadow-lg z-10">
                  <div className="flex space-x-1">
                    {emojiReactions.map((item) => (
                      <button
                        key={item.name}
                        className={`hover:bg-slate-300 p-[1px] rounded-full transition-colors cursor-pointer ${
                          message.isReacting
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!message.isReacting) {
                            handleAddReaction(message.id.toString(), item);
                          }
                        }}
                        disabled={message.isReacting}
                      >
                        <span className="text-lg">{item.emoji}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="text-[#475569] cursor-pointer transition-colors"
                    onClick={(e) => toggleActionMenu(e, message.id)}
                  >
                    <span className="text-xl cursor-pointer">⋯</span>
                  </button>
                </div>
              )}

              {/* Action menu (visible when clicked) */}
              {!showActionMenu && activeMessageId === message.id && (
                <div className="absolute right-3 top-6 bg-white rounded-md shadow-lg z-20 w-48 py-1 border border-gray-200">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left text-sm cursor-pointer"
                    onClick={() => handleReply(message)}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
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
