import { Router } from "express";

import  addEvent,{getEvents,getEvent,getNames,deleteEvent,getCount} from "./controller";
const router: Router = Router();
router.post("/admin/addevent", addEvent);
router.get("/alumni/getevents",getEvents);
router.post('/events/join', addEvent);
router.get("/admin/events/getnames",getNames);
router.get("/admin/getevents",getEvents);
router.get("/events/count",getCount);
router.delete("/event/delete/:id",deleteEvent);
export default router;