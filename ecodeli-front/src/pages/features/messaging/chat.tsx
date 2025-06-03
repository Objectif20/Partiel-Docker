"use client"

import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { Contact } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { useTranslation } from "react-i18next"
import type { RootState } from "@/redux/store"
import { useNavigate } from "react-router-dom"
import { useChat } from "@/hooks/use-chat"
import { ContactsList } from "@/components/chat/contacts-list"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInputForm } from "@/components/chat/chat-input-form"

const socketUrl = import.meta.env.VITE_API_BASE_URL
const socket: Socket = io(socketUrl)

const ChatPage = () => {
  const {
    selectedContact,
    searchQuery,
    setSearchQuery,
    messages,
    contacts,
    showContacts,
    setSelectedFile,
    handleSendMessage,
    handleFileUpload,
    handleContactClick,
    handleBackClick,
    getFileType,
    bottomRef,
    messageListRef,
  } = useChat(socket)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector((state: RootState) => state.user.user)
  const navigate = useNavigate()
  const myUserId = user?.user_id || ""

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.chat.home"), t("client.pages.office.chat.messaging")],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch, t])

  const selectedContactInfo = contacts.find((contact) => contact.user_id === selectedContact)
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-[calc(100vh-150px)] bg-background rounded-lg shadow-sm overflow-hidden">
      {(showContacts || window.innerWidth > 768) && (
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border bg-background p-4">
          <h2 className="text-lg font-semibold mb-4">{t("client.pages.office.chat.discussions")}</h2>
          <Input
            type="text"
            placeholder={t("client.pages.office.chat.searchPlaceholder")}
            className="w-full p-2 mb-4 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ContactsList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onContactClick={handleContactClick}
          />
        </div>
      )}

      <div className={`flex-1 flex flex-col ${showContacts && window.innerWidth <= 768 ? "hidden" : ""}`}>
        {selectedContact ? (
          <>
            <ChatHeader contactInfo={selectedContactInfo} onBackClick={handleBackClick} userId={selectedContact} />

            <ScrollArea className="flex-1 px-4" style={{ height: `calc(100% - 120px)` }}>
              <ChatMessages
                messages={messages[selectedContact] || []}
                myUserId={myUserId}
                selectedContactInfo={selectedContactInfo}
                getFileType={getFileType}
                navigate={navigate}
                messageListRef={messageListRef}
                bottomRef={bottomRef}
              />
            </ScrollArea>

            <ChatInputForm
              onSendMessage={handleSendMessage}
              onFileSelect={(file) => {
                setSelectedFile(file)
                if (file) handleFileUpload()
              }}
              t={t}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
              <Contact size={32} className="text-muted-foreground/50 mb-2" />
              <h3 className="text-lg font-medium">{t("client.pages.office.chat.selectContact")}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
