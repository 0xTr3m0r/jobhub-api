
import Job from "../models/Job.js";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

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
        // Check if the user has already applied for this job
        if (user.appliedJobs.includes(jobId)) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }
        // Add the job to the user's applied jobs
        user.appliedJobs.push(jobId);
        await user.save();
        res.status(200).json({ message: "Job application successful", job });
    } catch (error) {
        next(error);
    }
}

export const getAppliedJobs = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('appliedJobs');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ appliedJobs: user.appliedJobs });
    } catch (error) {
        next(error);
    }
}