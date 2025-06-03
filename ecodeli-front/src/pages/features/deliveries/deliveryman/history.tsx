import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/deliverman/history-table";
import { DeliveriesAPI, HistoryDelivery } from "@/api/deliveries.api";
import { useTranslation } from "react-i18next";

export default function MyDeliveryHistoryPage() {
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState<HistoryDelivery[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const {t} = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.delivery.deliveryman.history.breadcrumb.home"), t("client.pages.office.delivery.deliveryman.history.breadcrumb.deliveries"), t("client.pages.office.delivery.deliveryman.history.breadcrumb.history")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await DeliveriesAPI.getMyDeliveryHistoryAsDeliveryman(pageIndex + 1, pageSize);
        setDeliveries(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des livraisons", error);
      }
    };

    fetchDeliveries();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t("client.pages.office.delivery.deliveryman.history.title")}</h1>
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
