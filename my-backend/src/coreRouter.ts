import { Router } from "express";
import loginRouter from "./login";
import job from "./jobs/index"
import {  verifyToken } from "./login/controller";
import  LoginRouter from "./login"
import registerRouter from './Register';
import AlumnisRouter from './Alumnis';
import eventRouter from "./Events"
import GalleryRouter from './Gallery'
import OTPRouter from "./Otp";
import AdminRouter from "./Admin";
import { getGallery,getAlbum } from "./Gallery/controller";
import { getEvents,getEvent } from "./Events/controller";
import contactus from "./contactus";
console.log("i am in CoreRoter");
const router = Router();
router.get("/galery",getGallery);
router.get("/getevents",getEvents);
router.get("/gallery/:eventName",getAlbum);
router.get("/event/:id",getEvent);
router.use("/",OTPRouter);
router.use("/",contactus)
router.use("/",LoginRouter)
router.use('/', registerRouter);
router.use(verifyToken);
router.use("/",AdminRouter);
router.use('/',GalleryRouter);
router.use('/',eventRouter);
router.use("/", job);
router.use("/",AlumnisRouter);

export default router;