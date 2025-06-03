import { DeliveriesStepper } from "@/components/features/deliveries/deliveries-stepper";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function CreateDeliveryPage() {
  const [isCleanupDone, setIsCleanupDone] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Nettoyage du localStorage
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("package-image-"));
    keys.forEach((key) => localStorage.removeItem(key));
    setIsCleanupDone(true);

    // Mise à jour du breadcrumb
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Livraisons", "Créer un lacher de chariot"],
        links: ["/office/dashboard", "/office/deliveries"],
      })
    );
  }, [dispatch]);

  if (!isCleanupDone) {
    return <div></div>;
  }

  return (
    <div>
      <DeliveriesStepper />
    </div>
  );
}
