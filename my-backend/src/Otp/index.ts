import { Router } from "express";
import otpRouter from "./routes";

const router=Router();
router.use("/",otpRouter);


export default router;