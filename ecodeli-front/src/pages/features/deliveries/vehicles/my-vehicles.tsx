import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/vehicles/vehicles";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DeliverymanApi, Vehicle } from "@/api/deliveryman.api";
import { useTranslation } from 'react-i18next';

export default function VehicleListPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t('client.pages.office.delivery.vehicles.myVehicles.breadcrumb.home'),
          t('client.pages.office.delivery.vehicles.myVehicles.breadcrumb.vehicles')
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await DeliverymanApi.getMyVehicles(pageIndex + 1, pageSize);

        setVehicles(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules", error);
      }
    };

    fetchVehicles();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t('client.pages.office.delivery.vehicles.myVehicles.title')}</h1>
      <Button onClick={() => navigate("/office/add-vehicle")}>
        {t('client.pages.office.delivery.vehicles.myVehicles.addVehicleButton')}
      </Button>

      <DataTable key={`${pageIndex}-${pageSize}`} data={vehicles} />

      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
}
