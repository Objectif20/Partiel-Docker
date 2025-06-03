import useEventListeners from "../hooks/useEventListeners"
import { queueMove } from "../stores/player"
import { Button } from "@/components/ui/button"
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import "@/index.css"

export function Controls() {
  useEventListeners()

  return (
    <div className="absolute bottom-5 w-full flex items-end justify-center">
      <div className="grid grid-cols-3 gap-2 w-[160px]">
        <Button
          onClick={() => queueMove("forward")}
          className="col-span-3 flex justify-center items-center text-center"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => queueMove("left")}
          className="flex justify-center items-center text-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => queueMove("backward")}
          className="flex justify-center items-center text-center"
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => queueMove("right")}
          className="flex justify-center items-center text-center"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
