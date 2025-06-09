"use client"

import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useChatStore } from "@/store/useChatStore.js"
import { ImageIcon, Send, X, Smile } from "lucide-react"
// import toast from "react-hot-toast"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import type { EmojiMartEmoji } from "@/lib/types"

function MessageInput() {
  const [text, setText] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage } = useChatStore()

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
    //   toast.error("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEmojiSelect = (emoji: EmojiMartEmoji) => {
    setText((prev) => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return

    try {
      // Create FormData for the message
      const formData = new FormData()

      if (text.trim()) {
        formData.append("text", text.trim())
      }

      if (imagePreview) {
        // Convert base64 to blob
        const response = await fetch(imagePreview)
        const blob = await response.blob()
        formData.append("file", blob, "image.jpg")
      }

      await sendMessage(formData)

      setText("")
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("Failed to send message:", error)
    //   toast.error("Failed to send message. Please try again.")
    }
  }

  return (
    <div className="p-4 w-full border-t border-gray-200">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200
              flex items-center justify-center hover:bg-gray-300 transition-colors"
              type="button"
            >
              <X className="size-4 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="w-full rounded-lg py-2 px-4 text-gray-800 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
            value={text}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <div className="flex items-center">
            <button
              type="button"
              className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition-colors
              ${imagePreview ? "text-emerald-500" : "text-gray-500"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={20} />
            </button>

            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} />
            </button>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10">
              <div className="bg-white rounded-lg shadow-lg border">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  previewPosition="none"
                  skinTonePosition="none"
                />
              </div>
              <div className="fixed inset-0 z-0" onClick={() => setShowEmojiPicker(false)} />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
