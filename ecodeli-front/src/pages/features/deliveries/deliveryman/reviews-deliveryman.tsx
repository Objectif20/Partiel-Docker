import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/deliverman/reviews-deliveryman";
import { useTranslation } from 'react-i18next';
import { DeliveriesAPI } from "@/api/deliveries.api";

interface Review {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    photo: string;
  };
  reply: boolean;
  reply_content: string | null;
  delivery_name: string;
  rate: number;
}

export default function ReviewDeliverymanPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t('client.pages.office.delivery.deliveryman.reviews.breadcrumb.home'), t('client.pages.office.delivery.deliveryman.reviews.breadcrumb.reviews')],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await DeliveriesAPI.getMyReviewsAsDeliveryman(pageIndex + 1, pageSize);
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
      <h1 className="text-2xl font-semibold mb-4">
        {t('client.pages.office.delivery.deliveryman.reviews.title')}
      </h1>
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