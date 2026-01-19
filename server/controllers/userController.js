import { User } from "../models/User.js";

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
export const applyForJob = async (req, res) => {};

// get user applied applications
export const getUserJobApplications = async (req, res) => {};

// update user profile
export const updateUserResume = async (req, res) => {};
