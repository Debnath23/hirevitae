import { Message } from "./message";
import { User } from "./user";

export interface Reaction {
  id: number;
  messageId: number;
  userId: number;
  emojiId: string;
  emojiName: string;
  native: string;
  createdAt: Date;
  message?: Message;
  user?: User;
}
