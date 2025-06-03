import * as React from "react";
import { cn } from "@/lib/utils";
import { AutosizeTextarea, AutosizeTextAreaRef } from "../autosize-area";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onHeightChange?: (height: number) => void;
}

const ChatInput = React.forwardRef<AutosizeTextAreaRef, ChatInputProps>(
  ({ className, onHeightChange, ...props }, ref) => {
    return (
      <AutosizeTextarea
        autoComplete="off"
        ref={ref}
        name="message"
        className={cn(
          "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
          className,
        )}
        maxHeight={48}
        onHeightChange={onHeightChange}
        {...props}
      />
    );
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };