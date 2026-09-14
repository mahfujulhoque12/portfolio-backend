import Project from "../models/project.model.js";
import uploadCloudinary from "../utils/cloudinary.js";

import { parseTechnologies } from "../utils/parseTechnologies.js";

export const addProject = async (req, res) => {
  try {
    const { title, description, technologies, liveUrl, githubUrl, type } =
      req.body;

    // 1. Basic Field Validation
    if (!title || !description || !technologies || !type) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, technologies, and type are required fields.",
      });
    }

    // 2. Type Validation
    if (!["company", "personal"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'company' or 'personal'.",
      });
    }

    // 3. Technologies Validation
    const parsedTechs = parseTechnologies(technologies);

    if (parsedTechs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one valid technology.",
      });
    }

    // 4. Image Upload
    let imageUrl = "";

    if (req.file) {
      console.log("Uploading image:", req.file.originalname);

      const uploadedImageUrl = await uploadCloudinary(req.file.buffer);

      console.log("Cloudinary image URL:", uploadedImageUrl);

      imageUrl = uploadedImageUrl;
    }

    // 5. Create Project
    const newProject = await Project.create({
      title: title.trim(),
      description: description.trim(),
      technologies: parsedTechs,
      liveUrl: liveUrl?.trim() || "",
      githubUrl: githubUrl?.trim() || "",
      type,
      image: imageUrl,
    });

    // 6. Success Response
    return res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: newProject,
    });
  } catch (error) {
    console.error("Add Project Error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Server error
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to create project.",
      error: error.message,
    });
  }
};
export const getProjects = async (req, res) => {
  try {
    const { type } = req.query;

    // ================= FILTER =================
    const filter = {};

    if (type) {
      if (!["company", "personal"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Project type must be company or personal",
        });
      }

      filter.type = type;
    }

    // ================= GET PROJECTS =================
    const projects = await Project.find(filter).sort({
      createdAt: -1,
    });

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("PROJECT ADD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add project",
    });
  }
};
