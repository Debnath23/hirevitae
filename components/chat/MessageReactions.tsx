"use client";

import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

interface Reaction {
  id: number;
  messageId: number;
  userId: number;
  emojiId: string;
  emojiNative: string;
  emojiName: string;
  user: {
    id: number;
    name: string;
  };
}

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: number;
}

export default function MessageReactions({
  reactions,
  messageId,
}: MessageReactionsProps) {
  const { removeReaction } = useChatStore();
  const { authUser } = useAuthStore();

  if (!reactions || reactions.length === 0) {
    return null;
  }

  // Group reactions by emoji
  const groupedReactions = reactions.reduce(
    (acc, reaction) => {
      const key = reaction.emojiId;
      if (!acc[key]) {
        acc[key] = {
          emoji: reaction.emojiNative,
          name: reaction.emojiName,
          users: [],
          count: 0,
          userReacted: false,
        };
      }
      acc[key].users.push(reaction.user);
      acc[key].count++;
      if (reaction.userId === authUser?.id) {
        acc[key].userReacted = true;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        emoji: string;
        name: string;
        users: Array<{ id: number; name: string }>;
        count: number;
        userReacted: boolean;
      }
    >
  );

  const handleReactionClick = async (emojiId: string, userReacted: boolean) => {
    if (userReacted) {
      await removeReaction(messageId, emojiId);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {Object.entries(groupedReactions).map(([emojiId, reactionData]) => (
        <button
          key={emojiId}
          onClick={() => handleReactionClick(emojiId, reactionData.userReacted)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm border transition-colors ${
            reactionData.userReacted
              ? "bg-blue-100 border-blue-300 text-blue-700"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}
          title={`${reactionData.users
            .map((u) => u.name)
            .join(", ")} reacted with ${reactionData.name}`}
        >
          <span>{reactionData.emoji}</span>
          <span>{reactionData.count}</span>
        </button>
      ))}
    </div>
  );
}
