import express from "express";  
const uploadRouter = express.Router();

uploadRouter.route("/add").post()
uploadRouter.route("/delete").delete()
uploadRouter.route("/getsubjects").get()




export default uploadRouter;