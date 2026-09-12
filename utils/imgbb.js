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

    console.log("ImgBB upload started...");
    console.log("API key exists:", Boolean(apiKey));
    console.log("Image buffer size:", fileBuffer.length);

    const response = await axios.post("https://api.imgbb.com/1/upload", null, {
      params: {
        key: apiKey,
        image: base64Image,
      },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log("ImgBB response:", response.data);

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
