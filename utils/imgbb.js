import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const uploadToImgBB = async (fileBuffer) => {
  try {
    // =========================
    // Validate API Key
    // =========================
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("IMGBB_API_KEY is missing");
    }

    // =========================
    // Convert Buffer → Base64
    // =========================
    const base64Image = fileBuffer.toString("base64");

    // =========================
    // Create request body
    // =========================
    const formData = new URLSearchParams();

    formData.append("key", apiKey);
    formData.append("image", base64Image);

    // =========================
    // Upload to ImgBB
    // =========================
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        timeout: 30000,
      },
    );

    // =========================
    // Validate response
    // =========================
    if (!response.data?.success) {
      console.error("ImgBB API Response:", response.data);

      throw new Error(response.data?.error?.message || "ImgBB upload failed");
    }

    const imageData = response.data.data;

    // =========================
    // Return image information
    // =========================
    return {
      url: imageData.url,
      deleteUrl: imageData.delete_url,
      id: imageData.id,
    };
  } catch (error) {
    console.error("ImgBB Upload Error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.error?.message || "Failed to upload image to ImgBB",
    );
  }
};
