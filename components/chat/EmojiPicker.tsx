"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

interface EmojiPickerProps {
  messageId: number;
}

export default function EmojiPicker({ messageId }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { addReaction } = useChatStore();

  const handleEmojiSelect = async (emoji: any) => {
    await addReaction(messageId, emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Add emoji reaction"
      >
        <Smile size={16} />
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 z-50">
            <div className="bg-white rounded-lg shadow-lg border">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
                maxFrequentRows={2}
                perLine={8}
                set="native"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
