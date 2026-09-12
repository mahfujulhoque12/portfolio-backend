import dotenv from "dotenv";

dotenv.config();

import axios from "axios";
import FormData from "form-data";

export const uploadToImgBB = async (fileBuffer) => {
  try {
    const formData = new FormData();

    formData.append("image", fileBuffer.toString("base64"));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    // ImgBB response structured output
    return {
      url: response.data.data.url, // Direct Image Link
      deleteUrl: response.data.data.delete_url, // Image delete করার URL
      id: response.data.data.id, // Unique Image ID
    };
  } catch (error) {
    console.error("ImgBB Upload Error:", error.response?.data || error.message);
    throw new Error("Failed to upload image to ImgBB");
  }
};
