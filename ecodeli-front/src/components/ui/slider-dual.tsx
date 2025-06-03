import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function DualRangeSlider({ value, onValueChange, label }: { value: [number, number]; onValueChange: (value: [number, number]) => void; label: string }) {
  return (
    <div className="space-y-4 min-w-[300px]">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">{label}</Label>
        <output className="text-sm font-medium tabular-nums">
          {value[0]} - {value[1]}
        </output>
      </div>
      <Slider value={value} onValueChange={onValueChange} aria-label={label} />
    </div>
  );
}