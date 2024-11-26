import { Router } from "express";
import loginRouter from "./routes";

const router = Router();
console.log("i am in jobs")
// Defining the core path from which this module should be accessed
router.use("/", loginRouter)
export default router;