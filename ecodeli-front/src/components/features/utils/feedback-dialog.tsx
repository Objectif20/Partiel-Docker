import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from "@radix-ui/react-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ServiceApi } from "@/api/service.api"
import { DeliveriesAPI } from "@/api/deliveries.api"

interface FeedbackDialogProps {
  maxNote: number
  id: string
  onFeedbackSent: () => void
  serviceName?: string
}

export default function FeedbackDialog({ maxNote, id, onFeedbackSent, serviceName }: FeedbackDialogProps) {  const [note, setNote] = useState<string>("")
  const [comment, setComment] = useState("")
  const checkboxId = useId()

  const handleSendFeedback = async () => {
    try {
      if (serviceName === "delivery") {
        await DeliveriesAPI.addReviewsAsClient(id, Number(note), comment)
      } else if (serviceName === "service") {
        await ServiceApi.addServiceReview(id, Number(note), comment)
      }
      onFeedbackSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Donner une note</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Aidez-nous à nous améliorer
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendFeedback()
            }}
          >
            <div className="space-y-4">
              <div>
                <fieldset className="space-y-4">
                  <legend className="text-foreground text-lg leading-none font-semibold">Votre note</legend>
                  <div className="flex gap-0 -space-x-px rounded-md shadow-xs">
                    {Array.from({ length: maxNote + 1 }, (_, i) => {
                      const isChecked = note === i.toString()
                      return (
                        <label
                          key={i}
                          className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow,background] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 data-[state=checked]:z-10"
                          data-state={isChecked ? "checked" : "unchecked"}
                        >
                          <Checkbox
                            id={`${checkboxId}-${i}`}
                            value={i.toString()}
                            className="sr-only after:absolute after:inset-0"
                            checked={isChecked}
                            onCheckedChange={() => setNote(i.toString())}
                          />
                          {i}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                  <p>Mauvaise</p>
                  <p>Excellente</p>
                </div>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="feedback">Pourquoi avez-vous donné cette note ?</Label>
                <Textarea
                  id="feedback"
                  placeholder="Donnez-nous votre avis"
                  aria-label="Envoyer un avis"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" className="w-full">
                  Envoyer l’avis
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
