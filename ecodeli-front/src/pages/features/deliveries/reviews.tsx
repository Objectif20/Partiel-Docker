import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/reviews";
import { useTranslation } from 'react-i18next';
import { DeliveriesAPI, ReviewAsClient } from "@/api/deliveries.api";


export default function MyReviewsDeliveryPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<ReviewAsClient[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t('client.pages.office.delivery.reviews.breadcrumb.home'),
          t('client.pages.office.delivery.reviews.breadcrumb.deliveries'),
          t('client.pages.office.delivery.reviews.breadcrumb.myReviews')
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await DeliveriesAPI.getMyReviewsAsClient(pageIndex + 1, pageSize);
        setReviews(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis", error);
      }
    };

    fetchReviews();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t('client.pages.office.delivery.reviews.title')}</h1>
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={reviews}
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
