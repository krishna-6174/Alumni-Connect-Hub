import { Router } from "express";

import { getAlumnisDetails,getAlumni,updateAlumni,deleteAlumni,alumnisforCard,getCount,getTotal,getActiveAlumnisDetails } from "./controller";

const router: Router = Router();
// console.log("i am backend in login")
// Registering all the login module routes
router.get("/admin/getalumnis", getAlumnisDetails);
router.get("/admin/getactivealumnis", getActiveAlumnisDetails);
router.get('/admin/alumni/:id',getAlumni)
router.patch("/admin/updatealumni/:id",updateAlumni)
router.delete("/admin/deletealumni/:id",deleteAlumni);
router.get('/alumni/getalumniscards',alumnisforCard);
router.get("/alumni/registrations/count",getCount);
router.get("/alumni/total/count",getTotal);
// router.get("/desg", desg);

export default router;