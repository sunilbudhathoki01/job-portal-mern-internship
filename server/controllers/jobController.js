import { Job } from "../models/Job.js"

// get all jos
export const getAllJobs=async(req,res)=>{
   try {
    const jobs=await Job.find({visible:true})
    .populate({path:"companyId",select:"-password"})
    res.json({success:true,jobs})
   } catch (error) {
    res.json({
        success:false,
        message:error.message
    })
   }
}

// get a job by id
export const getJobById=async(req,res)=>{
    try {
        const {id}=req.params
        if(!id){
           return  res.status(400).json({
                success:false,
                message:"Invalid job id"
            })
        }
        const jobs=await Job.findById(id).populate({path:"companyId",select:"-password"})
        if(!jobs){
            return res.status(404).json({
                success:false,
                message:"job not found"
            })
        }
        res.status(200).json({success:true,jobs})
    } catch (error) {
         res.status(500).json({
        success:false,
        message:error.message
    })
    }
}
