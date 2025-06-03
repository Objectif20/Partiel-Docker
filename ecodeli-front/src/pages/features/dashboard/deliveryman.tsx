import Meteo from "@/components/features/dashboard/client/meteo";
import CompletedDeliveries from "@/components/features/dashboard/deliveryman/completed-deliveries";
import NearDeliveries from "@/components/features/dashboard/deliveryman/deliveries-near";
import NextDelivery from "@/components/features/dashboard/deliveryman/next-deliveries";
import { DeliveryDistribution } from "@/components/features/dashboard/deliveryman/package-difference";
import PackageMap from "@/components/features/dashboard/deliveryman/package-map";
import YourPlanning from "@/components/features/dashboard/deliveryman/your-planning";
import CurrentBalance from "@/components/features/dashboard/provider/current-balance";

export default function DeliveryManDashboard() {
    return (
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace transporteur, Frédéric</h1>

        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 w-full">
          <div className="col-span-6 lg:col-span-3  rounded-xl">
          <CurrentBalance />          </div>
          <div className="col-span-6 lg:col-span-3  rounded-xl">
          <Meteo />          </div>
          <div className="col-span-6 lg:col-span-3 rounded-xl">
          <CompletedDeliveries />          </div>
          <div className="col-span-6 lg:col-span-3  rounded-xl">
            <NearDeliveries />
          </div>
  
          <div className="col-span-6 lg:col-span-4  rounded-xl">
            <DeliveryDistribution />
          </div>
          <div className="col-span-6 lg:col-span-8  rounded-xl">
            <PackageMap />
          </div>
  
          <div className="col-span-6 lg:col-span-4  rounded-xl">
          <YourPlanning />
          </div>
          <div className="col-span-6 lg:col-span-8  rounded-xl">
            <NextDelivery />
          </div>
          </div>
      </div>
    );
  }
  