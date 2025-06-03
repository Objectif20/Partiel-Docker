import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateProfileRoutes from "@/components/private-profileRoutes";
import { CreateDeliveryPage } from "@/pages/features/deliveries/create/create";
import { DeliveriesPage } from "@/pages/features/deliveries/deliveries";
import DeliveriesLocationPage from "@/pages/features/deliveries/locations";
import MyReviewsDeliveryPage from "@/pages/features/deliveries/reviews";
import ReviewDeliveryanPage from "@/pages/features/deliveries/deliveryman/reviews-deliveryman";
import AddVehicle from "@/pages/features/deliveries/vehicles/add-vehicle";
import VehicleListPage from "@/pages/features/deliveries/vehicles/my-vehicles";
import DocumentsPage from "@/pages/features/documents/documents";
import ChatPage from "@/pages/features/messaging/chat";
import PlanningPage from "@/pages/features/planning/planning";
import CreateService from "@/pages/features/services/create-services";
import ReviewServicesPage from "@/pages/features/services/services-reviews";
import MyServicesList from "@/pages/features/services/services-list";
import BillingSettings from "@/pages/features/settings.tsx/billings";
import PrivacySettings from "@/pages/features/settings.tsx/confidentiality";
import ContactDetailsSettings from "@/pages/features/settings.tsx/contact-details";
import GeneralSettings from "@/pages/features/settings.tsx/general";
import ProfileSettings from "@/pages/features/settings.tsx/profile";
import ReportSettings from "@/pages/features/settings.tsx/reports";
import SubscriptionSettings from "@/pages/features/settings.tsx/subscriptions";
import { IntroDisclosureDemo } from "@/components/disclosure";
import ProofsPage from "@/pages/features/documents/proofs";
import RegisterDeliveryman from "@/pages/auth/register/deliveryman/register";
import MyDeliveryHistoryPage from "@/pages/features/deliveries/deliveryman/history";
import DeliveryTransporterView from "@/pages/features/deliveries/deliveryman/delivery-details";
import ServiceDetailsPage from "@/pages/features/services/service-details";
import HistoryServices from "@/pages/features/services/client/history-services";
import MyServiceReviews from "@/pages/features/services/client/my-reviews";
import ServiceDetailsPageClient from "@/pages/features/services/client/service-details";
import HistoryDeliveriesClientPage from "@/pages/features/deliveries/history-client";
import Dashboard from "@/pages/features/dashboard/dashboard";
import OngoingDeliveries from "@/pages/features/deliveries/deliveryman/ongoing-deliveries";
import MyRoutes from "@/pages/features/deliveries/my-routes/my-routes";
import ServicesHistory from "@/pages/features/services/services-history";
import NotFoundPage from "@/pages/error/404";
import SuccessDeliverymanPage from "@/pages/auth/register/deliveryman/success";
import ShipmentSuccessCreatePage from "@/pages/features/deliveries/create/success";
import { CreateDeliveryAsMerchantPage } from "@/pages/features/deliveries/create/createAsMerchant";
import ShipmentsDetailsOfficePage from "@/pages/features/deliveries/shipment-details";
import CurrentShipmentsPage from "@/pages/features/deliveries/shipments";
import HistoryShipmentRequestsClientPage from "@/pages/features/deliveries/shipments-history";
import AvailabilitySettings from "@/pages/features/services/availibity-settings";
import ServiceSuccessCreatePage from "@/pages/features/services/service-success";
import OnGoingServicesPage from "@/pages/features/services/onGoing-services";

const OfficeRoute: React.FC = () => {
  return (
    <>
      <IntroDisclosureDemo />
      <Routes>

      <Route element={<PrivateProfileRoutes requiredProfiles={["CLIENT", "DELIVERYMAN", "MERCHANT"]} />}>
        <Route path="deliveries/public/:id" element={<DeliveryTransporterView />} />
      </Route>
        
      <Route element={<PrivateProfileRoutes requiredProfiles={["DELIVERYMAN"]} />}>
          <Route path="upcoming-deliveries" element={<OngoingDeliveries />} />
          <Route path="delivery-history" element={<MyDeliveryHistoryPage />} />
          <Route path="reviews-deliveryman" element={<ReviewDeliveryanPage />} />
          <Route path="my-vehicles" element={<VehicleListPage />} />
          <Route path="add-vehicle" element={<AddVehicle />} />
          <Route path="my-routes" element={<MyRoutes />} />
          <Route path="registerSuccess" element={<SuccessDeliverymanPage />} />
        </Route>
        
        <Route element={<PrivateProfileRoutes requiredProfiles={["CLIENT", "MERCHANT"]} />}>
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="shipments/:id" element={<ShipmentsDetailsOfficePage />} />
          <Route path="shipments-history" element={<HistoryShipmentRequestsClientPage />} />
          <Route path="shipments/" element={<CurrentShipmentsPage />} />
          <Route path="shipments/create" element={<CreateDeliveryPage />} />
          <Route path="shipments/create/finish" element={<ShipmentSuccessCreatePage />} />
          <Route path="reviews" element={<MyReviewsDeliveryPage />} />
          <Route path="location" element={<DeliveriesLocationPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="subscriptions" element={<SubscriptionSettings />} />
          <Route path="ads-history" element={<HistoryDeliveriesClientPage />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfiles={["CLIENT"]} />}>
          <Route path="register-deliveryman" element={<RegisterDeliveryman />} />
          <Route path="services-history" element={<HistoryServices />} />
          <Route path="my-service-reviews" element={<MyServiceReviews />} />
          <Route path="/service/:id" element={<ServiceDetailsPageClient />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfiles={["MERCHANT"]} />}>
        <Route path="shipments/create-trolley" element={<CreateDeliveryAsMerchantPage />} />
        <Route path="shipments/create-trolley/finish" element={<ShipmentSuccessCreatePage />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfiles={["PROVIDER"]} />}>
          <Route path="my-services" element={<MyServicesList />} />
          <Route path="ads-history-provider" element={<ServicesHistory />} />
          <Route path="onGoing-services" element={<OnGoingServicesPage />} />
          <Route path="reviews-provider" element={<ReviewServicesPage />} />
          <Route path="planning-provider" element={<PlanningPage />} />
          <Route path="/services/create" element={<CreateService />} />
          <Route path="/services/success" element={<ServiceSuccessCreatePage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/availability" element={<AvailabilitySettings />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfiles={["PROVIDER", "DELIVERYMAN"]} />}>
        <Route path="proofs" element={<ProofsPage />} />
        <Route path="billing-settings" element={<BillingSettings />} />
        </Route>
        
        <Route path="general-settings" element={<GeneralSettings />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="privacy" element={<PrivacySettings />} />
        <Route path="contact-details" element={<ContactDetailsSettings />} />
        <Route path="reports" element={<ReportSettings />} />
        <Route path="messaging" element={<ChatPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default OfficeRoute;
