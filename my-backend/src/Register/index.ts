import { Router } from "express";
import Register from "./routes"
const router=Router()
router.use('/',Register);
export default router