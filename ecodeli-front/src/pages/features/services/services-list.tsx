import { ServiceApi } from "@/api/service.api";
import { DataTable } from "@/components/features/services/my-services";
import { PaginationControls } from "@/components/pagination-controle";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MyServicesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [services, setServices] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.services.provider.services-list.breadcrumb.home"), t("client.pages.office.services.provider.services-list.breadcrumb.my-services")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceApi.getMyServices(pageSize, pageIndex + 1);
        setServices(response.data.data || []);
        setTotalItems(response.data?.total || 0);
      } catch (error) {
        console.error(t("client.pages.office.services.provider.services-list.error"), error);
      }
    };

    fetchServices();
  }, [pageIndex, pageSize, t]);

  return (
    <>
      <Button
        onClick={() => navigate("/office/services/create")}
        className="w-fit"
      >
        {t("client.pages.office.services.provider.services-list.add-service")}
      </Button>

      <h1 className="text-2xl font-semibold mb-4">{t("client.pages.office.services.provider.services-list.title")}</h1>

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
