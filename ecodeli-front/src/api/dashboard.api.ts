import axiosInstance from "./axiosInstance"

export interface WeatherData {
    city: string
    temperature: number
    condition: "sunny" | "cloudy" | "rainy" | "snowy"
    date: Date
}

export interface LastDelivery {
    delivery: {
      id: string
      from: string
      to: string
      status: string
      pickupDate: string
      estimatedDeliveryDate: string
      coordinates: {
        origin: [number, number]
        destination: [number, number]
        current: [number, number]
      }
    }
}

export interface finishedDelivery {
    count: number
    period : string,
}

export interface Carrier {
    id: string
    name: string
    rating: number
    status: "going" | "stop" | "finished"
    avatar: string
}

export interface NumberOfDeliveries {
    month:string;
    packages: number;
}

export interface co2Saved {
    month:string;
    co2Saved: number;
}

export interface packages{
    size : string;
    packages : number;
}

export interface nextServiceAsClient {
    title: string;
    date : string;
    image : string;
}

export interface CurrentBalance {
    amount: number
    currency: string
}

export interface CompletedService {
    count : number
    period : string
}

export interface AverageRating {
    score: number
    total: number
}

export interface revenueData {
    month: string
    particuliers : number
}


export interface upcomingService {
    id : string
    client : {
        name : string
        avatar : string
        initials : string
    }
    service : string
    date : string
}

export interface nearDeliveries {
    count : number
    period : string
}

export interface clientStats {
    month : string
    merchant : number
    client : number
}

export interface PackageLocation {
    id: string
    latitude: number
    longitude: number
    label: string
}


export interface events {
    date : Date
    label : string
}

export interface NextDelivery{
    origin: string
    destination: string
    date: Date
    status?: "wait" | "take" | "going" | "finished"
    trackingNumber?: string
    carrier?: string
    weight?: string
    estimatedTime?: string
}



export class DashboardApi {
    static async getWeather(): Promise<WeatherData> {
      const res = await axiosInstance.get("/client/dashboard/weather")
      return res.data
    }
  
    static async getLastDelivery(): Promise<LastDelivery> {
      const res = await axiosInstance.get("/client/dashboard/last-delivery")
      return res.data
    }
  
    static async getFinishedDelivery(): Promise<finishedDelivery> {
      const res = await axiosInstance.get("/client/dashboard/finished-delivery")
      return res.data
    }
  
    static async getMyCarriers(): Promise<Carrier[]> {
      const res = await axiosInstance.get("/client/dashboard/my-carriers")
      return res.data
    }
  
    static async getNumberOfDeliveries(): Promise<NumberOfDeliveries[]> {
      const res = await axiosInstance.get("/client/dashboard/number-of-deliveries")
      return res.data
    }
  
    static async getCo2Saved(): Promise<co2Saved[]> {
      const res = await axiosInstance.get("/client/dashboard/co2-saved")
      return res.data
    }
  
    static async getPackages(): Promise<packages[]> {
      const res = await axiosInstance.get("/client/dashboard/packages")
      return res.data
    }
  
    static async getNextServiceAsClient(): Promise<nextServiceAsClient> {
      const res = await axiosInstance.get("/client/dashboard/next-service-as-client")
      return res.data
    }
  
    static async getCurrentBalance(): Promise<CurrentBalance> {
      const res = await axiosInstance.get("/client/dashboard/current-balance")
      return res.data
    }
  
    static async getCompletedService(): Promise<CompletedService> {
      const res = await axiosInstance.get("/client/dashboard/completed-service")
      return res.data
    }
  
    static async getAverageRating(): Promise<AverageRating> {
      const res = await axiosInstance.get("/client/dashboard/average-rating")
      return res.data
    }
  
    static async getRevenueData(): Promise<revenueData[]> {
      const res = await axiosInstance.get("/client/dashboard/revenue-data")
      return res.data
    }
  
    static async getUpcomingServices(): Promise<upcomingService[]> {
      const res = await axiosInstance.get("/client/dashboard/upcoming-services")
      return res.data
    }
  
    static async getNearDeliveries(): Promise<nearDeliveries> {
      const res = await axiosInstance.get("/client/dashboard/near-deliveries")
      return res.data
    }
  
    static async getClientStats(): Promise<clientStats[]> {
      const res = await axiosInstance.get("/client/dashboard/client-stats")
      return res.data
    }
  
    static async getPackageLocation(): Promise<PackageLocation[]> {
      const res = await axiosInstance.get("/client/dashboard/package-location")
      return res.data
    }
  
    static async getMyNextEvent(): Promise<events[]> {
      const res = await axiosInstance.get("/client/dashboard/my-next-event")
      return res.data
    }
  
    static async getNextDelivery(): Promise<NextDelivery> {
      const res = await axiosInstance.get("/client/dashboard/next-delivery")
      return res.data
    }

    static async getCompletedDeliveries(): Promise<finishedDelivery> {
      const res = await axiosInstance.get("/client/dashboard/completed-deliveries")
      return res.data
    }
  }