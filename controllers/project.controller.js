import Project from "../models/project.model.js";
import { uploadToImgBB } from "../utils/imgbb.js";

const parseTechnologies = (technologies) => {
  if (!technologies) return [];

  try {
    const parsed = JSON.parse(technologies);
    if (Array.isArray(parsed)) {
      return parsed.map((tech) => tech.trim()).filter(Boolean);
    }
  } catch {
    // Not JSON, fallback to comma-separated string
  }

  return technologies
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
};

export const addProject = async (req, res) => {
  try {
    const { title, description, technologies, liveUrl, githubUrl, type } =
      req.body;

    // ================= VALIDATION =================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }

    if (!title || !description || !technologies || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, description, technologies and type are required",
      });
    }

    if (!["company", "personal"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Project type must be company or personal",
      });
    }

    const technologyList = parseTechnologies(technologies);

    if (technologyList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one technology is required",
      });
    }

    // ================= IMGBB UPLOAD =================
    const uploadedImage = await uploadToImgBB(req.file.buffer);

    // ================= CREATE PROJECT =================
    const project = await Project.create({
      image: uploadedImage.url, // Direct URL from ImgBB
      imagePublicId: uploadedImage.id, // ImgBB Image ID
      title: title.trim(),
      description: description.trim(),
      technologies: technologyList,
      liveUrl: liveUrl?.trim() || "",
      githubUrl: githubUrl?.trim() || "",
      type,
    });

    // ================= RESPONSE =================
    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      project,
    });
  } catch (error) {
    console.error("Add project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add project",
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
