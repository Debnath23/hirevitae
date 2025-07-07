"use client";

import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, Filter, Search, SeenCheckmark } from "@/public/icons/index";
import { Input } from "../ui/input";
import formatMessageTime from "@/lib/format-message-time";
import { useAuthStore } from "@/store/useAuthStore";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import { ArrowLeft, Calendar, Trophy, Zap } from "lucide-react";

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), "style"],
    u: [],
  },
};

export default function MessagesSection() {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadCounts,
    markMessagesAsRead,
    unreadMessages,
  } = useChatStore();

  const { authUser, isUserOnline, allTypingUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  type ChatUser = (typeof users)[number] & {
    lastMessageTime?: string | null;
    lastMessage?: string;
    lastMessageSenderId?: string;
    lastMessageSeen?: string;
    interviewInvitationReceived?: boolean;
    isShortlisted?: boolean;
    interviewScheduled?: boolean;
    inTouch?: boolean;
  };

  const sortedUsers = useMemo(() => {
    return [...(users as ChatUser[])].sort((a, b) => {
      const aOnline = isUserOnline(a.id);
      const bOnline = isUserOnline(b.id);
      const aTyping = allTypingUsers[a.id] || false;
      const bTyping = allTypingUsers[b.id] || false;

      // Typing users come first
      if (aTyping && !bTyping) return -1;
      if (!aTyping && bTyping) return 1;

      // Then online users
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;

      // Then by last message time
      const aTime = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : 0;
      const bTime = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : 0;
      return bTime - aTime;
    });
  }, [users, isUserOnline, allTypingUsers]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery)
    );
  }, [sortedUsers, searchQuery]);

  const handleUserClick = async (user: any) => {
    await markMessagesAsRead(user.id);
    setSelectedUser(user);
  };

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
            <div
              key={index}
              className="px-6 py-4 border-b border-[#f2f2f9] animate-pulse"
            >
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
    );
  }

  return (
    <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
      {/* Messages Header */}
      <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-[800] text-[#1E293B]">Messages</h1>
          <Badge className="bg-[#FFF1F2] text-[#F43F5E] border border-[#FFE4E6] rounded-full px-2 py-1 text-sm">
            {Object.values(unreadCounts).reduce((acc, count) => acc + count, 0)}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Image src={Plus} width={24} height={24} alt="plus" />
          </Button>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Image src={Filter} width={24} height={24} alt="filter" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-[#EEF2FF] border-b border-[#CBD5E1]">
        <div className="relative">
          <Image
            src={Search}
            width={20}
            height={20}
            alt="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
          />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="pl-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-full h-12 text-[#475569] text-base font-[500]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar bg-[#FFFFFF]">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?.id === user.id;
          const isOnline = isUserOnline(user.id);
          const isTyping = allTypingUsers[user.id] || false;
          const unreadCount = unreadCounts[user.id] || 0;

          const preProcessedMessage = (message?: string) => {
            if (!message) return undefined;

            const messageText = message.replace(/\+\+(.+?)\+\+/g, "<u>$1</u>");

            return messageText;
          };

          return (
            <div
              key={user.id}
              className={`flex items-start px-6 py-4 h-32 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
                isSelected
                  ? "border-l-2 border-l-[#6e6af0] bg-[#f8fafc]"
                  : "bg-[#FFFFFF]"
              }`}
              onClick={() => handleUserClick(user)}
            >
              {/* Avatar with Online Status */}
              <div className="relative mr-2">
                <Image
                  src={user?.avatar || "/images/avatar.png"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    isOnline ? "bg-[#22C55E]" : "bg-[#CBD5E1]"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-[700] text-[#1E293B] truncate text-base">
                      {user.name}
                    </h3>
                  </div>
                  <span className="text-xs text-[#5F5F5F] ml-2 font-[400]">
                    {unreadCount > 0 && unreadMessages[user.id]?.time
                      ? formatMessageTime(unreadMessages[user.id].time)
                      : user.lastMessageTime
                      ? formatMessageTime(user.lastMessageTime)
                      : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {isTyping ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-[#24D059] font-[400] text-xs ml-2">
                          typing...
                        </span>
                      </div>
                    ) : (
                      <div className="text-[#475569] text-sm font-[500] truncate">
                        {unreadCount > 0 ? (
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
                            {preProcessedMessage(
                              unreadMessages[user.id]?.message
                            ) ?? "New message"}
                          </ReactMarkdown>
                        ) : (
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
                            {preProcessedMessage(user.lastMessage) ??
                              "No messages yet"}
                          </ReactMarkdown>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {user.lastMessage &&
                      user.lastMessageSenderId === authUser?.id &&
                      user.lastMessageSeen && (
                        <div className="text-[#22c55e]">
                          <Image
                            src={SeenCheckmark}
                            width={16}
                            height={16}
                            alt="seen-checkmark"
                          />
                        </div>
                      )}

                    {unreadCount > 0 && (
                      <Badge
                        className={`${
                          isOnline
                            ? "bg-[#4F46E5]"
                            : "bg-[#E2E8F0] text-[#475569]"
                        } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and notifications */}
              {!user.interviewInvitationReceived && (
                <div className="flex items-center gap-1 text-red-500 absolute bottom-9 left-8">
                  <ArrowLeft className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    Interview invitation received. Confirm now?
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-1 absolute bottom-2 left-8">
                {!user.isShortlisted && (
                  <div className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-[3.26px]">
                    <Trophy className="w-3 h-3" />
                    <span className="text-xs font-medium">Shortlisted</span>
                  </div>
                )}
                {!user.interviewScheduled && (
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-0.5 rounded-[3.26px]">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      Interview scheduled
                    </span>
                  </div>
                )}
                {user.inTouch && (
                  <div className="flex items-center gap-1 text-[#3b82f6] bg-blue-100 px-2 py-0.5 rounded-[3.26px]">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-medium">In touch</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {users.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-[#1E293B] mb-2">
                No conversations
              </h3>
              <p className="text-[#475569] text-sm">
                Start a new conversation to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
