import { Router } from "express";

import  addEvent from "./controller";
const router: Router = Router();
router.post("/contactus", addEvent);

export default router;