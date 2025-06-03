"use client"

import type React from "react"

import { forwardRef } from "react"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble"
import { ChatMessageList } from "@/components/ui/chat/chat-message-list"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { Message, Contact } from "@/hooks/use-chat"
import type { NavigateFunction } from "react-router-dom"

interface ChatMessagesProps {
  messages: Message[]
  myUserId: string
  selectedContactInfo?: Contact
  getFileType: (url: string) => string
  navigate: NavigateFunction
  messageListRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, myUserId, selectedContactInfo, getFileType, navigate, messageListRef, bottomRef }) => {
    return (
      <ChatMessageList ref={messageListRef}>
        {messages.map((msg) => (
          <ChatBubble key={msg._id} variant={msg.senderId === myUserId ? "sent" : "received"}>
            {msg.senderId !== myUserId && <ChatBubbleAvatar src={selectedContactInfo?.photo} />}
            <ChatBubbleMessage isLoading={msg.isLoading}>
              {msg.fileUrl ? (
                <div>
                  {getFileType(msg.fileUrl) === "image" ? (
                    <img
                      src={msg.fileUrl || "/placeholder.svg"}
                      alt="File"
                      className="max-w-full h-auto rounded-md"
                      style={{ maxHeight: "300px" }}
                    />
                  ) : (
                    <Button
                      onClick={() => msg.fileUrl && navigate(msg.fileUrl)}
                      className="flex items-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger un document
                    </Button>
                  )}
                </div>
              ) : (
                msg.content
              )}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
        <div ref={bottomRef}></div>
      </ChatMessageList>
    )
  },
)

ChatMessages.displayName = "ChatMessages"
