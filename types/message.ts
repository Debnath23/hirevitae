import { Reaction } from "./reaction";
import { User } from "./user";

export interface Message {
  id: number
  text?: string | null
  
  // Text formatting fields
  bold: boolean
  italic: boolean
  underline: boolean
  
  // List formatting fields
  unorderedList: boolean
  orderedList: boolean
  
  // Font styling fields
  fontSize: string
  
  // Link fields
  linkTitle?: string | null
  linkTarget?: string | null
  
  // Emoji field
  emoji?: string | null
  
  // Image field
  imageUrl?: string | null
  
  // Code block fields
  codeLanguage?: string | null
  codeContent?: string | null
  
  // Message status
  seen: number // 0=not seen, 1=seen
  
  // Foreign keys
  senderId: number
  receiverId: number
  
  createdAt: Date
  updatedAt: Date
  
  // Relations (optional, depending on your query includes)
  sender?: User
  receiver?: User
  reactions?: Reaction[]
}