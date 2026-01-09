import { Company } from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/generateToken.js";
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
export const loginCompany = async (req, res) => {};

// get company data

export const getCompanyData = async (req, res) => {};

//post a new job
export const postJob = async (req, res) => {};

// get a company job applicants
export const getCompanyJobApplicants = async (req, res) => {};

// get company posted job
export const getCompanyPostedJob = (req, res) => {};

//change job application status
export const changeJobApplicationStatus = async (req, res) => {};
// change job visibility
export const changeJobVisibility = async (req, res) => {};
