import express from "express"
import { dateSubjects } from "../controllers/calender.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
const calenderRouter = express.Router();

calenderRouter.route("/date").get(authMiddleware, dateSubjects);

export default calenderRouter;