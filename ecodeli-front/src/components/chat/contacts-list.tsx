"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Contact } from "@/hooks/use-chat"

interface ContactsListProps {
  contacts: Contact[]
  selectedContact: string | null
  onContactClick: (contactId: string) => void
}

export const ContactsList = ({ contacts, selectedContact, onContactClick }: ContactsListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="space-y-2 mr-4">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
              selectedContact === contact.user_id ? "bg-accent/80" : ""
            }`}
            onClick={() => onContactClick(contact.user_id)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={contact.photo || "/placeholder.svg"} alt={contact.first_name} />
                <AvatarFallback>{contact.first_name.charAt(0)}</AvatarFallback>
              </Avatar>
              {contact.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
              )}
            </div>
            <div className="flex-1 ml-3 overflow-hidden">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold truncate">
                  {contact.first_name} {contact.last_name}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{contact.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{contact.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
