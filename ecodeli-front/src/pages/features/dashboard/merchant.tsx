import { Co2Chart } from "@/components/features/dashboard/client/co2";
import FinishedDeliveries from "@/components/features/dashboard/client/completed-deliveries";
import DeliveryCarriers from "@/components/features/dashboard/client/delivery-carriers";
import LastDelivery from "@/components/features/dashboard/client/last-delivery";
import Meteo from "@/components/features/dashboard/client/meteo";
import { NumberDeliveries } from "@/components/features/dashboard/client/number-deliveries";
import { PackageStats } from "@/components/features/dashboard/client/piechart";

export default function MerchantDashboard() {
    return (
      <div className="w-full p-4">
          <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace commerçant, Frédéric</h1>

        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 w-full">
          <div className="col-span-6 lg:col-span-6 lg:row-span-2  lg:h-full rounded-xl">
                <LastDelivery />
          </div>
  
          <div className="col-span-6 lg:col-span-3   rounded-xl">

            <FinishedDeliveries />

          </div>
          <div className="col-span-6 lg:col-span-3   rounded-xl">

            <Meteo />

          </div>
  
          <div className="col-span-6 lg:col-span-6   rounded-xl">
              <DeliveryCarriers />

          </div>
  
          <div className="col-span-6 lg:col-span-4  rounded-xl">
            <NumberDeliveries />

          </div>
          <div className="col-span-6 lg:col-span-4   rounded-xl">
            <Co2Chart />

          </div>
          <div className="col-span-6 lg:col-span-4  rounded-xl">
                <PackageStats />
          </div>
        </div>
      </div>
    );
  }
  