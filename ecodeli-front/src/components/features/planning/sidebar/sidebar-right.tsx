import * as React from "react";
import { DatePicker } from "@/components/features/planning/sidebar/date-picker";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";


interface SidebarRightProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (newDate: Date | undefined) => void;
  onMonthChange: (newMonth: Date | undefined) => void;
  onCalendarsChange?: (calendars: string[]) => void;
}

export function SidebarRight({ onDateChange, onMonthChange, onCalendarsChange, ...props }: SidebarRightProps) {

  return (
    <Sidebar collapsible="none" className="sticky top-0 border-l rounded-lg h-96" {...props}>
      <SidebarContent>
        <DatePicker onDateChange={onDateChange} onMonthChange={onMonthChange} />
      </SidebarContent>
    </Sidebar>
  );
}
