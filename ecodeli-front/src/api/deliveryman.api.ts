import axiosInstance from "./axiosInstance";

export interface Route {
    id: string;
    from: string;
    to: string;
    permanent: boolean;
    coordinates: {
      origin: [number, number];
      destination: [number, number];
    };
    date?: string;
    weekday?: string;
    tolerate_radius: number;
    comeback_today_or_tomorrow: "today" | "tomorrow" | "later";
  }

  export interface RoutePostDto {
    from: string;
    to: string;
    permanent: boolean;
    date?: string;
    weekday?: string;
    tolerate_radius: number;
    comeback_today_or_tomorrow: "today" | "tomorrow" | "later";
  }

  export interface vehicleCategory {
    category_id: string;
    name: string;
    max_weight: number;
    max_dimension: number;
  }

  export interface Vehicle {
    id: string;
    name: string;
    matricule: string;
    co2: number;
    allow: boolean;
    image: string;
    justification_file: string;
  }




export class DeliverymanApi {

    static async getDeliverymanRoutes() : Promise<Route[]> {
        const response = await axiosInstance.get<Route[]>('/client/deliveryman/trips');
        return response.data;
    }

    static async addDeliverymanRoute(route: RoutePostDto) : Promise<Route> {
        const response = await axiosInstance.post<Route>('/client/deliveryman/trips', route);
        return response.data;
    }

    static async getVehicleCategories() : Promise<vehicleCategory[]> {
        const response = await axiosInstance.get<vehicleCategory[]>('/client/deliveryman/vehicle-categories');
        return response.data;
    }

    static async addVehicle(
        formData: FormData,
      ): Promise<void> {
        try {    
            console.log("FormData:", formData);
          await axiosInstance.post("/client/deliveryman/vehicle", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
    
        } catch (error) {
          console.error("Erreur lors de l'ajout du véhicule :", error);
          throw new Error("Impossible d'ajouter le véhicule");
        }
      }
    

      static async getMyVehicles(page: number, limit: number): Promise<{data : Vehicle[], totalRows: number}> {
        const response = await axiosInstance.get<{data : Vehicle[], totalRows: number}>('/client/deliveryman/my-vehicles', {
          params: {
            page: page,
            limit: limit,
          },
        });
        return response.data;
      }


      static async isDeliverymanElligibleToTakeDeliveries(user_id : string): Promise<boolean> {

        try {
          const id = user_id;
          const response = await axiosInstance.get<boolean>(`/client/deliveryman/${id}/admissible`);
          return response.data;
        } catch (error) {
          console.error("Error checking deliveryman eligibility:", error);
          throw error;
        }
      }

      static async isDeliverymanAvailableForThisDeliveries(deliveryID : string): Promise<boolean> {
        try {
          const id = deliveryID;
          const response = await axiosInstance.get<boolean>(`/client/deliveryman/admissible/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error checking deliveryman availability:", error);
          throw error;
        }

      }
}