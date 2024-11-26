import { Router } from "express";
import AlumniRouter from "./controller";

const router = Router();
// Defining the core path from which this module should be accessed
router.post("/admin/add", AlumniRouter)
export default router;