"use client"

import { useState, useRef, useEffect } from "react"
import type { Socket } from "socket.io-client"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export interface Contact {
  user_id: string
  first_name: string
  last_name: string
  photo: string
  message: string
  time: string
  online: boolean
}

export interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  fileUrl?: string
  isRead: boolean
  timestamp: string
  __v?: number
  isLoading?: boolean
}

export interface Messages {
  [key: string]: Message[]
}

export const useChat = (socket: Socket) => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState<Messages>({})
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showContacts, setShowContacts] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const user = useSelector((state: RootState) => state.user.user)
  const myUserId = user?.user_id || ""

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  useEffect(() => {
    socket.emit("clientConnected", myUserId)

    socket.on("contacts", (contactsData: Contact[]) => {
      setContacts(contactsData)
    })

    socket.on("receiveMessage", (message: Message) => {
      console.log("Received message:", message)

      setMessages((prevMessages) => {
        const contactId = message.senderId === myUserId ? message.receiverId : message.senderId

        const contactMessages = prevMessages[contactId] || []

        const existingMessageIndex = contactMessages.findIndex((msg) => msg._id === message._id)

        let updatedContactMessages

        if (existingMessageIndex !== -1) {
          console.log("Message already exists, updating it:", message)
          updatedContactMessages = [...contactMessages]
          updatedContactMessages[existingMessageIndex] = message
        } else {
          console.log("Adding new message:", message)
          updatedContactMessages = [...contactMessages, message]
        }

        return {
          ...prevMessages,
          [contactId]: updatedContactMessages,
        }
      })

      scrollToBottom()
    })

    socket.on("messagesHistory", (receivedMessages: Message[]) => {
      if (selectedContact) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedContact]: receivedMessages,
        }))
        console.log("Messages history:", receivedMessages)
        scrollToBottom()
      }
    })

    const handleConnect = () => {
      console.log("🔌 Connected to socket:", socket.id)
      if (myUserId) {
        socket.emit("clientConnected", myUserId)
      }
    }

    socket.on("connect", handleConnect)

    return () => {
      socket.off("contacts")
      socket.off("receiveMessage")
      socket.off("messagesHistory")
      socket.off("connect", handleConnect)
    }
  }, [socket, myUserId, selectedContact])

  useEffect(() => {
    if (selectedContact && messages[selectedContact]) {
      scrollToBottom()
    }
  }, [selectedContact, messages])

  const handleSendMessage = (messageContent: string) => {
    if (!selectedContact || !messageContent.trim()) return

    if (selectedFile) {
      handleFileUpload()
      setSelectedFile(null)
    }
    socket.emit("sendMessage", { receiverId: selectedContact, content: messageContent })
    scrollToBottom()
  }

  const handleFileUpload = () => {
    if (!selectedContact || !selectedFile) return

    const reader = new FileReader()

    reader.onload = () => {
      const base64File = reader.result as string

      socket.emit("uploadFile", {
        receiverId: selectedContact,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        base64Data: base64File,
      })
    }

    reader.readAsDataURL(selectedFile)
  }

  const handleContactClick = (contactId: string) => {
    setSelectedContact(contactId)
    if (window.innerWidth <= 768) {
      setShowContacts(false)
    }
    socket.emit("getMessages", { receiverId: contactId })
  }

  const handleBackClick = () => {
    setShowContacts(true)
    setSelectedContact(null)
  }

  const getFileType = (url: string) => {
    const urlObj = new URL(url)
    const prefix = urlObj.searchParams.get("prefix")
    if (prefix) {
      const fileName = prefix.split("/").pop()
      const extension = fileName?.split(".").pop()?.toLowerCase()
      if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
        return "image"
      }
    }
    return "file"
  }

  return {
    selectedContact,
    setSelectedContact,
    searchQuery,
    setSearchQuery,
    messages,
    contacts,
    showContacts,
    setShowContacts,
    selectedFile,
    setSelectedFile,
    handleSendMessage,
    handleFileUpload,
    handleContactClick,
    handleBackClick,
    getFileType,
    bottomRef,
    messageListRef,
  }
}
