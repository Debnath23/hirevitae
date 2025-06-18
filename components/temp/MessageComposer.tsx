"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EditorState, RichUtils, Modifier, DraftHandleValue } from "draft-js";
import { Editor } from "draft-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChatStore } from "@/store/useChatStore";
import {
  TablerBold,
  TablerCode,
  TablerItalic,
  TablerLink,
  TablerList,
  TablerListNumbers,
  TablerMoodSmile,
  Photo,
  Send,
  TablerUnderline,
} from "@/public/icons/index";
import { X } from "lucide-react";
import "draft-js/dist/Draft.css";
import formatMessageTime from "@/lib/format-message-time";

const EMOJI_LIST = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "🥴",
  "😵",
  "🤯",
  "🤠",
  "🥳",
  "😎",
  "🤓",
  "🧐",
  "😕",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫",
  "🥱",
  "😤",
  "😡",
  "😠",
  "🤬",
  "😈",
  "👿",
];

const FONT_SIZE_OPTIONS = [
  { value: "8", label: "8px" },
  { value: "9", label: "9px" },
  { value: "10", label: "10px" },
  { value: "11", label: "11px" },
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "24", label: "24px" },
  { value: "28", label: "28px" },
  { value: "32", label: "32px" },
  { value: "36", label: "36px" },
  { value: "48", label: "48px" },
  { value: "72", label: "72px" },
];

export default function MessageComposer() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);
  const [codeBlockDialogOpen, setCodeBlockDialogOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    selectedUser,
    formatting,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleUnorderedList,
    toggleOrderedList,
    setFontSize,
    setLinkTitle,
    setLinkTarget,
    setImageName,
    setImageUrl,
    setCodeLanguage,
    setCodeContent,
    sendFormattedMessage,
    replyToMessage,
    clearReplyToMessage,
    isMessageSending,
    resetFormatting,
  } = useChatStore();

  const handleToggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));

    switch (style) {
      case "BOLD":
        toggleBold();
        break;
      case "ITALIC":
        toggleItalic();
        break;
      case "UNDERLINE":
        toggleUnderline();
        break;
    }
  };

  const handleToggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));

    if (blockType === "unordered-list-item") {
      toggleUnorderedList();
    } else if (blockType === "ordered-list-item") {
      toggleOrderedList();
    }
  };

  const insertEmoji = (emoji: string) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const newContentState = Modifier.insertText(
      contentState,
      selectionState,
      emoji
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );

    setEditorState(newEditorState);
    setEmojiPopoverOpen(false);
  };

  const handleSendMessage = async () => {
    const content = editorState.getCurrentContent().getPlainText();

    if (!content.trim()) {
      console.log("Cannot send empty message");
      return;
    }

    if (!selectedUser) {
      console.error("No user selected");
      return;
    }

    try {
      await sendFormattedMessage(content, replyToMessage);
      setEditorState(EditorState.createEmpty());
      clearReplyToMessage();
      resetFormatting();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCancelReply = () => {
    clearReplyToMessage();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleTyping = (isCurrentlyTyping: boolean) => {
    if (!selectedUser) return;

    if (isCurrentlyTyping !== isTyping) {
      setIsTyping(isCurrentlyTyping);

      const { socket, authUser } =
        require("@/store/useAuthStore").useAuthStore.getState();

      if (socket && socket.connected) {
        socket.emit("userTyping", {
          receiverId: selectedUser.id,
          isTyping: isCurrentlyTyping,
          senderId: authUser.id,
        });
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isCurrentlyTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 1000);
    }
  };

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    handleTyping(true);
    return "not-handled";
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      handleTyping(false);
    };
  }, [selectedUser]);

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col space-y-3 bg-white rounded-[8px] shadow-sm">
        {/* Reply Preview */}
        {replyToMessage && (
          <div className="flex items-center justify-between bg-[#F8FAFC] px-4 py-2 border-l-4 border-[#0053F2]">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5">
                <Image
                  src={replyToMessage.sender?.avatar || "/images/avatar.png"}
                  alt={replyToMessage.sender?.name || "User"}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="flex gap-4">
                  <div className="text-sm font-medium text-[#0053F2]">
                    {replyToMessage.sender?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatMessageTime(replyToMessage.createdAt)}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {truncateText(
                    replyToMessage.text || replyToMessage.content || "",
                    50
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={handleCancelReply}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div
          className="flex-1 p-3 rounded-md min-h-[100px] max-h-[200px] overflow-auto text-sm text-gray-700"
          style={{
            fontSize: `${formatting.fontSize}px`,
          }}
        >
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            handleBeforeInput={handleBeforeInput}
            placeholder={
              replyToMessage ? "Write a reply..." : "Type a message..."
            }
          />
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between bg-[#FAFAFA] p-3">
          <div className="flex items-center">
            <div>
              <Button
                variant="ghost"
                className={`text-[#A0AEC0] hover:bg-[#f8fafc] cursor-pointer ${
                  formatting.bold ? "bg-[#e2e8f0]" : ""
                }`}
                onClick={() => handleToggleInlineStyle("BOLD")}
              >
                <Image
                  src={TablerBold || "/placeholder.svg"}
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer ${
                  formatting.italic ? "bg-[#e2e8f0]" : ""
                }`}
                onClick={() => handleToggleInlineStyle("ITALIC")}
              >
                <Image
                  src={TablerItalic || "/placeholder.svg"}
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer ${
                  formatting.underline ? "bg-[#e2e8f0]" : ""
                }`}
                onClick={() => handleToggleInlineStyle("UNDERLINE")}
              >
                <Image
                  src={TablerUnderline || "/placeholder.svg"}
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Button>
            </div>

            <div className="w-px h-4 bg-[#EEEFF2] mx-0.5"></div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer ${
                  formatting.unorderedList ? "bg-[#e2e8f0]" : ""
                }`}
                onClick={() => handleToggleBlockType("unordered-list-item")}
              >
                <Image
                  src={TablerList || "/placeholder.svg"}
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer ${
                  formatting.orderedList ? "bg-[#e2e8f0]" : ""
                }`}
                onClick={() => handleToggleBlockType("ordered-list-item")}
              >
                <Image
                  src={TablerListNumbers || "/placeholder.svg"}
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Button>

              {/* Font Size Selection */}
              <Select value={formatting.fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-auto h-8 px-0.5 mr-0.5 border-0 bg-transparent hover:bg-[#f8fafc] text-[#6c7275] min-w-[60px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-px h-4 bg-[#e2e8f0] mx-0.5"></div>

            <div>
              {/* Link Dialog */}
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer"
                  >
                    <Image
                      src={TablerLink || "/placeholder.svg"}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="link-title">Link Title</Label>
                      <Input
                        id="link-title"
                        value={formatting.linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="Enter link title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="link-target">Link Target</Label>
                      <Input
                        id="link-target"
                        value={formatting.linkTarget}
                        onChange={(e) => setLinkTarget(e.target.value)}
                        placeholder="Enter URL"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setLinkDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setLinkDialogOpen(false)}
                      disabled={!formatting.linkTarget}
                    >
                      Add
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Emoji Popover */}
              <Popover
                open={emojiPopoverOpen}
                onOpenChange={setEmojiPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer"
                  >
                    <Image
                      src={TablerMoodSmile || "/placeholder.svg"}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2">
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {EMOJI_LIST.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Image Dialog */}
              <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer"
                  >
                    <Image
                      src={Photo || "/placeholder.svg"}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <Label htmlFor="link-title">Link Title</Label>
                        <Input
                          id="link-title"
                          value={formatting.imageName}
                          onChange={(e) => setImageName(e.target.value)}
                          placeholder="Enter link title"
                        />
                      </div>
                      <Label htmlFor="image-url">URL</Label>
                      <Input
                        id="image-url"
                        value={formatting.imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setImageDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setImageDialogOpen(false)}
                      disabled={!formatting.imageUrl}
                    >
                      Add
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Code Block Dialog */}
              <Dialog
                open={codeBlockDialogOpen}
                onOpenChange={setCodeBlockDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6c7275] hover:bg-[#f8fafc] cursor-pointer"
                  >
                    <Image
                      src={TablerCode || "/placeholder.svg"}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Insert Code Block</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code-language">Language</Label>
                      <Select
                        value={formatting.codeLanguage}
                        onValueChange={setCodeLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="sql">SQL</SelectItem>
                          <SelectItem value="bash">Bash</SelectItem>
                          <SelectItem value="plaintext">Plain Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="code-content">Code</Label>
                      <textarea
                        id="code-content"
                        value={formatting.codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        placeholder="Enter your code here..."
                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCodeBlockDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setCodeBlockDialogOpen(false)}
                      disabled={!formatting.codeContent}
                    >
                      Add Code Block
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!selectedUser && isMessageSending}
            className="bg-[#0CAF60] text-white hover:bg-[#16a34a] rounded-[3px] px-4 py-2 cursor-pointer flex items-center space-x-2 disabled:opacity-50"
          >
            {!isMessageSending && (
              <Image
                src={Send || "/placeholder.svg"}
                width={20}
                height={20}
                alt="icon"
              />
            )}
            <p className="font-[500] text-sm">
              {replyToMessage
                ? "Reply"
                : isMessageSending
                ? "Sending..."
                : "Send"}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
