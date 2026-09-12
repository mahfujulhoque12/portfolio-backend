import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },

    technologies: {
      type: [String],
      required: [true, "Technologies are required"],
    },

    liveUrl: {
      type: String,
      trim: true,
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["company", "personal"],
      required: [true, "Project type is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
