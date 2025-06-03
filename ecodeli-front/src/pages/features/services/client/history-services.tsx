"use client";

import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/services/client/history";
import { ServiceApi, ServiceHistoryClient } from "@/api/service.api";
import { useTranslation } from 'react-i18next';

export default function HistoryServices() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceHistoryClient[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t('client.pages.office.services.client.history.breadcrumb.home'),
          t('client.pages.office.services.client.history.breadcrumb.services'),
          t('client.pages.office.services.client.history.breadcrumb.history'),
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceApi.getMyServiceHitoryAsClient(pageIndex + 1, pageSize);
        setServices(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique", error);
      }
    };

    fetchServices();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">
        {t('client.pages.office.services.client.history.table.title')}
      </h1>
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={services}
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
