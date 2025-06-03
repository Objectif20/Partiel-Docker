import axiosInstance from "./axiosInstance";
import { Availability } from "./profile.api";

export interface Service {
    service_id: string
    service_type: string
    status: string
    name: string
    city: string
    price: number
    price_admin: number
    duration_time: number
    available: boolean
    keywords: string[]
    images: string[]
    description: string
    author: {
      id: string
      name: string
      email: string
      photo: string
    }
    rate: number
    comments?: [
      {
        id: string
        author: {
          id: string
          name: string
          photo: string
        }
        content: string
        response?: {
          id: string
          author: {
            id: string
            name: string
            photo: string
          }
          content: string
        }
      },
    ]
  }


  export interface providerDisponibilities {
    availabilities : [Availability],
    appointments : [
       {
        date : string,
        time : string,
        end : string
       }
    ]
  }    

  export interface ServiceHistory {
    id: string;
    clientName: string;
    clientImage: string | null;
    date: string;
    time: string;
    serviceName: string;
    rating: number | null;
  }


  export interface ServiceHistoryClient {
    id: string;
    id_service: string;
    price: number;
    provider: {
      id: string;
      name: string;
      photo: string;
    };
    date: string;
    service_name: string;
    rate: number | null;
    review:string | null;
  }

  export interface Review {
    id: string;
    content: string;
    provider: {
      id: string;
      name: string;
      photo: string;
    };
    date: string;
    service_name: string;
    rate: number;
  }

export interface FutureAppointmentProvider {
  id: string;
  clientName: string;
  clientImage: string | null;
  date: string;
  time: string;
  serviceName: string;
  status: string;
}
  


export class ServiceApi {

    static async getServices(
        page: number = 1,
        limit: number = 3,
        search?: string,
        city?: string
      ): Promise<{ data: Service[]; total: number }> {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        if (search) params.append('search', search);
        if (city) params.append('city', city);
      
        const response = await axiosInstance.get(`/client/service?${params.toString()}`);
        return response.data
      }

    static async createService(data: FormData): Promise<Service> {
        const response = await axiosInstance.post<Service>('/client/service', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    static async getMyServices(total : number, page : number) {
            const response = await axiosInstance.get(`/client/service/me?total=${total}&page=${page}`);
            return response;
    }

    static async getProviderDisponibilites(service_id : string) : Promise<providerDisponibilities> {
        const response = await axiosInstance.get(`/client/service/${service_id}/providerDisponibility`);
        return response.data;
    } 

    static async addAppointment(service_id : string, date : Date) {
        const response = await axiosInstance.post(`/client/service/${service_id}/appointments`, {
            service_date: date,
        });
        return response;
    }

    static async getServiceDetails(service_id: string): Promise<Service> {
        const response = await axiosInstance.get<Service>(`/client/service/${service_id}`);
        return response.data;
    }

    static async getProviderReviews(limit : number, page : number) {
        const response = await axiosInstance.get(`/client/service/reviews?limit=${limit}&page=${page}`);
        return response.data;
    }

    static async reponseToReview(review_id : string, content : string) {
        const response = await axiosInstance.post(`/client/service/reviews/${review_id}/reply`, {
            content: content,
        });
        return response;
    }

    static async getMyServicesHistory(page: number, limit: number) : Promise<{data : ServiceHistory[], totalRows: number, totalPages: number, currentPage: number, limit: number}> {
        const response = await axiosInstance.get(`/client/service/history?limit=${limit}&page=${page}`);
        return response.data;
    }

    static async getMyServiceHitoryAsClient(page: number, limit: number) : Promise<{data : ServiceHistoryClient[], totalRows: number, totalPages: number, currentPage: number, limit: number}> {
        const response = await axiosInstance.get(`/client/service/history/client?limit=${limit}&page=${page}`);
        return response.data;
    }

    static async addServiceReview(appointment_id: string, rate: number, review: string) {
        const response = await axiosInstance.post(`/client/service/${appointment_id}/comments`, {
          rating: rate,
            content: review,
        });
        return response;
    }


    static async getMyServiceReviewsAsClient(page: number, limit: number) : Promise<{data : Review[], totalRows: number, totalPages: number, currentPage: number, limit: number}> {
        const response = await axiosInstance.get(`/client/service/myReviews?limit=${limit}&page=${page}`);
        return response.data;
    }

    static async getFutureAppointmentsProvider(page: number, limit: number) : Promise<{data : FutureAppointmentProvider[], totalRows: number, totalPages: number, currentPage: number, limit: number}> {
        const response = await axiosInstance.get(`/client/service/futureAppointments?limit=${limit}&page=${page}`);
        return response.data;
    }

    static async startAppointment(appointment_id: string, code : string) {
        const response = await axiosInstance.post(`/client/service/${appointment_id}/start`, {
            code: code,
        });
        return response;
    }

    static async endAppointment(appointment_id: string) {
        const response = await axiosInstance.post(`/client/service/${appointment_id}/finish`);
        return response;
    }



}