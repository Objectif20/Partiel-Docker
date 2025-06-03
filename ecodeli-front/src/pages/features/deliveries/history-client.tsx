import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { PaginationControls } from "@/components/pagination-controle";
import { DataTable } from "@/components/features/deliveries/client/history";
import { useTranslation } from 'react-i18next';
import { DeliveriesAPI, DeliveryHistoryAsClient } from "@/api/deliveries.api";


export default function HistoryDeliveriesClientPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState<DeliveryHistoryAsClient[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t('client.pages.office.delivery.deliveryHistory.breadcrumb.home'),
          t('client.pages.office.delivery.deliveryHistory.breadcrumb.deliveries'),
          t('client.pages.office.delivery.deliveryHistory.breadcrumb.deliveryHistory')
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await DeliveriesAPI.getMyDeliveriesHistoryAsClient(pageIndex + 1, pageSize);
        setDeliveries(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des livraisons", error);
      }
    };

    fetchDeliveries();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">
        {t('client.pages.office.delivery.deliveryHistory.title')}
      </h1>
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={deliveries}
      />
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
