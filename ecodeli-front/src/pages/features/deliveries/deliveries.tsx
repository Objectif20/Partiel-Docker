import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CurrentDeliveryAsClient, DeliveriesAPI } from "@/api/deliveries.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DeliveriesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState<CurrentDeliveryAsClient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.delivery.onGoing.breadcrumb.home"), t("client.pages.office.delivery.onGoing.breadcrumb.deliveries")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await DeliveriesAPI.getCurrentDeliveriesAsClient();
        setDeliveries(response);
      } catch (error) {
        console.error(t("client.pages.office.delivery.onGoing.errorFetching"), error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t("client.pages.office.delivery.onGoing.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-background rounded-lg shadow-lg p-6 flex flex-col items-center text-center border hover:shadow-xl transition"
          >
            <img
              src={delivery.photo}
              alt={`${t("client.pages.office.delivery.onGoing.delivery")} ${delivery.id}`}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold">
              {delivery.departure_city} → {delivery.arrival_city}
            </h2>
            <p className="text-foreground text-sm mt-1">
              {t("client.pages.office.delivery.onGoing.departure")}: {new Date(delivery.date_departure).toLocaleDateString()}
            </p>
            <p className="text-foreground text-sm mt-1">
              {t("client.pages.office.delivery.onGoing.arrival")}: {new Date(delivery.date_arrival).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-4 space-x-2">
              <Avatar>
                <AvatarImage
                  src={delivery.deliveryman.photo}
                  alt={`${t("client.pages.office.delivery.onGoing.deliveryman")} ${delivery.deliveryman.name}`}
                />
                <AvatarFallback>
                  {delivery.deliveryman.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">{delivery.deliveryman.name}</p>
            </div>
            <Button
              className="mt-4"
              onClick={() => navigate(`/office/deliveries/public/${delivery.id}`)}
            >
              {t("client.pages.office.delivery.onGoing.viewDetails")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
