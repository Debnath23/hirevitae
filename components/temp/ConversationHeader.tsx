"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Call, Inbox, MonotoneAdd, Search2 } from "@/public/icons/index";
import { useChatStore } from "@/store/useChatStore";

function ConversationHeader() {
  const { selectedUser } = useChatStore();
  return (
    <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="/images/avatar-40.png"
              alt="Azunyan U. Wu"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-[700] text-[#1E293B] text-base">
                {selectedUser?.name}
              </h2>
              <Badge className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E] font-[700] text-xs px-2 py-1 rounded-[3px]">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>{" "}
                Online
              </Badge>
            </div>

            <span className="text-[#475569] text-sm font-[500]">
              {selectedUser?.email || "No email provided"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#F4ECFB] text-[#883DCF] hover:bg-[#dfd9e9] rounded-full cursor-pointer"
          >
            <Image src={Inbox} alt="inbox" width={16.31} height={16.31} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#883DCF] text-[#FFFFF] hover:bg-[#7c3aed] rounded-full cursor-pointer"
          >
            <Image src={Call} alt="inbox" width={19.58} height={19.58} />
          </Button>
          <Button className="bg-[#4F46E5] text-white text-sm font-[700] hover:bg-[#5b56e8] rounded-[3px] px-4 cursor-pointer">
            View Profile
          </Button>
          <Button variant="ghost" size="icon">
            <Image
              src={Search2}
              width={24}
              height={24}
              alt="search"
              className="text-[#475569] cursor-pointer"
            />
          </Button>
          <Button variant="ghost" size="icon">
            <Image
              src={MonotoneAdd}
              width={24}
              height={24}
              alt="search"
              className="text-[#CBD5E1] cursor-pointer"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConversationHeader;
