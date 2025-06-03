import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function Calendars({
  calendars,
  onSelectionChange,
}: {
  calendars: {
    name: string;
    items: string[];
  }[];
  onSelectionChange?: (selectedItems: string[]) => void;
}) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleCheckboxChange = (item: string) => {
    const newSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];

    setSelectedItems(newSelectedItems);
    onSelectionChange?.(newSelectedItems);
  };

  return (
    <>
      {calendars.map((calendar, index) => (
        <React.Fragment key={calendar.name}>
          <SidebarGroup key={calendar.name} className="py-0">
            <Collapsible
              defaultOpen={index === 0}
              className="group/collapsible"
            >
              <SidebarGroupLabel
                asChild
                className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {calendar.name}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {calendar.items.map((item) => (
                      <SidebarMenuItem key={item}>
                        <div className="flex items-center gap-3 px-2 py-1.5 w-full rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <Checkbox
                            id={`checkbox-${item}`}
                            checked={selectedItems.includes(item)}
                            onCheckedChange={() => handleCheckboxChange(item)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <label
                            htmlFor={`checkbox-${item}`}
                            className="flex-1 cursor-pointer text-sm"
                            onClick={() => handleCheckboxChange(item)}
                          >
                            {item}
                          </label>
                        </div>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}
