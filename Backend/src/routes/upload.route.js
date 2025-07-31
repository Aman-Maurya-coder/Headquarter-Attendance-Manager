import express from "express";  
import { addSubject, deleteSubject, getSubjects } from "../controllers/upload.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const uploadRouter = express.Router();

uploadRouter.route("/add").post(authMiddleware,addSubject)
uploadRouter.route("/delete").delete(authMiddleware,deleteSubject)
uploadRouter.route("/getSubjects").get(authMiddleware,getSubjects)

export default uploadRouter;