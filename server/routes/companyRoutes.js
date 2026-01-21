import express from "express";
import {
  changeJobApplicationStatus,
  changeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJob,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyController.js";
import { upload } from "../config/Multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/register", upload.single("image"), registerCompany);
router.post("/login", loginCompany);
router.get("/company", protectCompany, getCompanyData);
router.post("/postjob", protectCompany, postJob);
router.get("/applicants", protectCompany, getCompanyJobApplicants);
router.get("/listjob", protectCompany, getCompanyPostedJob);
router.post("/changestatus", protectCompany, changeJobApplicationStatus);
router.post("/changeJobvisibility", protectCompany, changeJobVisibility);

export default router;
