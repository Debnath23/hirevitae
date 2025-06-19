"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Call, Inbox, MonotoneAdd, Search2 } from "@/public/icons/index";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ConversationHeader() {
  const { selectedUser } = useChatStore();
  const { isUserOnline } = useAuthStore();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const online = isUserOnline(selectedUser?.id);

  if (!selectedUser) {
    return (
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex items-center justify-center">
          <span className="text-[#475569] text-sm font-[500]">
            Select a conversation to start chatting
          </span>
        </div>
      </div>
    );
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
                online ? "bg-[#22C55E]" : "bg-[#CBD5E1]"
              }`}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="font-[700] text-[#1E293B] text-base truncate">
                {selectedUser?.name || "Unknown User"}
              </h2>
              {/* Dynamic Online/Offline Badge */}
              <Badge
                className={`${
                  online
                    ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E]"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
                } font-[700] text-xs px-2 py-1 rounded-[3px] flex items-center`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    online ? "bg-[#22C55E]" : "bg-[#CBD5E1]"
                  }`}
                ></span>
                {online ? "Online" : "Offline"}
              </Badge>
            </div>

            {/* Status Text - Shows typing or email */}
            <div className="flex items-center space-x-2">
              {false ? (
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
                  <span className="text-[#22C55E] text-sm font-[500]">
                    typing...
                  </span>
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
            <Image
              src={Inbox || "/placeholder.svg"}
              alt="inbox"
              width={16}
              height={16}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-colors bg-[#883DCF] text-[#FFFFFF] hover:bg-[#7c3aed] cursor-pointer"
          >
            <Image
              src={Call || "/placeholder.svg"}
              alt="call"
              width={19}
              height={19}
            />
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
                      online ? "bg-[#22C55E]" : "bg-[#CBD5E1]"
                    }`}
                  ></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-[#1E293B]">
                    {selectedUser?.name || "Unknown User"}
                  </h3>
                  <p className="text-[#475569]">
                    {selectedUser?.email || "No email provided"}
                  </p>
                  {/* <Badge
                    className={`${
                      onlineUsers.includes(selectedUser.id)
                        ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E]"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
                    } font-[500]`}
                  >
                    {getLastSeenText()}
                  </Badge> */}
                </div>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Status:</span>
                    <span
                      className={online ? "text-[#22C55E]" : "text-[#64748B]"}
                    >
                      {online ? "Online" : "Offline"}
                    </span>
                  </div>
                  {selectedUser?.id && (
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">User ID:</span>
                      <span className="text-[#475569] font-mono text-xs">
                        {selectedUser.id}
                      </span>
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
    </div>
  );
}

export default ConversationHeader;
