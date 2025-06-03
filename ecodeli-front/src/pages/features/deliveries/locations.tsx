import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DeliveriesAPI, DeliveriesLocation } from '@/api/deliveries.api';

const DeliveriesLocationPage = () => {
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState<DeliveriesLocation[]>([]);
  const [_, setSelectedDelivery] = useState<DeliveriesLocation | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: [
        t('client.pages.office.delivery.deliveriesLocation.breadcrumb.home'),
        t('client.pages.office.delivery.deliveriesLocation.breadcrumb.deliveries'),
        t('client.pages.office.delivery.deliveriesLocation.breadcrumb.location')
      ],
      links: ['/office/dashboard'],
    }));

    const fetchDeliveries = async () => {
      try {
        const data = await DeliveriesAPI.getMyDeliveriesLocation();
        setDeliveries(data);
      } catch (error) {
        console.error("Error fetching deliveries location:", error);
      }
    };

    fetchDeliveries();
  }, [dispatch, t]);

  const handleMarkerClick = (delivery: DeliveriesLocation) => {
    setSelectedDelivery(delivery);
  };

  const franceBounds: LatLngBoundsExpression = [
    [41.36, -5.14],
    [51.09, 9.56],
  ];

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="w-full h-full z-0">
      <MapContainer bounds={franceBounds} className="w-full h-full z-0" attributionControl={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {deliveries.map((delivery) => (
          <Marker
            key={delivery.id}
            position={[delivery.coordinates.lat, delivery.coordinates.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => handleMarkerClick(delivery),
            }}
          >
            <Popup>
              <strong className="block mb-2">{delivery.potential_address}</strong>
              {delivery.deliveryman && (
                <div className="flex items-center">
                  <Avatar className='mr-2 mb-8'>
                    <AvatarImage src={delivery.deliveryman.photo} alt={delivery.deliveryman.name} />
                    <AvatarFallback>{delivery.deliveryman.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <strong>{t('client.pages.office.delivery.deliveriesLocation.deliveryman')}:</strong> {delivery.deliveryman.name}
                    <br />
                    <strong>{t('client.pages.office.delivery.deliveriesLocation.email')}:</strong> {delivery.deliveryman.email}
                    <Button variant="link" onClick={() => navigate(`/office/deliveries/public/${delivery.id}`)}>
                      {t('client.pages.office.delivery.deliveriesLocation.accessDetails')}
                    </Button>
                  </div>
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DeliveriesLocationPage;
