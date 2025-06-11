"use client";

import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronDown,
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
  BellSimple,
  AlertCircle,
  File,
  Calendar,
} from "@/public/icons/index";
import { signOut } from "next-auth/react";
import MessagesSection from "@/components/temp/MessagesSection";
import ConversationDetailSection from "@/components/temp/ConversationDetailSection";
import NoConversationDetailSelectedContainer from "@/components/temp/NoConversationDetailSelectedContainer";
import CandidateDetailsSection from "@/components/temp/CandidateDetailsSection";

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

export default function HomePage() {
  const { selectedUser } = useChatStore();
  return (
    <div className="flex h-screen my-0 bg-[#f8fafc] w-[1440px] mx-auto">
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
        {sidebarItems.map((item, index) => {
          const isLogout = item.icon === Logout;

          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={
                isLogout
                  ? () =>
                    signOut({
                      callbackUrl: "/",
                      redirect: true,
                    })
                  : undefined
              }
              className={`w-full rounded-none h-10 cursor-pointer ${item.isActive
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
          );
        })}

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
      <MessagesSection />

      {selectedUser ? (
        <ConversationDetailSection />
      ) : (
        <NoConversationDetailSelectedContainer />
      )}
      {/* Candidate Details Section */}
      <CandidateDetailsSection />
    </div>
  );
}
