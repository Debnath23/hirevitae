"use client"

import { useChatStore } from "@/store/useChatStore"
import ChatContainer from "@/components/chat/ChatContainer"
import NoChatSelected from "@/components/chat/NoChatSelected"
import Sidebar from "@/components/chat/Sidebar"

export default function ChatPage() {
  const { selectedUser } = useChatStore()

  return (
    <div className="h-screen bg-slate-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-slate-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  )
}
