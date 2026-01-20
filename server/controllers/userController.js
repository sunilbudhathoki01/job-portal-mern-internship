import { Job } from "../models/Job.js";
import jobApplication from "../models/jobApplications.js";
import { User } from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
// getUser Data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;
  try {
    const isAlreadyApplied = await jobApplication.find({ jobId });
    if (isAlreadyApplied.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Already applied for this job",
      });
    }
    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }
    await jobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });
    res.status(200).json({
      success: true,
      message: "job applied successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const applications = await jobApplication
      .find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description,location category level salary")
      .exec();
    if (!applications) {
      return res.status(400).json({
        success: false,
        message: "no job application found",
      });
    }
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update user profile
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.resumeFile;
    const userData = await User.findById(userId);
    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }
    await userData.save();
    return res.status(200).json({
      success: true,

      message: "resume updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
