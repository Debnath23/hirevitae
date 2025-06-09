"use client";

import { X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useChatStore } from "@/store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.avatar} // Changed from profilePic to avatar
                alt={selectedUser.name} // Changed from fullName to name
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>{" "}
            {/* Changed from fullName to name */}
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser.id) ? "Online" : "Offline"}{" "}
              {/* Changed from _id to id */}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
