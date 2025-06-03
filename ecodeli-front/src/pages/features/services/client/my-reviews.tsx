import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/services/client/my-reviews";
import { Review, ServiceApi } from "@/api/service.api";
import { useTranslation } from "react-i18next";

export default function MyServiceReviews() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.services.client.services-reviews.breadcrumb.home"), t("client.pages.office.services.client.services-reviews.breadcrumb.services"), t("client.pages.office.services.client.services-reviews.breadcrumb.my-reviews")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ServiceApi.getMyServiceReviewsAsClient(pageIndex + 1, pageSize);

        setReviews(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error(t("client.pages.office.services.client.services-reviews.error"), error);
      }
    };

    fetchReviews();
  }, [pageIndex, pageSize, t]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t("client.pages.office.services.client.services-reviews.title")}</h1>
      <DataTable key={`${pageIndex}-${pageSize}`} data={reviews} />
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
