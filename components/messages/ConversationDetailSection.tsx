import React from "react";
import ConversationHeader from "./ConversationHeader";
import Messages from "./Messages";
import MessageComposer from "./MessageComposer";

function ConversationDetailSection() {
  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc]">
      <ConversationHeader />
      <Messages />
      <MessageComposer />
    </div>
  );
}

export default ConversationDetailSection;
