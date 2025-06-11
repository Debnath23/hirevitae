"use client";

import React, { use, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DeviceMobileCamera,
  Emoji1,
  Emoji2,
  Emoji3,
  FileImage,
  FolderOpen,
  LinkSimple,
} from "@/public/icons/index";
import { useChatStore } from "@/store/useChatStore";
import { formatMessageTime } from "@/lib/utils";

// const messages = [
//   {
//     id: 1,
//     user: "Vermillion Gray",
//     avatar: "/images/avatar-39.png",
//     time: "02:22 AM",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//     attachments: [
//       { type: "project", name: "Web Design Project", icon: FolderOpen },
//       {
//         type: "prototype",
//         name: "Figma App Prototype",
//         icon: DeviceMobileCamera,
//       },
//     ],
//     reactions: {
//       heart: 22,
//       thumbsUp: 241,
//       smile: 55,
//     },
//   },
//   {
//     id: 2,
//     user: "Oarack Babama",
//     avatar: "/images/avatar-40.png",
//     time: "02:22 AM",
//     content: "Lorem ipsum dolor sit amet,",
//     isAdmin: true,
//   },
//   {
//     id: 3,
//     user: "Mai Sakurajima",
//     avatar: "/images/avatar-41.png",
//     time: "02:22 AM",
//     content:
//       "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     attachments: [
//       { type: "link", name: "Project Link", icon: LinkSimple },
//       { type: "image", name: "Web Design Image", icon: FileImage },
//     ],
//     date: "Friday",
//   },
//   {
//     id: 4,
//     user: "Brooklyn Simmons",
//     avatar: "/images/avatar-42.png",
//     time: "08:52 PM",
//     content:
//       "Hi, everyone! I just make my first thread. Don't forget, if you are want to comment please refer it to general. Thank you for the support!",
//     quote: {
//       text: "I built an app design in 6 hours that makes $1,500/month.",
//       parts: "6 parts",
//       avatar: "/images/avatar-44.png",
//     },
//     reactions: {
//       heart: 12,
//     },
//     date: "Today",
//   },
// ];

function Messages() {
  const { messages, getMessages, selectedUser } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser?.id);
  }, [getMessages]);

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
      {messages.map((message) => (
        <div key={message.id}>
          {/* Date separator */}
          {message.createdAt && (
            <div className="flex justify-center my-6">
              <span className="text-[#475569] text-sm font-[700]">
                {/* {formatMessageTime(message.createdAt)} */}
              </span>
            </div>
          )}

          <div className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm">
            <div className="w-8 h-8">
              <Image
                src={message.avatar || "/images/avatar.png"}
                alt={message.user || "User Avatar"}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-[700] text-base text-[#1E293B]">
                  {message?.sender?.name}
                </span>
                {message.isAdmin && (
                  <Badge className="bg-[#EEF2FF] text-[#4F46E5] text-xs px-2 py-1 rounded-[3px] font-[700]">
                    Admin
                  </Badge>
                )}
                <span className="text-[#94A3B8] text-sm font-[500]">
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>

              <p className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3">
                {message.emoji !== ""
                  ? message.text
                  : message.text + message.emoji}
              </p>

              {/* Quote */}
              {/* {message.quote && (
                <div className="border-l-4 border-[#0053F2] bg-[#FCFCFC] p-2 mb-3 rounded-r">
                  <div className="flex items-center space-x-2 mb-1">
                    <Image
                      src={message.quote.avatar || "/images/avatar.png"}
                      alt="Quote author"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-[#0053F2] text-sm font-[400]">
                        {message.quote.text}
                      </div>
                      <div className="text-[#656F7D] text-sm font-[400]">
                        — {message.quote.parts}
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Attachments */}

              <div className="flex flex-wrap gap-2 mb-3">
                {message.linkTitle && message.linkTarget && (
                  <a
                    href={message.linkTarget}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
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
                      <p className="text-[#475569] font-[700]text-sm">
                        {message.linkTitle}
                      </p>
                    </Button>
                  </a>
                )}

                {message.imageUrl && (
                  <a
                    href={message.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                    >
                      <Image
                        src={FolderOpen}
                        width={16}
                        height={16}
                        alt="icon"
                        className="mr-2"
                      />
                      <p className="text-[#475569] font-[700]text-sm">
                        {message.linkTitle}
                      </p>
                    </Button>
                  </a>
                )}
              </div>

              {/* Reactions */}
              {/* {message.reactions && (
                <div className="flex items-center space-x-4">
                  {message.reactions.heart && !message.quote ? (
                    <div className="flex items-center space-x-1.5 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer">
                      <Image src={Emoji1} width={16} height={22} alt="icon" />
                      <span className="text-base font-[700] text-[#475569]">
                        {message.reactions.heart}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 bg-[#F7F7F7] border border-[#EEEDF0] py-1 px-2 rounded-[19px] cursor-pointer">
                      <span className="text-xs font-[400] text-[#646464]">
                        {message.reactions.heart}
                      </span>
                      <Image src={Emoji1} width={14} height={14} alt="icon" />
                    </div>
                  )}
                  {message.reactions.thumbsUp && (
                    <div className="flex items-center space-x-1.5 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer">
                      <Image src={Emoji2} width={16} height={22} alt="icon" />
                      <span className="text-base font-[700] text-[#475569]">
                        {message.reactions.thumbsUp}
                      </span>
                    </div>
                  )}
                  {message.reactions.smile && (
                    <div className="flex items-center space-x-1.5 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer">
                      <Image src={Emoji3} width={16} height={22} alt="icon" />
                      <span className="text-base font-[700] text-[#475569]">
                        {message.reactions.smile}
                      </span>
                    </div>
                  )}
                </div>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Messages;
