import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Service, ServiceApi } from "@/api/service.api";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import TakeAppointment from "@/components/public/services/planning";

export default function ServiceDetailsPageClient() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (id) {
        const data = await ServiceApi.getServiceDetails(id);
        setService(data);
      }
    };

    fetchServiceDetails();
  }, [id]);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.public.services.accueil"), t("client.pages.public.services.myServices"), service?.name || t("client.pages.public.services.service-details")],
        links: ["/office/dashboard", "/office/my-services"],
      })
    );
  }, [dispatch, service]);


  return (
    <div className="p-4">
      <div className="lg:col-span-2">
        <Card className="h-full">
          {service ? (
            <div className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{service.name}</h2>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {service.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{service.rate}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{service.duration_time} min</span>
                  </div>
                </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {service.keywords?.map((keyword, index) => (
                    <Badge key={index}>{keyword}</Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-grow overflow-auto">
                <div className="mb-6 flex items-center gap-4 pb-4 border-b">
                  <Avatar className="h-16 w-16 border-2">
                    <AvatarImage src={service.author?.photo} />
                    <AvatarFallback>{service.author?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('client.pages.public.services.proposedBy', { name: service.author?.name })}
                    </h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{service.rate}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {t('client.pages.public.services.description')}
                  </h3>
                  <p className="text-gray-700">{service.description}</p>
                  <div className="mt-4 p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{t('client.pages.public.services.price')}</p>
                      <p className="font-bold text-xl">{service.price_admin || service.price}€</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {t('client.pages.public.services.customerReviews')}
                  </h3>
                  <div className="space-y-4">
                    {(service.comments?.flat() || []).map((comment) => (
                      <div key={comment?.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment?.author?.photo} />
                            <AvatarFallback>{comment?.author?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{comment?.author?.name}</p>
                            <p>{comment?.content}</p>
                          </div>
                        </div>

                        {comment?.response && (
                          <div className="ml-12 mt-3 pt-3 border-t">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment?.response?.author?.photo} />
                                <AvatarFallback>{comment?.response?.author?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{comment?.response?.author?.name}</p>
                                <p className="text-sm">{comment?.response?.content}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <TakeAppointment duration={60} service_id={service.service_id}/>

                </div>
              </CardContent>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <div>
                <p className="mb-4">{t('client.pages.public.services.selectService')}</p>
                <p className="text-sm">
                  {t('client.pages.public.services.selectServiceDescription')}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
