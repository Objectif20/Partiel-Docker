import { CircleHelp } from "lucide-react";

export default function QuestionFinishForm() {
  return (
<div className="flex items-center justify-center h-full">
    <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
        <CircleHelp
        size={32}
        className="text-muted-foreground/50 mb-2"
        />
        <h3 className="text-lg font-medium">Êtes-vous sur d'avoir bien fini votre demande de livraison ?</h3>
    </div>
</div>
  );
}