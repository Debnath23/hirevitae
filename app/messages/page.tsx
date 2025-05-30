"use client";

import { Facebook, ChevronRight, FileText, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Vector,
  Users,
  Settings,
  Briefcase,
  Barcode,
  UserPlus,
  ChatText,
  BankCard,
  Logout,
  Plus,
  Filter,
  Search,
  SeenCheckmark,
  Call,
  DeviceMobileCamera,
  FolderOpen,
  Inbox,
  MonotoneAdd,
  Search2,
  LinkSimple,
  FileImage,
  Emoji1,
  Emoji2,
  Emoji3,
  TablerBold,
  TablerCode,
  TablerItalic,
  TablerLink,
  TablerList,
  TablerListNumbers,
  TablerMoodSmile,
  TablerUnderline,
  ChevronDown,
  Photo,
  Send,
  Verified,
  EmployersLogo,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Alarm,
  Star,
  Img,
  AtSign,
  CalendarBlank,
  BellSimple,
  AlertCircle,
  File,
  Calendar,
} from "@/public/icons/index";

const conversations = [
  {
    id: 1,
    name: "X-AE-A-13b",
    message: "Enter your message description here...",
    time: "9 hours ago",
    avatar: "/images/avatar-39.png",
    online: true,
    unread: 0,
  },
  {
    id: 2,
    name: "Madagascar Silver",
    message: "Enter your message description he...",
    time: "20 min",
    avatar: "/images/avatar-40.png",
    online: false,
    unread: 0,
    hasCheckmark: true,
  },
  {
    id: 3,
    name: "Pippins McGray",
    message: "Enter your message description here...",
    time: "12:25",
    avatar: "/images/avatar-41.png",
    online: true,
    unread: 0,
  },
  {
    id: 4,
    name: "McKinsey Vermillion",
    message: "Enter your message description he...",
    time: "12:25",
    avatar: "/images/avatar-42.png",
    online: true,
    unread: 8,
    isSelected: true,
  },
  {
    id: 5,
    name: "Dorian F. Gray",
    message: "Enter your message description he...",
    time: "12:25",
    avatar: "/images/avatar-43.png",
    online: false,
    unread: 2,
  },
  {
    id: 6,
    name: "Benedict Combersmacks",
    message: "Enter your message description here...",
    time: "12:25",
    avatar: "/images/avatar-44.png",
    online: false,
    unread: 0,
  },
  {
    id: 7,
    name: "Saylor Twift",
    message: "Enter your message description here...",
    time: "12:25",
    avatar: "/images/avatar-45.png",
    online: true,
    unread: 0,
  },
  {
    id: 8,
    name: "Miranda Blue",
    message: "Enter your message description here...",
    time: "12:25",
    avatar: "/images/avatar-46.png",
    online: false,
    unread: 0,
  },
  {
    id: 9,
    name: "Oarack Babama",
    message: "Enter your message description he...",
    time: "12:25",
    avatar: "/images/avatar-47.png",
    online: true,
    unread: 7,
  },
  {
    id: 10,
    name: "Ali Khan",
    message: "Typing...",
    time: "1 min",
    avatar: "/images/avatar-48.png",
    online: false,
    unread: 0,
    isTyping: true,
  },
];

const messages = [
  {
    id: 1,
    user: "Vermillion Gray",
    avatar: "/images/avatar-39.png",
    time: "02:22 AM",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    attachments: [
      { type: "project", name: "Web Design Project", icon: FolderOpen },
      {
        type: "prototype",
        name: "Figma App Prototype",
        icon: DeviceMobileCamera,
      },
    ],
    reactions: {
      heart: 22,
      thumbsUp: 241,
      smile: 55,
    },
  },
  {
    id: 2,
    user: "Oarack Babama",
    avatar: "/images/avatar-40.png",
    time: "02:22 AM",
    content: "Lorem ipsum dolor sit amet,",
    isAdmin: true,
  },
  {
    id: 3,
    user: "Mai Sakurajima",
    avatar: "/images/avatar-41.png",
    time: "02:22 AM",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    attachments: [
      { type: "link", name: "Project Link", icon: LinkSimple },
      { type: "image", name: "Web Design Image", icon: FileImage },
    ],
    date: "Friday",
  },
  {
    id: 4,
    user: "Brooklyn Simmons",
    avatar: "/images/avatar-42.png",
    time: "08:52 PM",
    content:
      "Hi, everyone! I just make my first thread. Don't forget, if you are want to comment please refer it to general. Thank you for the support!",
    quote: {
      text: "I built an app design in 6 hours that makes $1,500/month.",
      parts: "6 parts",
      avatar: "/images/avatar-44.png",
    },
    reactions: {
      heart: 12,
    },
    date: "Today",
  },
];

const sidebarItems = [
  { icon: Vector, color: "#6e6af0", isActive: false },
  { icon: UserPlus, color: "#3e90f0", isActive: false },
  { icon: Briefcase, color: "#0e7490", isActive: false },
  { icon: Barcode, color: "#ee6723", isActive: false },
  { icon: Users, color: "#a3a3a3", isActive: false },
  { icon: ChatText, color: "#6e6af0", isActive: true },
  { icon: BankCard, color: "#8e55ea", isActive: false },
  { icon: Settings, color: "#6c7275", isActive: false },
  { icon: Logout, color: "#6c7275", isActive: false },
];

const socialLinks = [
  { icon: EmployersLogo, color: "#E7F0FA", href: "#" },
  { icon: Twitter, color: "#0961F5", href: "#" },
  { icon: Linkedin, color: "#E7F0FA", href: "#" },
  { icon: Instagram, color: "#E7F0FA", href: "#" },
  { icon: Youtube, color: "#E7F0FA", href: "#" },
];

const statsItems = [
  { icon: Star, label: "Your star messages", count: 0, color: "#FFF7E7" },
  { icon: Img, label: "Docs, files, media", count: 96, color: "#FFEEF7" },
  { icon: AtSign, label: "Tagged", count: 1, color: "#E1EBFF" },
];

const activities = [
  {
    id: 1,
    title: "Payroll payment is due",
    subtitle: "Payroll due: Process #py22240932 promptly",
    time: "3min ago",
    color: "#DE1C411A",
    icon: AlertCircle,
  },
  {
    id: 2,
    title: "Document approval",
    subtitle: "New document need to be checked contract...doc or #emp22240654",
    time: "21h ago",
    color: "#F0EBFD",
    icon: File,
  },
  {
    id: 3,
    title: "New Meeting",
    subtitle:
      "Angela has set up new meeting for July 30 Monthly report meeting for July 2024",
    time: "2h ago",
    color: "#FFF4E5",
    icon: Calendar,
  },
];

export default function CompleteDashboard() {
  return (
    <div className="flex h-screen my-3 bg-[#f8fafc] w-[1440px] mx-auto">
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Left Sidebar Navigation */}
      <div className="w-16 bg-[#F9F9F9] border-r border-[#E2E8F0] flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="w-8 h-8 flex items-center justify-center mb-4">
          <Image src="/logo.png" width={32} height={32} alt="logo" />
        </div>

        {/* Navigation Icons */}
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`w-full rounded-none h-10 cursor-pointer ${
              item.isActive
                ? "bg-[#F2F2F9] border-l-4 border-[#0961F5]"
                : "hover:bg-[#f2f2f9]"
            }`}
          >
            <Image
              src={item.icon}
              width={24}
              height={24}
              style={{ color: item.color }}
              alt="icon"
            />
          </Button>
        ))}

        {/* Profile at bottom */}
        <div className="mt-auto">
          <div className="w-6 h-6 rounded-full overflow-hidden cursor-pointer">
            <Image
              src="/images/profile-img.jpg"
              alt="Profile"
              width={24}
              height={24}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Messages Section */}
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
              placeholder="Search..."
              className="pl-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-full h-12 text-[#475569] text-base font-[500]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
                conversation.online && conversation.unread > 0
                  ? " border-l-2 border-l-[#6e6af0]"
                  : "bg-[#FFFFFF]"
              }`}
            >
              {/* Avatar */}
              <div className="relative mr-3">
                <Image
                  src={conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                {conversation.online ? (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#CBD5E1] border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-[700] text-[#1E293B] truncate text-base">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-[##5F5F5F] ml-2 font-[400]">
                    {conversation.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className={`truncate ${
                      conversation.isTyping
                        ? "text-[#24D059] font-[400] text-xs"
                        : "text-[#475569] text-sm font-[500]"
                    }`}
                  >
                    {conversation.message}
                  </p>
                  <div className="flex items-center space-x-2 ml-2">
                    {conversation.hasCheckmark && (
                      <div className="text-[#22c55e]">
                        <Image
                          src={SeenCheckmark}
                          width={20}
                          height={20}
                          alt="seen-checkmark"
                        />
                      </div>
                    )}
                    {conversation.unread > 0 && (
                      <Badge
                        className={`${
                          conversation.online
                            ? "bg-[#4F46E5] text-white"
                            : "bg-[#E2E8F0] text-black"
                        } rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center`}
                      >
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Detail Section */}
      <div className="flex-1 flex flex-col bg-[#f8fafc]">
        {/* Conversation Header */}
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
                    Azunyan U. Wu
                  </h2>
                  <Badge className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#22C55E] font-[700] text-xs px-2 py-1 rounded-[3px]">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>{" "}
                    Online
                  </Badge>
                </div>

                <span className="text-[#475569] text-sm font-[500]">
                  @azusanakano_1997
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {/* Date separator */}
              {message.date && (
                <div className="flex justify-center my-6">
                  <span className="text-[#475569] text-sm font-[700]">
                    {message.date}
                  </span>
                </div>
              )}

              <div className="flex space-x-3 bg-white rounded-[8px] p-3 shadow-sm">
                <div className="w-8 h-8">
                  <Image
                    src={message.avatar || "/placeholder.svg"}
                    alt={message.user}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-[700] text-base text-[#1E293B]">
                      {message.user}
                    </span>
                    {message.isAdmin && (
                      <Badge className="bg-[#EEF2FF] text-[#4F46E5] text-xs px-2 py-1 rounded-[3px] font-[700]">
                        Admin
                      </Badge>
                    )}
                    <span className="text-[#94A3B8] text-sm font-[500]">
                      {message.time}
                    </span>
                  </div>

                  <p className="bg-[#F8FAFC] text-[#475569] font-[400] text-base mb-3 leading-relaxed rounded-[3px] p-3">
                    {message.content}
                  </p>

                  {/* Quote */}
                  {message.quote && (
                    <div className="border-l-4 border-[#0053F2] bg-[#FCFCFC] p-2 mb-3 rounded-r">
                      <div className="flex items-center space-x-2 mb-1">
                        <Image
                          src={message.quote.avatar || "/placeholder.svg"}
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
                  )}

                  {/* Attachments */}
                  {message.attachments && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {message.attachments.map((attachment, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                        >
                          <Image
                            src={attachment.icon}
                            width={16}
                            height={16}
                            alt="icon"
                            className="mr-2"
                          />
                          <p className="text-[#475569] font-[700]text-sm">
                            {attachment.name}
                          </p>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {message.reactions && (
                    <div className="flex items-center space-x-4">
                      {message.reactions.heart && !message.quote ? (
                        <div className="flex items-center space-x-1.5 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer">
                          <Image
                            src={Emoji1}
                            width={16}
                            height={22}
                            alt="icon"
                          />
                          <span className="text-base font-[700] text-[#475569]">
                            {message.reactions.heart}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-[#F7F7F7] border border-[#EEEDF0] py-1 px-2 rounded-[19px] cursor-pointer">
                          <span className="text-xs font-[400] text-[#646464]">
                            {message.reactions.heart}
                          </span>
                          <Image
                            src={Emoji1}
                            width={14}
                            height={14}
                            alt="icon"
                          />
                        </div>
                      )}
                      {message.reactions.thumbsUp && (
                        <div className="flex items-center space-x-1.5 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer">
                          <Image
                            src={Emoji2}
                            width={16}
                            height={22}
                            alt="icon"
                          />
                          <span className="text-base font-[700] text-[#475569]">
                            {message.reactions.thumbsUp}
                          </span>
                        </div>
                      )}
                      {message.reactions.smile && (
                        <div className="flex items-center space-x-1.5 bg-[#F1F5F9] py-1 px-2 rounded-[3px] cursor-pointer">
                          <Image
                            src={Emoji3}
                            width={16}
                            height={22}
                            alt="icon"
                          />
                          <span className="text-base font-[700] text-[#475569]">
                            {message.reactions.smile}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Composer */}
        <div className="px-6 py-4">
          <div className="flex flex-col space-y-3 bg-white rounded-[8px] shadow-sm">
            {/* Input Area */}
            <div className="flex-1 p-3">
              <Input
                placeholder="Type a message..."
                className="text-[#8C8C8C] text-sm font-[500] h-12 border-none shadow-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between bg-[#FAFAFA] p-3">
              {/* Formatting Toolbar */}
              <div className="flex items-center">
                <div>
                  <Button
                    variant="ghost"
                    className="text-[#A0AEC0] hover:bg-[#f8fafc]"
                  >
                    <Image src={TablerBold} width={20} height={20} alt="icon" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image
                      src={TablerItalic}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image
                      src={TablerUnderline}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                </div>

                <div className="w-px h-4 bg-[#EEEFF2] mx-2"></div>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image src={TablerList} width={20} height={20} alt="icon" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image
                      src={TablerListNumbers}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image
                      src={ChevronDown}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                </div>

                <div className="w-px h-4 bg-[#e2e8f0] mx-2"></div>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image src={TablerLink} width={20} height={20} alt="icon" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image
                      src={TablerMoodSmile}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image src={Photo} width={20} height={20} alt="icon" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc]"
                  >
                    <Image src={TablerCode} width={20} height={20} alt="icon" />
                  </Button>
                </div>
              </div>
              <Button className="bg-[#0CAF60] text-white hover:bg-[#16a34a] rounded-[3px] px-4 py-2 cursor-pointer">
                <Image src={Send} width={20} height={20} alt="icon" />
                <p className="font-[500] text-sm">Send</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Details Section */}
      <div className="w-96 bg-[#F8F7F7] border-l border-[#e2e8f0] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-xl font-[700] text-[#242424] text-center">
            Candidate Details
          </h1>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-[120.73px] h-[122.96px] rounded-full overflow-hidden border-[1.63px] border-[#31B465]">
              <Image
                src="/images/profile-pic.jpg"
                alt="Udai Reddy Penuballi"
                width={120.73}
                height={122.96}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-1">
              <Image src={Verified} width={21.19} height={21.19} alt="icon" />
            </div>
            <Badge className="absolute -bottom-2 left-9 bg-[#E9FAF7] text-[#31B465] text-xs font-[600] px-2 py-1 rounded-[3px]">
              Online
            </Badge>
          </div>

          <h2 className="text-xl font-[700] text-[#242424] mb-1">
            Udai Reddy Penuballi
          </h2>
          <p className="text-[#25AADF] font-[400] text-xs mb-4">
            Amazon | Senior Product Manager
          </p>

          <div className="flex justify-center space-x-4 mb-6 text-xs font-[500]">
            <Badge className="bg-[#FFF2E6] text-[#FD661F] px-2.5 py-1 rounded-[3.26px]">
              Full Time
            </Badge>
            <Badge className="bg-[#0961F50F] text-[#0961F5] px-2.5 py-1 rounded-[3.26px]">
              Onsite
            </Badge>
            <Badge className="bg-[#25AADF0F] text-[#25AADF] px-2.5 py-1 rounded-[3.26px]">
              1-3 Years
            </Badge>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-3 mb-6">
            {socialLinks.map((social, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-[2.93px]"
                style={{ backgroundColor: social.color }}
              >
                <Image
                  src={social.icon}
                  width={14.64}
                  height={14.64}
                  alt="icon"
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Application Info */}
        <div className="px-6 mb-6">
          <div className="flex justify-center items-center mb-2">
            <span className="text-[#666666] text-sm font-[400]">
              Applied Position:
            </span>
            <div className="w-px h-[13px] border border-[#DCDCDC] mx-1"></div>
            <span className="font-[500] text-sm text-[#131B33]">
              Front End Developer
            </span>
          </div>
          <div className="flex justify-center items-center mb-4">
            <span className="text-[#666666] text-sm font-[400]">
              Applied Date:
            </span>
            <div className="w-px h-[13px] border border-[#DCDCDC] mx-1"></div>
            <span className="font-[500] text-sm text-[#131B33]">
              15 Jan 2025
            </span>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex gap-2 text-center">
              <Badge className="bg-[#FD683E] text-white px-4 py-2 rounded-[3.01px] mb-1 w-[149.33px] h-[31.01px] flex justify-center items-center cursor-pointer">
                <Image src={Alarm} width={15.03} height={15.03} alt="icon" />{" "}
                <span className="font-[600] text-[11px]">Current Stage </span>{" "}
                <ChevronRight className="w-[7.89px] h-[4.5px]" />
              </Badge>
              <div className="w-[88.2px] h-[30.1px] bg-[#0961F50F]">
                <span className="text-[#0961F5] text-xs font-[500]">
                  Shortlisted
                </span>
              </div>
            </div>

            <div className="flex gap-2 text-center">
              <Badge className="bg-[#883DCF] text-white px-4 py-2 rounded-[3.01px] mb-1 w-[149.33px] h-[31.01px] flex justify-center items-center cursor-pointer">
                <Image src={Alarm} width={15.03} height={15.03} alt="icon" />{" "}
                <span className="font-[600] text-[11px]">Upcoming Stage </span>{" "}
                <ChevronRight className="w-[7.89px] h-[4.5px]" />
              </Badge>
              <div className="w-[88.2px] h-[30.1px] bg-[#0961F50F]">
                <span className="text-[#0961F5] text-xs font-[500]">
                  HR Interview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6 px-[15px]">
          {statsItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}` }}
                >
                  <Image src={item.icon} width={16} height={16} alt="icon" />
                </div>
                <span className="text-[#1C1C1C] font-[500] text-sm">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-[700] text-xs text-[#1C1C1C] bg-[#EEEDF0] px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
                <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
              </div>
            </div>
          ))}
        </div>

        {/* Schedules Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-[700] text-[15px] text-[#1E293B]">
                Schedules
              </h3>
              <Badge className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-full w-6 h-6 flex items-center justify-center text-xs font-[600] text-[#F43F5E]">
                25
              </Badge>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          </div>

          <Card className="border-[#e2e8f0]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                  <Image src={Calendar} width={20} height={20} alt="icon" />
                </div>
                <div className="flex-1">
                  <h4 className="font-[700] text-[#475569] text-[11px]">
                    Upcoming Presentation
                  </h4>
                  <p className="text-[#475569] text-[10px] font-[400]">
                    2025/08/12 at 11:21 AM
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <Image src={BellSimple} width={20} height={20} alt="icon" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-[700] text-[15px] text-[#1E293B]">Notes</h3>
              <Badge className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-full w-6 h-6 flex items-center justify-center text-xs font-[600] text-[#F43F5E]">
                25
              </Badge>
            </div>
            <Image src={ChevronDown} width={16} height={16} alt="icon" />
          </div>

          <div className="space-y-0">
            {[1, 2].map((note) => (
              <Card key={note} className="border-[#e2e8f0]">
                <CardContent className="p-4">
                  <div className="flex flex-col items-start">
                    <div className="flex space-x-3 mb-1 pb-2">
                      <div className="w-10 h-10 bg-[#E8E8E9] rounded-full overflow-hidden cursor-pointer">
                        <Image
                          src="/images/avatar-51.png"
                          alt="Maulida adinda ayu"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-[500] text-[#161924] text-xs">
                            Maulida adinda ayu
                          </span>
                        </div>
                        <p className="text-[#73757C] text-[10px] font-[400] mb-1">
                          Admin, owner
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#e2e8f0]"></div>

                    <div className="mt-1">
                      <p className="text-[#161924] text-[10px] font-[400] mb-1">
                        We will meeting for this project and deals, we still
                        meting at Monday, 02 January 2025 at 08:30pm.
                      </p>
                      <span className="text-[#73757C] text-[10px] font-[400]">
                        5 minute ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-[700] text-[15px] text-[#1E293B]">
                Activities
              </h3>
              <Badge className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-full w-6 h-6 flex items-center justify-center text-xs font-[600] text-[#F43F5E]">
                25
              </Badge>
            </div>
            <Image src={ChevronDown} width={16} height={16} alt="icon" />
          </div>

          <div className="mb-2">
            <span className="text-[#A2A4AC] text-xs font-[400]">Today</span>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="border-[#e2e8f0]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: activity.color }}
                    >
                      <Image
                        src={activity.icon}
                        alt="icon"
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-[500] text-[#09090B] text-[11px]">
                          {activity.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-[#09090B] font-[400] text-[10px]">
                            {activity.time}
                          </span>
                          <div className="w-2 h-2 rounded-full bg-[#FF0000]"></div>
                        </div>
                      </div>
                      <p className="text-[#717179] font-[400] text-[10px]">
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
