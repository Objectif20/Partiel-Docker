import Meteo from "@/components/features/dashboard/client/meteo"
import CurrentBalance from "@/components/features/dashboard/provider/current-balance"
import CompletedServices from "@/components/features/dashboard/provider/completed-services"
import AverageRating from "@/components/features/dashboard/provider/average-rating"
import NextServicesProvider from "@/components/features/dashboard/provider/next-services"
import MonthlyRevenue from "@/components/features/dashboard/provider/billing"

export default function ProviderDashboard() {
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace prestataire, Frédéric</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <CurrentBalance />
        <CompletedServices />
        <AverageRating />
        <Meteo />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <MonthlyRevenue />
        <NextServicesProvider />
      </div>
    </div>
  )
}
