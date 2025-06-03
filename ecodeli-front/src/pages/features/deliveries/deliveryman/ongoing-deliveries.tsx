"use client";

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DeliveryCard from "@/components/features/deliveries/delivery-card";
import PackageIcon from "@/assets/illustrations/package.svg";
import { useTranslation } from 'react-i18next';
import { DeliveriesAPI } from "@/api/deliveries.api";

export interface DeliveryOnGoing {
  id: string;
  from: string;
  to: string;
  status: string;
  pickupDate: string | null;
  estimatedDeliveryDate: string | null;
  coordinates: {
    origin: [number, number];
    destination: [number, number];
  };
  progress: number;
}

export default function OngoingDeliveries() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deliveriesData, setDeliveriesData] = useState<DeliveryOnGoing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [ t('client.pages.office.deliveryman.ongoingDeliveries.home'), t('client.pages.office.deliveryman.ongoingDeliveries.title')],
        links: ["/office/dashboard"],
      })
    );

    if (typeof window !== "undefined") {
      L.Icon.Default.mergeOptions({
        iconUrl: PackageIcon,
      });
    }

    const fetchDeliveries = async () => {
      try {
        const deliveries = await DeliveriesAPI.getMyOngoingDeliveriesAsDeliveryman();
        setDeliveriesData(deliveries);
      } catch (error) {
        console.error("Error fetching ongoing deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [dispatch, t]);

  const handleUpdateDeliveries = async () => {
    setLoading(true);
    try {
      const deliveries = await DeliveriesAPI.getMyOngoingDeliveriesAsDeliveryman();
      setDeliveriesData(deliveries);
    } catch (error) {
      console.error("Error fetching ongoing deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('client.pages.office.deliveryman.ongoingDeliveries.title')}</h1>

      {deliveriesData.length === 0 ? (
        <Card className="rounded-xl shadow-lg border bg-background">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-foreground">
              {t('client.pages.office.deliveryman.ongoingDeliveries.noDeliveries')}
            </CardTitle>
            <p>
              {t('client.pages.office.deliveryman.ongoingDeliveries.noDeliveriesDescription')}
            </p>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveriesData.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} onUpdate={handleUpdateDeliveries} />
          ))}
        </div>
      )}
    </div>
  );
}
