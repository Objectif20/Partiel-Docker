import { DeliveriesStepperAsMerchant } from "@/components/features/deliveries/deliveries-stepper-as-merchant";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function CreateDeliveryAsMerchantPage() {
  const [isCleanupDone, setIsCleanupDone] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("package-image-"));
    keys.forEach((key) => localStorage.removeItem(key));
    setIsCleanupDone(true);

    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Livraisons", "Créer une demande de livraison"],
        links: ["/office/dashboard", "/office/deliveries"],
      })
    );
  }, [dispatch]);

  if (!isCleanupDone) {
    return <div></div>;
  }

  return (
    <div>
      <DeliveriesStepperAsMerchant />
    </div>
  );
}
