"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type Props = {
  onResult: (value: string) => void;
};

export const BarcodeScanner = ({ onResult }: Props) => {
  const [cameraError, setCameraError] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      console.log("✅ QR code scanné :", text);
      onResult(text);
    },
    onError: (err) => {
      console.warn("Erreur accès caméra :", err);
      setCameraError(true);
    },
    timeBetweenDecodingAttempts: 500,
  });

  const handleManualSubmit = () => {
    if (manualInput.trim() !== "") {
      onResult(manualInput.trim());
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!cameraError ? (
        <>
          <video
            ref={ref as React.RefObject<HTMLVideoElement>}
            className="rounded-md w-full max-w-md"
          />
          {isAvailable ? (
            <Button
              onClick={() => (isOn ? off() : on())}>
              {isOn ? "Éteindre la lampe" : "Allumer la lampe"}
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Lampe non disponible
            </span>
          )}
        </>
      ) : (
        <div className="w-full max-w-md space-y-2">
          <p className="text-sm text-muted-foreground italic">
            Caméra indisponible. Entrez le code manuellement :
          </p>
          <Input
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Code du colis"
          />
          <Button
            onClick={handleManualSubmit}
            className="px-4 py-2 rounded-md w-full"
          >
            ✅ Valider
          </Button>
        </div>
      )}
    </div>
  );
};
