import { Router } from "express";
import {SendOtp,VerifyOtp} from "./controller"
const router=Router();
router.post("/send-otp",SendOtp);
router.post("/verify-otp",VerifyOtp)
export default router;
