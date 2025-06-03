import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import ClientDashboard from "./client";
import DeliveryManDashboard from "./deliveryman";
import ProviderDashboard from "./provider";
import MerchantDashboard from "./merchant";

export default function Dashboard() {
    const user = useSelector((state: RootState) => state.user.user);

    const isMerchant = user?.profile.includes("MERCHANT");
    const isProvider = user?.profile.includes("PROVIDER");
    const isClient = user?.profile.includes("CLIENT");
    const isDeliveryman = user?.profile.includes("DELIVERYMAN");
    const isProviderValidated = user?.profile.includes("PROVIDER") && user?.validateProfile;
    const isDeliverymanValidated = user?.profile.includes("DELIVERYMAN") && user?.validateProfile;

    const isClientOnly = isClient && !isMerchant && !isProvider;
    const isClientAndDeliveryman = isClientOnly && isDeliverymanValidated;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            setBreadcrumb({
                segments: [t("client.pages.office.myDocuments.home")],
                links: ["/office/dashboard"],
            })
        );
    }, [dispatch, t]);

    return (
        <div>
            {isClientAndDeliveryman && (
                <div className="flex justify-center">
                    <Tabs defaultValue="expediteur" className="w-full">
                        <div className="flex justify-center mb-2">
                            <TabsList className="w-fit space-x-2">
                                <TabsTrigger value="expediteur">Expéditeur</TabsTrigger>
                                <TabsTrigger value="transporteur">Transporteur</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="expediteur">
                            <ClientDashboard />
                        </TabsContent>
                        <TabsContent value="transporteur">
                            <DeliveryManDashboard />
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {!isClientAndDeliveryman && (
                <div className="text-center mt-6">
                    {isMerchant && <MerchantDashboard />}
                    {isProviderValidated && <ProviderDashboard />}
                    {isClient && !isDeliveryman && <ClientDashboard />}
                    {isDeliveryman && !isDeliverymanValidated && <ClientDashboard />}
                    {isProvider && !isProviderValidated && (
                        <p>En attente de validation de votre profil Prestataire. Vous serez informé dès que le processus sera terminé.</p>
                    )}
                    {isDeliveryman && !isDeliverymanValidated && (
                        <p>En attente de validation de votre profil Transporteur. Vous serez informé dès que le processus sera terminé.</p>
                    )}
                </div>
            )}
        </div>
    );
}
