"use client";

import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, Filter, Search, SeenCheckmark } from "@/public/icons/index";
import { Input } from "../ui/input";
import formatMessageTime from "@/lib/format-message-time";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/lib/types";

export default function MessagesSection() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

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
            {/* {users.length}  */}
            {/* here must be the number of messages are unread for the user */}0
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Image
              src={Plus || "/placeholder.svg"}
              width={24}
              height={24}
              alt="plus"
            />
          </Button>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Image
              src={Filter || "/placeholder.svg"}
              width={24}
              height={24}
              alt="filter"
            />
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

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {users.map((user: any) => {
          const isSelected = selectedUser?.id === user.id;

          return (
            <div
              key={user.id}
              className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
                isSelected
                  ? "border-l-2 border-l-[#6e6af0] bg-[#f8fafc]"
                  : "bg-[#FFFFFF]"
              }`}
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
                {onlineUsers.includes(user.id) ? (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#CBD5E1] border-2 border-white rounded-full"></div>
                )}
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
                    {user.lastMessageTime
                      ? formatMessageTime(user.lastMessageTime)
                      : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {false ? (
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
                        <span className="text-[#24D059] font-[400] text-xs ml-2">
                          typing...
                        </span>
                      </div>
                    ) : (
                      <p className="text-[#475569] text-sm font-[500] truncate">
                        {user.lastMessage
                          ? user.lastMessage
                          : "No messages yet"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {user.lastMessage && user.lastMessage.read && (
                      <div className="text-[#22c55e]">
                        <Image
                          src={SeenCheckmark || "/placeholder.svg"}
                          width={16}
                          height={16}
                          alt="seen-checkmark"
                        />
                      </div>
                    )}
                    {/* {unreadCount > 0 && (
                      <Badge
                        className={`${
                          userIsOnline ? "bg-[#4F46E5] text-white" : "bg-[#E2E8F0] text-[#475569]"
                        } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )} */}
                  </div>
                </div>
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
