import { useEffect, useState } from "react";
import useStore from "../stores/game";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-without-close";
import { Trophy, PackageCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Result() {
  const status = useStore((state) => state.status);
  const score = useStore((state) => state.score);
  const boxCollected = useStore((state) => state.boxCollected);
  const reset = useStore((state) => state.reset);
  const {t} = useTranslation()

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status !== "running") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [status]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" 
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold mb-2">{t("game.title")}</DialogTitle>
          <DialogDescription>{t("game.resultTitle")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          <span className="font-semibold text-lg text-foreground">
          {t("game.score")} {score}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PackageCheck className="text-green-600" size={24} />
          <span className="font-semibold text-lg text-foreground">
          {t("game.boxes")} {boxCollected}
          </span>
        </div>
        <DialogFooter className="flex justify-center">
          <Button
            onClick={() => {
              reset();
              setOpen(false);
            }}
            className="mt-4"
          >
            {t("game.retryButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
