import { useTranslation } from "react-i18next";
import useStore from "../stores/game";
import { ArrowBigLeft, PackageCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export function Score() {
  const score = useStore((state) => state.score);
  const boxCollected = useStore((state) => state.boxCollected);
  const {t} = useTranslation()
  return (
    <div className="absolute top-5 left-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
        <Trophy className="text-yellow-500" />
        <div className="text-foreground font-bold text-xl">
          {t("game.score")} {score}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
        <PackageCheck className="text-primary" />
        <div className="text-foreground font-bold text-xl">
        {t("game.boxes")} {boxCollected}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
        <ArrowBigLeft/>
        <Link to="/" className="text-foreground font-bold text-xl">
        {t("game.back")}
        </Link>
      </div>
    </div>
  );
}
