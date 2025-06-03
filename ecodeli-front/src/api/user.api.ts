import { setError, setLoading, setUser } from '@/redux/slices/userSlice';
import { AppDispatch } from '@/redux/store';
import axiosInstance from './axiosInstance';

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
  language: string;
  iso_code: string;
  profile: string[];
  otp?: boolean | false;
  updgradablePlan?: boolean | false;
  planName?: string;
}

export class UserApi {

  static getUserData = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
  
    try {
      const response = await axiosInstance.get("/client/profile/me");

      if (response && response.data) {
        const userData = response.data;
        dispatch(setUser(userData));
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch(setError("Erreur lors de la récupération des données de l'utilisateur"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  static async isFirstLogin () {
    const response = await axiosInstance.get("/client/theme/firstLogin/check");
    return response.data.firstLogin === true;
  }

  static async addFirstLogin () {
    const response = await axiosInstance.post("/client/theme/firstLogin/");
    return response.status === 200;
  }

  static async updateLanguage(language_id : string) {
    const response = await axiosInstance.patch("/client/profile/language", { language_id });
    return response.data;
  }

  // ========================
  // ====== PROVIDER ========
  // ========================

  static async getProviderDocuments() {
    const response = await axiosInstance.get("/client/profile/provider/documents");
    return response.data;
  }

  static async uploadProviderDocument(
    file: File,
    name: string,
    description?: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }

    try {
      const response = await axiosInstance.post(
        "/client/profile/provider/documents/add",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'upload du document provider:", error);
      throw error;
    }
  }

}
