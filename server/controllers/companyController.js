import { Company } from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/generateToken.js";
import { Job } from "../models/Job.js";
//Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const ImageFile = req.file;
  if (!name || !email || !password || !ImageFile) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(409).json({
        success: false,
        message: "company already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(ImageFile.path);
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });
    res.status(201).json({
      success: true,
      message: "company registered successfully",
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// login company
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password is required",
      });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({
        success: false,
        message: "invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "email or password does not match",
      });
    }
    res.status(200).json({
      success: true,
      message: "login successfull",
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get company data

export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

//post a new job
export const postJob = async (req, res) => {
  try {
    const { title, description, location, salary, level, category } = req.body;

    // Validation
    if (!title || !description || !location || !salary || !level || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check company authentication
    if (!req.company || !req.company._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Company not found",
      });
    }
    const companyId = req.company._id;

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });
    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// get a company job applicants
export const getCompanyJobApplicants = async (req, res) => {};

// get company posted job
export const getCompanyPostedJob = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });
    // (TODO) Adding no of applicants info in data
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//change job application status
export const changeJobApplicationStatus = async (req, res) => {};
// change job visibility
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;
    const job = await Job.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
