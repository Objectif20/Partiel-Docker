"use client"

import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { ChatInput } from "@/components/ui/chat/chat-input"
import { Send, File } from "lucide-react"

interface ChatInputFormProps {
  onSendMessage: (message: string) => void
  onFileSelect: (file: File | null) => void
  t: (key: string) => string
}

export const ChatInputForm = ({ onSendMessage, onFileSelect, t }: ChatInputFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = (e.target as HTMLFormElement).elements.namedItem("chatInput") as HTMLInputElement
    if (input.value.trim()) {
      onSendMessage(input.value)
      input.value = ""
    }
  }

  return (
    <form className="flex relative gap-2 p-4 border-t border-border" onSubmit={handleSubmit}>
      <ChatInput
        name="chatInput"
        className="min-h-12 bg-background shadow-none"
        placeholder={t("client.pages.office.chat.typeMessage")}
      />
      <Button
        className="absolute top-1/2 right-16 transform size-8 -translate-y-1/2"
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <File className="size-4" />
      </Button>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          onFileSelect(file || null)
        }}
      />
      <Button className="absolute top-1/2 right-6 transform size-8 -translate-y-1/2" size="icon" type="submit">
        <Send className="size-4" />
      </Button>
    </form>
  )
}
