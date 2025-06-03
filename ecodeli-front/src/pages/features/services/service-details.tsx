"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { type Service, ServiceApi } from "@/api/service.api"
import { useTranslation } from "react-i18next"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Star, Clock, Calendar, MessageSquare, ChevronRight, Euro } from "lucide-react"

export default function ServiceDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useDispatch()

  const [service, setService] = useState<Service | null>(null)

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (id) {
        const data = await ServiceApi.getServiceDetails(id)
        setService(data)
      }
    }

    fetchServiceDetails()
  }, [id])

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.services.services-details.breadcrumbHome"), t("client.pages.office.services.services-details.breadcrumbMyServices"), service?.name || t("client.pages.office.services.services-details.serviceDetails")],
        links: ["/office/dashboard", "/office/my-services"],
      }),
    )
  }, [dispatch, service, t])

  if (!service) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] p-8">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">{t("client.pages.office.services.services-details.selectService")}</h3>
            <p className="text-muted-foreground">{t("client.pages.office.services.services-details.selectServiceDescription")}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card className="overflow-hidden">
        <div className="bg-background p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{service.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{service.city}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {service.keywords?.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="px-2.5 py-0.5 rounded-full">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end justify-center">
              <div className="flex items-center mb-2 bg-background  px-3 py-1.5 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500 mr-1.5" />
                <span className="font-semibold text-lg">{service.rate}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{service.duration_time} min</span>
              </div>
              <div className="mt-3 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-xl flex items-center">
                <Euro className="w-5 h-5 mr-1" />
                {service.price_admin || service.price}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="p-6 md:p-8 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={service.author?.photo || "/placeholder.svg"} alt={service.author?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {service.author?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {t("client.pages.office.services.services-details.proposedBy", { name: service.author?.name })}
                </h3>
                <div className="flex items-center text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500 mr-1.5" />
                  <span>{service.rate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-b">
            <h3 className="font-semibold text-xl mb-4">{t("client.pages.office.services.services-details.description")}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.description}</p>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl">{t("client.pages.office.services.services-details.customerReviews")}</h3>
              <Badge variant="outline" className="px-2.5 py-1">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                {(service.comments?.flat() || []).length}
              </Badge>
            </div>

            {(service.comments?.flat() || []).length > 0 ? (
              <div className="space-y-6">
                {(service.comments?.flat() || []).map((comment) => (
                  <div key={comment?.id} className="rounded-xl  p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={comment?.author?.photo || "/placeholder.svg"} alt={comment?.author?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {comment?.author?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-semibold">{comment?.author?.name}</p>
                          <div className="flex items-center">
                            <Star className="w-3.5 h-3.5 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{comment?.content}</p>
                      </div>
                    </div>

                    {comment?.response && (
                      <div className="ml-12 mt-4 pt-4 border-t border-dashed">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={comment?.response?.author?.photo || "/placeholder.svg"}
                              alt={comment?.response?.author?.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {comment?.response?.author?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm flex items-center">
                              <ChevronRight className="w-3.5 h-3.5 mr-1 text-primary" />
                              {comment?.response?.author?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{comment?.response?.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{t("client.pages.office.services.services-details.noReviews")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
