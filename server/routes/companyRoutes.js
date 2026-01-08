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
const router = express.Router();
router.post("/register", upload.single("image"), registerCompany);
router.post("/login", loginCompany);
router.get("/company", getCompanyData);
router.post("/postjob", postJob);
router.get("/applicants", getCompanyJobApplicants);
router.get("/listjob", getCompanyPostedJob);
router.post("/changestatus", changeJobApplicationStatus);
router.post("/changeJobvisibility", changeJobVisibility);

export default router;
