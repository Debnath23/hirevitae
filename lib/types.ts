export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: number
  text?: string | null
  emojiCodes?: any
  fileUrl?: string | null
  fileType?: string | null
  fileSize?: number | null
  fileName?: string | null
  senderId: number
  receiverId: number
  replyToMessageId?: number | null
  createdAt: Date
  updatedAt: Date
  sender: User
  receiver: User
  replyToMessage?: Message | null
  reactions: Reaction[]
}

export interface Emoji {
  id: number
  unicode: string
  hashedCode: string
  name: string
  category: string
  createdAt: Date
}

export interface Reaction {
  id: number
  messageId: number
  userId: number
  emojiId: string // emoji-mart emoji id
  emojiNative: string // actual emoji character
  emojiName: string // emoji name
  createdAt: Date
  user: User
}

// Emoji-mart emoji object structure
export interface EmojiMartEmoji {
  id: string
  name: string
  native: string
  unified: string
  keywords: string[]
  shortcodes: string
  emoticons?: string[]
}
