import axiosInstance from "./axiosInstance";
import { Plan } from "./register.api";


export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    color?: EventColor;
    location?: string;
}

export type EventColor =
    | "sky"
    | "amber"
    | "violet"
    | "rose"
    | "emerald"
    | "orange";


export interface GeneralProfile {
    email : string;
    first_name : string;
    last_name : string;
    newsletter : boolean;
}

export interface blockedList {
    photo : string;
    blocked : [
        {
            user_id : string;
            first_name : string;
            last_name : string;
            photo : string;
        }
    ]
}

export interface StripeIntent {
    client_secret: string; 
    id: string;  
    status: string;
}

export interface Availability {
    day_of_week: number;
    morning: boolean;
    morning_start_time: string | null;
    morning_end_time: string | null;
    afternoon: boolean;
    afternoon_start_time: string | null;
    afternoon_end_time: string | null;
    evening: boolean;
    evening_start_time: string | null;
    evening_end_time: string | null;
  }


  export interface BillingsData {
    billings :  {
        id: string
        date: string
        type: "auto" | "not-auto"
        invoiceLink: string
    }[],
    amount : number
  }

  export interface UserSubscriptionData {
    history : {
      id: string
      month: string
      status: "ok" | "wait" | "cancelled"
      name : string
      invoiceLink: string
    }[]
    customer_stripe_id: boolean
    plan : Plan;
  }


  export interface CommonSettingsForm {
    company_name?: string;
    siret?: string;
    address: string;
    service_type?: string;
    postal_code: string;
    city: string;
    country: string;
    phone?: string;
    professional_email?: string;
    phone_number?: string;
  }

export class ProfileAPI {
    static async getMyPlanning(): Promise<CalendarEvent[]> {
        const response = await axiosInstance.get<CalendarEvent[]>("/client/planning");
        return response.data;
    }

    static async createReport(message : string) : Promise<void> {
        await axiosInstance.post("/client/profile/report", { report_message : message });
    }

    static async getMyGeneralProfile() : Promise<GeneralProfile> {
        const response = await axiosInstance.get<GeneralProfile>("/client/profile/general-settings");
        return response.data;
    }

    static async updateMyGeneralProfile(data: GeneralProfile) : Promise<void> {
        await axiosInstance.patch("/client/profile/general-settings", data);
    }

    static async updateMyProfileImage(file : File) : Promise<{ url: string }> {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axiosInstance.put("/client/profile/picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    static async getAllBlockedUsers(): Promise<blockedList> {
        const response = await axiosInstance.get<blockedList>("/client/profile/blockedList");
        return response.data;
    }

    static async unblockUser(userId: string): Promise<void> {
        await axiosInstance.delete(`/client/profile/blocked/${userId}`);
    }

    static async getStripeAccount() : Promise<{stripeAccountId : string}> {
        const response = await axiosInstance.get<{stripeAccountId : string}>("/client/profile/stripe-account");
        return response.data;
    }

    static async createStripeAccount(): Promise<{ stripeAccountId: string, accountLinkUrl : string }> {
        const response = await axiosInstance.post<{ stripeAccountId: string, accountLinkUrl : string }>(
          "/client/profile/create-account"
        );
        return response.data;
      }

    static async updateStripeAccount(): Promise<{ accountLinkUrl : string }> {
        const response = await axiosInstance.post<{ accountLinkUrl : string }>(
          "/client/profile/update-account"
        );
        return response.data;
      }

      static async getStripeAccountValidity(): Promise<{
        valid: boolean;
        enabled: boolean;
        needs_id_card: boolean;
        url_complete?: string;
      }> {
        const response = await axiosInstance.get<{
          valid: boolean;
          enabled: boolean;
          needs_id_card: boolean;
          url_complete?: string;
        }>("/client/profile/stripe-validity");
      
        return response.data;
      }

      static async getMyAvailability(): Promise<Availability[]> {
        const response = await axiosInstance.get<Availability[]>("/client/profile/availability");
        return response.data;
      }
      
      static async updateMyAvailability(availabilities: Availability[]): Promise<Availability[]> {
        const response = await axiosInstance.put<Availability[]>("/client/profile/availability", {
          availabilities,
        });
        return response.data;
      }

      static async getMyProfileDocuments() {
        const response = await axiosInstance.get("/client/profile/myDocuments");
        return response.data;
      }

      static async updateMyPassword() {
        const response = await axiosInstance.post("/client/profile/newPassword");
        return response.data;
      }

      static async registerNotification(oneSignalId: string) {
        const response = await axiosInstance.post("/client/profile/registerDevice", { oneSignalId });
        return response.data;
      }

      static async getMyBillings(): Promise<BillingsData> {
        const response = await axiosInstance.get<BillingsData>("/client/profile/billings");
        return response.data;
      }

      static async createPayment(){
        const response = await axiosInstance.post<StripeIntent>("/client/profile/create-payment");
        return response.data;
      }

      static async getMySubscription(): Promise<UserSubscriptionData> {
        const response = await axiosInstance.get<UserSubscriptionData>("/client/profile/my-subscription");
        return response.data;
      }

      static async updateMySubscription(planId: number, paymentMethodId?: string): Promise<any> {

        const response = await axiosInstance.patch("/client/profile/subscription", {
          planId,
          paymentMethodId,
        });
        return response.data;
      }

      static async getCommonSettings() : Promise<CommonSettingsForm> {
        const response = await axiosInstance.get<CommonSettingsForm>("/client/profile/professionnal");
        return response.data;
      }

      static async updateCommonSettings(data: CommonSettingsForm) : Promise<void> {
        await axiosInstance.patch("/client/profile/professionnal", data);
      }

      static async updateBankData(paymentMethodId: string) : Promise<void> {
        await axiosInstance.patch("/client/profile/bank-data", { paymentMethodId });
      }

}
