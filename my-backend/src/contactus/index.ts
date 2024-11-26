import { Router } from "express";
import AlumniRouter from "./routes";

const router = Router();
// Defining the core path from which this module should be accessed
router.use("/", AlumniRouter)


export default router;