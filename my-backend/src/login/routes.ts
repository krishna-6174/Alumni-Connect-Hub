import { Router } from "express";

import { isUserValid } from "./controller";

const router: Router = Router();
console.log("i am backend in login")
// Registering all the login module routes
router.post("/login", isUserValid);
// router.post("/adminlogin",isAdmin);
// router.get("/desg", desg);

export default router;