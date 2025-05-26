"use client";

import {
  Search,
  Plus,
  MoreHorizontal,
  Grid3X3,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  Headphones,
  CreditCard,
  UserCheck,
  Phone,
  Mail,
  Heart,
  ThumbsUp,
  Smile,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Paperclip,
  Code,
  Send,
  Folder,
  ImageIcon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ChevronRight,
  Calendar,
  ChevronDown,
  Star,
  FileText,
  Tag,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
      { type: "project", name: "Web Design Project", icon: Folder },
      { type: "prototype", name: "Figma App Prototype", icon: ImageIcon },
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
      { type: "link", name: "Project Link", icon: Link },
      { type: "image", name: "Web Design Image", icon: ImageIcon },
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
  { icon: Grid3X3, color: "#6e6af0", isActive: false },
  { icon: Users, color: "#3e90f0", isActive: false },
  { icon: MessageCircle, color: "#0e7490", isActive: false },
  { icon: Headphones, color: "#ee6723", isActive: false },
  { icon: UserCheck, color: "#a3a3a3", isActive: false },
  { icon: MessageCircle, color: "#6e6af0", isActive: true },
  { icon: CreditCard, color: "#8e55ea", isActive: false },
  { icon: Settings, color: "#6c7275", isActive: false },
  { icon: LogOut, color: "#6c7275", isActive: false },
];

const socialLinks = [
  { icon: Facebook, color: "#1877f2", href: "#" },
  { icon: Twitter, color: "#1da1f2", href: "#" },
  { icon: Linkedin, color: "#0077b5", href: "#" },
  { icon: Instagram, color: "#e4405f", href: "#" },
  { icon: Youtube, color: "#ff0000", href: "#" },
];

const statsItems = [
  { icon: Star, label: "Your star messages", count: 0, color: "#f59e0b" },
  { icon: FileText, label: "Docs, files, media", count: 96, color: "#ec4899" },
  { icon: Tag, label: "Tagged", count: 1, color: "#3b82f6" },
];

const activities = [
  {
    id: 1,
    title: "Payroll payment is due",
    subtitle: "Payroll due: Process #py22240932 promptly",
    time: "3min ago",
    color: "#ef4444",
    icon: AlertCircle,
  },
  {
    id: 2,
    title: "Document approval",
    subtitle: "New document need to be checked contract...doc or #emp22240654",
    time: "21h ago",
    color: "#ef4444",
    icon: FileText,
  },
  {
    id: 3,
    title: "New Meeting",
    subtitle:
      "Angela has set up new meeting for July 30 Monthly report meeting for July 2024",
    time: "2h ago",
    color: "#f59e0b",
    icon: Users,
  },
];

export default function CompleteDashboard() {
  return (
    <div className="flex h-screen bg-[#f8fafc] w-[1440px] mx-auto">
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
      <div className="w-16 bg-white border-r border-[#e2e8f0] flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="w-8 h-8 bg-[#0e7490] rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-sm font-bold">W</span>
        </div>

        {/* Navigation Icons */}
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-lg ${
              item.isActive
                ? "bg-[#eef2ff] border-l-2 border-[#6e6af0]"
                : "hover:bg-[#f2f2f9]"
            }`}
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
          </Button>
        ))}

        {/* Profile at bottom */}
        <div className="mt-auto">
          <div className="w-8 h-8 rounded-full bg-[#6c7275] flex items-center justify-center">
            <Image
              src="/images/profile-img.jpg"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="w-80 bg-white border-r border-[#e2e8f0] flex flex-col">
        {/* Messages Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#1e293b]">Messages</h1>
            <Badge className="bg-[#ef4444] text-white rounded-full px-2 py-1 text-xs">
              25
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-[#f8fafc] border-[#e2e8f0] rounded-full h-12"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center px-6 py-4 hover:bg-[#f8fafc] cursor-pointer border-b border-[#f2f2f9] relative ${
                conversation.isSelected
                  ? "bg-[#f8fafc] border-l-2 border-l-[#6e6af0]"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative mr-3">
                <Image
                  src={conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-[#1e293b] truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-[#94a3b8] ml-2">
                    {conversation.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm truncate ${
                      conversation.isTyping
                        ? "text-[#22c55e]"
                        : "text-[#6c7275]"
                    }`}
                  >
                    {conversation.message}
                  </p>
                  <div className="flex items-center space-x-2 ml-2">
                    {conversation.hasCheckmark && (
                      <div className="text-[#22c55e]">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {conversation.unread > 0 && (
                      <Badge className="bg-[#6e6af0] text-white rounded-full min-w-[20px] h-5 text-xs flex items-center justify-center">
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
                  src="/images/avatar-44.png"
                  alt="Azunyan U. Wu"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div>
                <h2 className="font-bold text-[#1e293b] text-lg">
                  Azunyan U. Wu
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-[#6c7275] text-sm">
                    @azusanakano_1997
                  </span>
                  <Badge className="bg-[#22c55e] text-white text-xs px-2 py-1 rounded-full">
                    • Online
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#8e55ea] text-white hover:bg-[#7c3aed] rounded-full"
              >
                <Mail className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#8e55ea] text-white hover:bg-[#7c3aed] rounded-full"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button className="bg-[#6e6af0] text-white hover:bg-[#5b56e8] rounded-lg px-4">
                View Profile
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6">
          {messages.map((message, index) => (
            <div key={message.id}>
              {/* Date separator */}
              {message.date && (
                <div className="flex justify-center my-6">
                  <span className="bg-[#e2e8f0] text-[#6c7275] px-3 py-1 rounded-full text-sm">
                    {message.date}
                  </span>
                </div>
              )}

              <div className="flex space-x-3">
                <div className="w-8 h-8">
                  <Image
                    src={message.avatar || "/placeholder.svg"}
                    alt={message.user}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>

                <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-[#1e293b]">
                      {message.user}
                    </span>
                    {message.isAdmin && (
                      <Badge className="bg-[#6e6af0] text-white text-xs px-2 py-1 rounded">
                        Admin
                      </Badge>
                    )}
                    <span className="text-[#94a3b8] text-sm">
                      {message.time}
                    </span>
                  </div>

                  <p className="text-[#6c7275] mb-3 leading-relaxed">
                    {message.content}
                  </p>

                  {/* Quote */}
                  {message.quote && (
                    <div className="border-l-4 border-[#6e6af0] bg-[#f8fafc] p-3 mb-3 rounded-r">
                      <div className="flex items-center space-x-2 mb-1">
                        <Image
                          src={message.quote.avatar || "/placeholder.svg"}
                          alt="Quote author"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span className="text-[#6e6af0] text-sm font-medium">
                          {message.quote.text}
                        </span>
                      </div>
                      <span className="text-[#94a3b8] text-xs">
                        — {message.quote.parts}
                      </span>
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
                          className="text-[#6c7275] border-[#e2e8f0] hover:bg-[#f8fafc]"
                        >
                          <attachment.icon className="w-4 h-4 mr-2" />
                          {attachment.name}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {message.reactions && (
                    <div className="flex items-center space-x-4">
                      {message.reactions.heart && (
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-[#ef4444] fill-current" />
                          <span className="text-sm text-[#6c7275]">
                            {message.reactions.heart}
                          </span>
                        </div>
                      )}
                      {message.reactions.thumbsUp && (
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4 text-[#f59e0b] fill-current" />
                          <span className="text-sm text-[#6c7275]">
                            {message.reactions.thumbsUp}
                          </span>
                        </div>
                      )}
                      {message.reactions.smile && (
                        <div className="flex items-center space-x-1">
                          <Smile className="w-4 h-4 text-[#f59e0b] fill-current" />
                          <span className="text-sm text-[#6c7275]">
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
        <div className="bg-white border-t border-[#e2e8f0] p-4">
          <div className="flex flex-col space-y-3">
            {/* Formatting Toolbar */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Underline className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-[#e2e8f0]"></div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-[#e2e8f0]"></div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6c7275] hover:bg-[#f8fafc]"
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>

            {/* Input Area */}
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Type a message..."
                  className="border-[#e2e8f0] rounded-lg h-12 resize-none"
                />
              </div>
              <Button className="bg-[#22c55e] text-white hover:bg-[#16a34a] rounded-lg px-6 h-12">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Details Section */}
      <div className="w-96 bg-white border-l border-[#e2e8f0] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h1 className="text-xl font-bold text-[#1e293b] text-center">
            Candidate Details
          </h1>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-6 text-center">
          <div className="relative inline-block mb-4">
            <Image
              src="/images/Search.png"
              alt="Udai Reddy Penuballi"
              width={80}
              height={80}
              className="rounded-full border-4 border-[#22c55e]"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#22c55e] rounded-full p-1">
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full"></div>
              </div>
            </div>
            <Badge className="absolute -top-2 -right-2 bg-[#22c55e] text-white text-xs px-2 py-1 rounded-full">
              Online
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-[#1e293b] mb-1">
            Udai Reddy Penuballi
          </h2>
          <p className="text-[#3b82f6] text-sm mb-4">
            Amazon | Senior Product Manager
          </p>

          <div className="flex justify-center space-x-4 mb-6">
            <Badge className="bg-[#fff7ed] text-[#ea580c] border-[#fed7aa] px-3 py-1">
              Full Time
            </Badge>
            <Badge className="bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe] px-3 py-1">
              Onsite
            </Badge>
            <Badge className="bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe] px-3 py-1">
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
                className="w-8 h-8 rounded"
                style={{ backgroundColor: social.color }}
              >
                <social.icon className="w-4 h-4 text-white" />
              </Button>
            ))}
          </div>
        </div>

        {/* Application Info */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#6b7280] text-sm">Applied Position:</span>
            <span className="font-semibold text-[#1e293b]">
              Front End Developer
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#6b7280] text-sm">Applied Date:</span>
            <span className="font-semibold text-[#1e293b]">15 Jan 2025</span>
          </div>

          {/* Status Badges */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center">
              <Badge className="bg-[#ea580c] text-white px-4 py-2 rounded-lg w-full mb-1">
                🔥 Current Stage
              </Badge>
              <span className="text-[#3b82f6] text-sm font-medium">
                Shortlisted
              </span>
            </div>
            <div className="text-center">
              <Badge className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg w-full mb-1">
                🔮 Upcoming Stage
              </Badge>
              <span className="text-[#3b82f6] text-sm font-medium">
                HR Interview
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 mb-6">
          {statsItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon
                    className="w-4 h-4"
                    style={{ color: item.color }}
                  />
                </div>
                <span className="text-[#1e293b] font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#1e293b]">{item.count}</span>
                <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
              </div>
            </div>
          ))}
        </div>

        {/* Schedules Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#1e293b]">Schedules</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#ef4444] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                25
              </Badge>
              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </div>
          </div>

          <Card className="border-[#e2e8f0]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1e293b] text-sm">
                    Upcoming Presentation
                  </h4>
                  <p className="text-[#6b7280] text-xs">
                    2025/08/12 at 11:21 AM
                  </p>
                </div>
                <div className="w-6 h-6 bg-[#f1f5f9] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#94a3b8] rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#1e293b]">Notes</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#ef4444] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                25
              </Badge>
              <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2].map((note) => (
              <Card key={note} className="border-[#e2e8f0]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src="/placeholder.svg?height=32&width=32&query=woman profile picture"
                      alt="Maulida adinda ayu"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-[#1e293b] text-sm">
                          Maulida adinda ayu
                        </span>
                      </div>
                      <p className="text-[#6b7280] text-xs mb-1">
                        Admin, owner
                      </p>
                      <p className="text-[#1e293b] text-sm mb-2">
                        We will meeting for this project and deals, we still
                        meting at Monday, 02 January 2025 at 08:30pm.
                      </p>
                      <span className="text-[#94a3b8] text-xs">
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
            <h3 className="font-bold text-[#1e293b]">Activities</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#ef4444] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                25
              </Badge>
              <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
            </div>
          </div>

          <div className="mb-2">
            <span className="text-[#94a3b8] text-sm">Today</span>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="border-[#e2e8f0]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: activity.color }}
                    >
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[#1e293b] text-sm">
                          {activity.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-[#94a3b8] text-xs">
                            {activity.time}
                          </span>
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: activity.color }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-[#6b7280] text-xs">
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
