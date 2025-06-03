import { ServiceApi } from "@/api/service.api";
import { DataTable } from "@/components/features/services/services-history";
import { PaginationControls } from "@/components/pagination-controle";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function ServicesHistory() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [services, setServices] = useState<
    {
      id: string;
      clientName: string;
      clientImage: string | null;
      date: string;
      time: string;
      serviceName: string;
      rating: number | null;
    }[]
  >([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.services.provider.services-history.breadcrumb.home"), t("client.pages.office.services.provider.services-history.breadcrumb.history")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchServicesHistory = async () => {
      try {
        const response = await ServiceApi.getMyServicesHistory(pageIndex + 1, pageSize);
        setServices(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error(t("client.pages.office.services.provider.services-history.error"), error);
      }
    };

    fetchServicesHistory();
  }, [pageIndex, pageSize, t]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">{t("client.pages.office.services.provider.services-history.title")}</h1>

      <DataTable key={`${pageIndex}-${pageSize}`} data={services} />

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
    </>
  );
}
