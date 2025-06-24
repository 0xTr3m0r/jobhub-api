import Job from "../models/Job.js";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import path from "path";

export const applyToJob = async (req, res, next) => {
    try {
        if (req.user.role !== ROLES.USER) {
            return res.status(403).json({ error: "Access denied. Only users can apply for jobs." });
        }
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({ error: "No Job ID specified" });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
       
        user.appliedJobs = user.appliedJobs.filter(app => app && app.job && app.cv);
      
        const alreadyApplied = user.appliedJobs.some(app => app && app.job && app.job.toString() === jobId);
        if (alreadyApplied) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }
       
        if (!req.file) {
            return res.status(400).json({ error: "CV file is required" });
        }
       
        const allowedTypes = ["application/pdf"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Only PDF files are allowed for CV uploads." });
        }
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: "CV file size must be less than 5MB." });
        }
        const cvPath = req.file.path;
        if (!cvPath) {
            return res.status(500).json({ error: "CV file path is missing. Upload failed." });
        }
        
        user.appliedJobs.push({ job: jobId, cv: cvPath });
        await user.save();
        
        res.status(200).json({ message: "Job application successful", job, cv: path.basename(cvPath) });
    } catch (error) {
        console.error('Error in applyToJob:', error); 
        next(error);
    }
}

export const getAppliedJobs = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // Populate the job field inside each appliedJobs entry
        const user = await User.findById(userId).populate({
            path: 'appliedJobs.job',
            model: 'Job'
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ appliedJobs: user.appliedJobs });
    } catch (error) {
        next(error);
    }
}