import User from "../models/User.js";
import Job from "../models/Job.js";
import { ROLES } from "../constants/roles.js";
import { body, validationResult } from "express-validator";


export const validateJob = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("company").notEmpty().withMessage("Company is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("salary").isNumeric().withMessage("Salary must be a number"),
  body("type").isIn(["Full-time", "Part-time", "Contract", "Internship"]).withMessage("Invalid job type"),
  body("requirements").notEmpty().withMessage("Requirements are required"),
  body("responsibilities").notEmpty().withMessage("Responsibilities are required"),
];

export const getAllJobs = async (req,res,next) =>{
    try {
        const { title, location, type } = req.query;
        let filter = { isActive: true };
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        if (type) {
            filter.type = { $regex: `^${type}$`, $options: 'i' };
        }
        const jobs = await Job.find(filter);
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No active jobs found" });
        }
        res.status(200).json(jobs);
        
    } catch (error) {
        next(error);
    }
 }

 export const createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, company, location, salary, type, requirements, responsibilities } = req.body;
  const userId = req.user.userId;
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: "Access denied. Only admins can create jobs." });
    }
    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      type,
      requirements,
      responsibilities,
      postedBy: userId
    });
    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    next(error);
  }
 };


 export const deleteJob = async (req,res,next) => {
  try {
    if (req.user.role!==ROLES.ADMIN){
      return res.status(403).json({error:"Only admins can delete jobs "});
    }
    const jobId = req.params.id;
    if (!jobId){
      return res.status(400).json({error:"No Job ID specified"});
    }
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob){
      return  res.status(404).json({error:"Job not found"});
    }
    res.status(200).json({ message: "Job deleted successfully", job: deletedJob });
  } catch (error) {
    next(error);
  }
 }

 export const updateJob = async (req,res,next) =>{
  try {
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: "Access denied. Only admins can update jobs." });
    }
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({ error: "No Job ID specified" });
    }
    const updates = req.body;
    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    next(error);
  }
 }