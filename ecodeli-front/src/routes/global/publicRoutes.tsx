import {PublicLayout, PublicNavbar} from "@/components/public/public-layout";
import Game from "@/features/ecoquest/game/Game";
import NotFoundPage from "@/pages/error/404";
import AccessibilityPage from "@/pages/public/accessibility";
import BecomeDeliverymanPage from "@/pages/public/become-deliveryman";
import BecomeProviderPage from "@/pages/public/become-provider";
import ConfidentialityPage from "@/pages/public/confientiality";
import ContactPage from "@/pages/public/contact";
import DeliveriesPage from "@/pages/public/deliveries";
import DeliveriesDetails from "@/pages/public/deliveries-details";
import EcologyPage from "@/pages/public/ecology";
import FAQPage from "@/pages/public/faq";
import LandingPage from "@/pages/public/landing";
import LegalesNotices from "@/pages/public/legales-notices";
import TeamPage from "@/pages/public/our-teams";
import SecurityPage from "@/pages/public/security";
import ServicesPage from "@/pages/public/services";
import { Route, Routes } from "react-router-dom";

export default function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/legal-notice" element={<LegalesNotices />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/our-teams" element={<TeamPage />} />
                <Route path="/ecology" element={<EcologyPage />} />
                <Route path="/become-delivery-partner" element={<h1>Become Delivery Partner</h1>} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/become-provider" element={<BecomeProviderPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/confidentiality" element={<ConfidentialityPage />} />
                <Route path="//become-deliveryman" element={<BecomeDeliverymanPage />} />
            </Route>
            <Route element={<PublicNavbar />}>
                <Route path="/deliveries" element={<DeliveriesPage />} />
                <Route path="/deliveries/:id" element={<DeliveriesDetails />} />
                <Route path="/services" element={<ServicesPage />} />
            </Route>
            <Route path="/game" element={<Game />} />
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
