import { Router } from "express";

import  addGallery,{getGallery,getAlbum,getAttendees} from "./controller";
const router: Router = Router();
router.post("/admin/savegallery", addGallery);
router.get("/alumni/galery",getGallery);
router.get("/alumni/gallery/:eventName",getAlbum);
router.get('/event/alumni/:eventName', getAttendees);
export default router;