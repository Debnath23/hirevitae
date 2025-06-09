import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import React, { useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, Filter, Search, SeenCheckmark } from "@/public/icons/index";
import { Input } from "../ui/input";

export default function MessagesSection() {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getMessages,
  } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return (
    <div className="w-80 border-r border-[#e2e8f0] flex flex-col">
      {/* Messages Header */}
      <div className="px-6 py-4 bg-[#EEF2FF] border-[#e2e8f0] flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-[800] text-[#1E293B]">Messages</h1>
          <Badge className="bg-[#FFF1F2] text-[#F43F5E] border border-[#FFE4E6] rounded-full px-2 py-1 text-sm">
            25
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
            className="pl-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-full h-12 text-[#475569] text-base font-[500]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {users.map((user: any) => (
          <div
            key={user.id}
            className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
              user?.online && user?.unread > 0
                ? " border-l-2 border-l-[#6e6af0]"
                : "bg-[#FFFFFF]"
            } ${
                selectedUser?.id === user.id
                  ? "border-l-2 border-l-[#6e6af0]"
                  : "bg-[#FFFFFF]"
              }`}
            onClick={() => setSelectedUser(user)}
          >
            {/* Avatar */}
            <div className="relative mr-3">
              <Image
                src={user?.avatar || "/images/avatar-47.png"}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              {user?.online ? (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
              ) : (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#CBD5E1] border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-[700] text-[#1E293B] truncate text-base">
                  {user.name}
                </h3>
                <span className="text-xs text-[##5F5F5F] ml-2 font-[400]">
                  {user?.time}
                  12:25
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`truncate ${
                    user?.isTyping
                      ? "text-[#24D059] font-[400] text-xs"
                      : "text-[#475569] text-sm font-[500]"
                  }`}
                >
                  {user?.message}
                  Enter your message description he...
                </p>
                <div className="flex items-center space-x-2 ml-2">
                  {user?.hasCheckmark && (
                    <div className="text-[#22c55e]">
                      <Image
                        src={SeenCheckmark}
                        width={20}
                        height={20}
                        alt="seen-checkmark"
                      />
                    </div>
                  )}
                  {user?.unread > 0 && (
                    <Badge
                      className={`${
                        user?.online
                          ? "bg-[#4F46E5] text-white"
                          : "bg-[#E2E8F0] text-black"
                      } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center`}
                    >
                      {user?.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
