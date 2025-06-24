import express from 'express';
import { getAllJobs, createJob, validateJob,deleteJob ,updateJob } from '../controllers/job_controller.js';
import { applyToJob, getAppliedJobs } from '../controllers/application_controller.js';
import { protectRoute } from '../middleware/auth.js';

const jobRoute = express.Router();


// Route to get all active jobs
jobRoute.get('/', protectRoute, getAllJobs);
// Route to create a new job
jobRoute.post('/', protectRoute, validateJob, createJob);
// Route to delete a job
jobRoute.delete('/:id', protectRoute, deleteJob);
//Route to update a job
jobRoute.put('/:id', protectRoute, validateJob, updateJob);


//Application of the job endoints
jobRoute.post('/:id/apply',protectRoute,applyToJob);
jobRoute.get('/applied', protectRoute, getAppliedJobs);



export default jobRoute;