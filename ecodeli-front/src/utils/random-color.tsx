export const EVENT_COLORS = [
    "sky",
    "amber",
    "violet",
    "rose",
    "emerald",
    "orange",
  ] as const;
  
  export type EventColor = typeof EVENT_COLORS[number];
  
  export function getRandomColor(): EventColor {
    const index = Math.floor(Math.random() * EVENT_COLORS.length);
    return EVENT_COLORS[index];
  }