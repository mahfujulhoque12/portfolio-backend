import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const uploadToImgBB = async (fileBuffer) => {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("IMGBB_API_KEY is missing in Render environment");
    }

    if (!fileBuffer) {
      throw new Error("Image buffer is missing");
    }

    const base64Image = fileBuffer.toString("base64");

    // URLSearchParams ব্যবহার করে payload তৈরি করা
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("image", base64Image);

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 60000,
      },
    );

    if (!response.data?.success) {
      throw new Error(response.data?.error?.message || "ImgBB upload failed");
    }

    return {
      url: response.data.data.url,
      deleteUrl: response.data.data.delete_url,
      id: response.data.data.id,
    };
  } catch (error) {
    console.error("========== ImgBB ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);
    console.error("================================");

    throw new Error(
      error.response?.data?.error?.message || "Failed to upload image to ImgBB",
    );
  }
};
