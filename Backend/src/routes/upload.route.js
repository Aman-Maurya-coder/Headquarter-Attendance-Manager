import express from "express";  
import { addSubject, deleteSubject, getSubjects } from "../controllers/upload.controllers.js";
import { requireAuth, clerkMiddleware } from '@clerk/express'
import { authMiddleware } from "../middlewares/auth.middleware.js"

const uploadRouter = express.Router();

uploadRouter.use(clerkMiddleware())

uploadRouter.route("/add").post(requireAuth(),addSubject)
uploadRouter.route("/delete").delete(requireAuth(),deleteSubject)
uploadRouter.route("/getSubjects").get(requireAuth(),getSubjects)
// uploadRouter.route("/add").post(authMiddleware,addSubject)
// uploadRouter.route("/delete").delete(authMiddleware,deleteSubject)
// uploadRouter.route("/getSubjects").get(authMiddleware,getSubjects)

export default uploadRouter;