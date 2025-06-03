import axiosInstance from "./axiosInstance";

export const uploadImage = async (image: File, bucket: string): Promise<string | null> => {
  try {
    if (bucket === "ticket") {
      const formData = new FormData();
      formData.append("photo", image);

      const response = await axiosInstance.post("/admin/ticket/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } else if (bucket === "email"){
      const formData = new FormData();
      formData.append("photo", image);

      const response = await axiosInstance.post("/admin/email/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } else {
      console.log("bucket", bucket);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw new Error("L'upload a échoué");
  }
};