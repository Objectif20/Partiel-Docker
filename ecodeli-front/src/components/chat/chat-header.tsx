"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, EllipsisVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { DeleteConversationDialog } from "./delete-conversation-dialog"
import { BlockUserDialog } from "./block-user-dialog"
import { Contact } from "@/hooks/use-chat"
import DeliveryNegotiateDialog from "@/pages/features/messaging/delivery-negociate"

interface ChatHeaderProps {
  contactInfo?: Contact
  onBackClick: () => void
  userId: string
}

export const ChatHeader = ({ contactInfo, onBackClick, userId }: ChatHeaderProps) => {
  return (
    <div className="flex items-center p-4 border-b border-border bg-background/95 sticky top-0 z-10">
      {window.innerWidth <= 768 && (
        <Button onClick={onBackClick} className="mr-2" variant="ghost" size="icon">
          <ChevronLeft className="size-4" />
        </Button>
      )}
      <Avatar>
        <AvatarImage src={contactInfo?.photo || "/placeholder.svg"} alt={contactInfo?.first_name} />
        <AvatarFallback>{contactInfo?.first_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1">
        <h1 className="text-lg font-semibold">
          {contactInfo?.first_name} {contactInfo?.last_name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {contactInfo?.online ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              Online
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
              Offline
            </span>
          )}
        </p>
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DeliveryNegotiateDialog deliveryman_user_id={userId || ""} />
            <DeleteConversationDialog userId={userId} />
            <BlockUserDialog userId={userId} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
