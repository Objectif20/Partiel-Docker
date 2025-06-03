import { useContext, useEffect, useState } from "react";
import { RegisterContext } from "./RegisterContext";
import { RegisterApi, type Plan } from "@/api/register.api";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function Step4Subscription() {
  const { nextStep, setClientInfo, isPro, setCommercantInfo } = useContext(RegisterContext);
  const [, setSelectedPlanId] = useState<number | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const plansPerPage = 3;
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await RegisterApi.getPlan();
      setPlans(plans);
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = (planId: number, planPrice: number) => {
    setSelectedPlanId(planId);
    if (isPro) {
      setCommercantInfo((prev: { plan_id?: number }) => ({ ...prev, plan_id: planId }));
    } else {
      setClientInfo((prev: { plan_id?: number }) => ({ ...prev, plan_id: planId }));
    }

    if (planPrice === 0) {
      nextStep();
      nextStep();
    } else {
      nextStep();
    }
  };

  const totalPages = Math.ceil(plans.length / plansPerPage);
  const displayedPlans = plans.slice(currentPage * plansPerPage, (currentPage + 1) * plansPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPopularPlanIndex = () => {
    return displayedPlans.length > 1 ? 1 : 0;
  };

  const renderFeatureItem = (available: boolean, text: string) => (
    <div className="flex items-center gap-2 mb-2">
      {available ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-10">
        {t("client.pages.public.register.subscription.chooseSubscription")}
      </h2>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {displayedPlans.map((plan, index) => {
            const isPopular = index === getPopularPlanIndex();
            return (
              <div key={plan.plan_id} className="relative">
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      {t("client.pages.public.register.subscription.mostPopular")}
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${isPopular ? "border-green-500 shadow-lg" : ""}`}>
                  <CardHeader>
                    <CardTitle className="text-center">
                      {plan.name === "Free"
                        ? t("client.pages.public.register.subscription.free")
                        : plan.name}
                    </CardTitle>
                    {Number(plan.price) > 0 ? (
                      <div className="text-center text-xl font-semibold">
                        {`${plan.price}€/${t("client.pages.public.register.subscription.perMonth")}`}
                      </div>
                    ) : null}
                    <CardDescription className="text-center">
                      {plan.name === "Free"
                        ? t("client.pages.public.register.subscription.freeDescription")
                        : plan.name === "Premium"
                        ? t("client.pages.public.register.subscription.premiumDescription")
                        : t("client.pages.public.register.subscription.defaultDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {renderFeatureItem(true, t("client.pages.public.register.subscription.deliveryRequests"))}
                      {renderFeatureItem(
                        Number(plan.priority_shipping_percentage) > 0,
                        t("client.pages.public.register.subscription.priorityShipping", { percentage: plan.priority_shipping_percentage }),
                      )}
                      {renderFeatureItem(
                        Number(plan.max_insurance_coverage) > 0,
                        t("client.pages.public.register.subscription.insuranceCoverage", { amount: plan.max_insurance_coverage }),
                      )}
                      {renderFeatureItem(
                        Number(plan.shipping_discount) > 0,
                        t("client.pages.public.register.subscription.shippingDiscount", { percentage: plan.shipping_discount }),
                      )}
                      {renderFeatureItem(
                        Number(plan.permanent_discount) > 0,
                        t("client.pages.public.register.subscription.permanentDiscount", { percentage: plan.permanent_discount }),
                      )}
                      {plan.priority_months_offered > 0 &&
                        renderFeatureItem(true, t("client.pages.public.register.subscription.priorityMonthsOffered", { months: plan.priority_months_offered }))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handlePlanSelection(plan.plan_id, Number(plan.price))}
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                    >
                      {t("client.pages.public.register.subscription.discover")}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8 rounded-full"
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
