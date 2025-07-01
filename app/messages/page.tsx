"use client";

import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
} from "@/public/icons/index";
import { signOut } from "next-auth/react";
import MessagesSection from "@/components/messages/MessagesSection";
import ConversationDetailSection from "@/components/messages/ConversationDetailSection";
import NoConversationDetailSelectedContainer from "@/components/messages/NoConversationDetailSelectedContainer";
import CandidateDetailsSection from "@/components/messages/CandidateDetailsSection";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function Messages() {
  const { selectedUser } = useChatStore();
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth(router);
  }, []);

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
