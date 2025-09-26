import { API_URLS } from "./apipaths";
import axiosInstance from "./axiosinstance";

const uploadimage = async (file) => {
  const formdata = new FormData();
  formdata.append("image", file);
  try {
    const response = await axiosInstance.post(API_URLS.image.UPLOAD_IMAGE, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
export default uploadimage;