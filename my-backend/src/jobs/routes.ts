import { Router } from "express";

import { addJob,getJobs,getJob,updateJob,deleteJob,jobsforcard,getCount,getActiveJobs} from "./controller";

const router: Router = Router();
console.log("i am backend in login")
// Registering all the login module routes
router.post("/jobs/add",addJob);
router.get("/admin/jobs",getJobs);
router.get("/admin/activejobs",getActiveJobs);
router.get("/jobs/:id",getJob)
router.patch("/updatejob/:id",updateJob);
router.delete("/deletejob/:id",deleteJob)
router.get("/job-posts/count",getCount);
router.get('/alumni/jobsforcards',jobsforcard)
// router.get("/desg", desg);
export default router;