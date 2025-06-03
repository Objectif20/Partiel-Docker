import React from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Settings,
  GalleryVerticalEnd,
  ShoppingCart,
  HelpCircle,
  Calendar,
  MessageSquare,
  ExternalLink,
  FileText,
  Truck,
  Car,
  Package,
  FileArchive,
} from "lucide-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardFooter,
  InfoCardDismiss,
  InfoCardAction,
} from "@/components/ui/info-card";
import { useSelector } from "react-redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { RootState } from "@/redux/store";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { NavLanguage } from "./nav-language";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const userData = {
    name: `${user?.first_name} ${user?.last_name}`,
    email: user?.email || "",
    avatar: user?.photo || `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`,
  };

  const { open, isMobile } = useSidebar();

  const isMerchant = user?.profile.includes("MERCHANT");
  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");
  const isProviderValidated = user?.profile.includes("PROVIDER") && user?.validateProfile;
  const isDeliverymanValidated = user?.profile.includes("DELIVERYMAN") && user?.validateProfile;

  const data = {
    user: userData,
    teams: [
      {
        name: "EcoDeli",
        logo: GalleryVerticalEnd,
        plan: user?.planName || "",
      },
    ],
    navMain: [
      ...(isMerchant ? [
        {
          title: t("client.components.sidebar.merchantSpace"),
          url: "#",
          icon: ShoppingCart,
          items: [
            {
              title: t("client.components.sidebar.myAds"),
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: t("client.components.sidebar.activeShipments"), url: "/office/shipments"},
                { title: t("client.components.sidebar.activeAds"), url: "/office/deliveries" },
                { title: t("client.components.sidebar.history"), url: "/office/ads-history" },
                { title: t("client.components.sidebar.shipmentsHistory"), url: "/office/shipments-history" },
                { title: t("client.components.sidebar.reviews"), url: "/office/reviews" },
                { title: t("client.components.sidebar.location"), url: "/office/location" },
              ],
            },
            {
              title: t("client.components.sidebar.planning"),
              url: "/office/planning",
              icon: Calendar,
            },
          ],
        }
      ] : []),
      ...(isClient ? [
        {
          title: t("client.components.sidebar.individualSpace"),
          url: "#",
          icon: Users,
          items: [
            {
              title: t("client.components.sidebar.myAds"),
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: t("client.components.sidebar.activeShipments"), url: "/office/shipments"},
                { title: t("client.components.sidebar.activeAds"), url: "/office/deliveries" },
                { title: t("client.components.sidebar.history"), url: "/office/ads-history" },
                { title: t("client.components.sidebar.shipmentsHistory"), url: "/office/shipments-history" },
                { title: t("client.components.sidebar.reviews"), url: "/office/reviews" },
                { title: t("client.components.sidebar.location"), url: "/office/location" },
              ],
            },
            {
              title: "Les prestations",
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: "Mon historique", url: "/office/services-history" },
                { title: "Mes avis", url: "/office/my-service-reviews" },
              ],
            },
            {
              title: t("client.components.sidebar.planning"),
              url: "/office/planning",
              icon: Calendar,
            },
          ],
        }
      ] : []),
      ...(isProviderValidated ? [
        {
          title: t("client.components.sidebar.serviceSpace"),
          url: "#",
          icon: HelpCircle,
          items: [
            {
              title: t("client.components.sidebar.myAds"),
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: t("client.components.sidebar.activeAds"), url: "/office/my-services" },
                { title: t("client.components.sidebar.history"), url: "/office/onGoing-services" },
                { title: t("client.components.sidebar.history"), url: "/office/ads-history-provider" },
                { title: t("client.components.sidebar.reviews"), url: "/office/reviews-provider" },
              ],
            },
            {
              title: t("client.components.sidebar.planning"),
              url: "/office/planning-provider",
              icon: Calendar,
            },
            {
              title: t("client.components.sidebar.proofs"),
              url: "/office/proofs",
              icon: FileText,
            },
            {
              title : t("client.components.sidebar.availability"),
              url: "/office/availability",
              icon: Calendar,
            }
          ],
        }
      ] : []),
      ...(isDeliverymanValidated ? [
        {
          title: t("client.components.sidebar.deliverySpace"),
          url: "#",
          icon: Truck,
          items: [
            {
              title: t("client.components.sidebar.planningAndRoute"),
              url: "/office/my-routes",
              icon: Truck,
            },
            {
              title: t("client.components.sidebar.deliveries"),
              url: "#",
              icon: Package,
              items: [
                { title: t("client.components.sidebar.upcomingDeliveries"), url: "/office/upcoming-deliveries" },
                { title: t("client.components.sidebar.deliveryHistory"), url: "/office/delivery-history" },
                { title: t("client.components.sidebar.deliveryReviews"), url: "/office/reviews-deliveryman" },
              ],
            },
            {
              title: t("client.components.sidebar.myVehicles"),
              url: "/office/my-vehicles",
              icon: Car,
            }
          ],
        }
      ] : []),
      {
        title: t("client.components.sidebar.general"),
        url: "#",
        icon: Settings,
        items: [
          {
            title: t("client.components.sidebar.settings"),
            url: "#",
            icon: Settings,
            items: [
              { title: t("client.components.sidebar.general"), url: "/office/general-settings" },
              { title: t("client.components.sidebar.profile"), url: "/office/profile" },
              { title: t("client.components.sidebar.privacy"), url: "/office/privacy" },
              { title: t("client.components.sidebar.contactDetails"), url: "/office/contact-details" },
              ...((isMerchant || isClient) ? [{ title: t("client.components.sidebar.subscriptions"), url: "/office/subscriptions" }] : []),
              ...((isProvider || isDeliveryman) ? [{ title: t("client.components.sidebar.billingSettings"), url: "/office/billing-settings" }] : []),
              { title: t("client.components.sidebar.reports"), url: "/office/reports" },
            ],
          },
          {
            title: t("client.components.sidebar.messaging"),
            url: "/office/messaging",
            icon: MessageSquare,
          },
          {
            title: t("client.components.sidebar.documentPage"),
            url: "/office/documents",
            icon: FileArchive,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <ScrollArea className="h-full">
        <SidebarContent>
          {isClient && !isDeliveryman && open &&(
            <div className="mx-4">
              <Button className="w-full" onClick={() => navigate("/office/register-deliveryman")}>
                {t("client.components.sidebar.becomeDeliveryman")}
              </Button>
            </div>
          )}
          {((isClient && isDeliveryman) || isMerchant) && open &&(
            <div className="mx-4">
              <Button className="w-full" onClick={() => navigate("/office/shipments/create")}>
                {t("client.components.sidebar.createDeliveryRequest")}
              </Button>
            </div>
          )}
          {isMerchant && open &&(
            <div className="mx-4">
              <Button className="w-full" onClick={() => navigate("/office/shipments/create-trolley")}>
                {t("client.components.sidebar.createTrolleyDrop")}
              </Button>
            </div>
          )}
          {isProviderValidated && open && (
            <div className="mx-4">
              <Button className="w-full" onClick={() => navigate("/office/create-service")}>
                {t("client.components.sidebar.createService")}
              </Button>
            </div>
          )}
          {data.navMain.map((nav, index) => (
            <NavMain key={index} items={nav.items} title={nav.title} />
          ))}
        </SidebarContent>
      </ScrollArea>
      {isClient && !isDeliveryman && open && (
        <InfoCard className="mx-4 hidden lg:block">
          <InfoCardContent>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] rounded-full animate-ping" />
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] rounded-full" />
              <InfoCardTitle>{t("client.components.sidebar.becomeDeliveryman")}</InfoCardTitle>
              <InfoCardDescription>
                {t("client.components.sidebar.becomeDeliverymanDescription")}
              </InfoCardDescription>
              <InfoCardFooter>
                <InfoCardDismiss>{t("client.components.sidebar.close")}</InfoCardDismiss>
                <InfoCardAction>
                  <Link
                    to="#"
                    className="flex flex-row items-center gap-1 underline"
                  >
                    {t("client.components.sidebar.learnMore")} <ExternalLink size={12} />
                  </Link>
                </InfoCardAction>
              </InfoCardFooter>
            </div>
          </InfoCardContent>
        </InfoCard>
      )}
      {isProvider && !isProviderValidated && open && (
        <InfoCard className="mx-4 hidden lg:block">
          <InfoCardContent>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] rounded-full animate-ping" />
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] rounded-full" />
              <InfoCardTitle>{t("client.components.sidebar.providerProfileUnderReview")}</InfoCardTitle>
              <InfoCardDescription>
                {t("client.components.sidebar.providerProfileUnderReviewDescription")}
              </InfoCardDescription>
              <InfoCardFooter>
                <InfoCardDismiss>{t("client.components.sidebar.close")}</InfoCardDismiss>
              </InfoCardFooter>
            </div>
          </InfoCardContent>
        </InfoCard>
      )}
      {isDeliveryman && !isDeliverymanValidated && open && (
        <InfoCard className="mx-4 hidden lg:block">
          <InfoCardContent>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] rounded-full animate-ping" />
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] rounded-full" />
              <InfoCardTitle>{t("client.components.sidebar.deliverymanProfileUnderReview")}</InfoCardTitle>
              <InfoCardDescription>
                {t("client.components.sidebar.deliverymanProfileUnderReviewDescription")}
              </InfoCardDescription>
              <InfoCardFooter>
                <InfoCardDismiss>{t("client.components.sidebar.close")}</InfoCardDismiss>
              </InfoCardFooter>
            </div>
          </InfoCardContent>
        </InfoCard>
      )}
      <SidebarFooter>
        {isMobile && (
          <NavLanguage />
        )}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
