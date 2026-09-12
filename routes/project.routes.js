import express from "express";
import { addProject, getProjects } from "../controllers/project.controller.js";
import upload from "../middlewares/upload.middleware.js";

const projectRouter = express.Router();

projectRouter.post("/add-project", upload.single("image"), addProject);
projectRouter.get("/get-projects", getProjects);

export default projectRouter;
