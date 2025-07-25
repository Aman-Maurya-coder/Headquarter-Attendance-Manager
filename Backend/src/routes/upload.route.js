import express from "express";  
import { addSubject, deleteSubject, getSubjects } from "../controllers/upload.controllers";
const uploadRouter = express.Router();

uploadRouter.route("/add").post(addSubject)
uploadRouter.route("/delete").delete(deleteSubject)
uploadRouter.route("/getSubjects").get(getSubjects)

export default uploadRouter;