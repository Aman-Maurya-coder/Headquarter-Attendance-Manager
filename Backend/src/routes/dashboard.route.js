import express from "express"
import { getDateData , subjectWiseAttendance, subjectsData} from "../controllers/dashboard.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const dashboardRouter = express.Router();

dashboardRouter.route("/DateData").post(authMiddleware,getDateData)
dashboardRouter.route("/subjAttendance").post(authMiddleware,subjectWiseAttendance)
dashboardRouter.route("/subjData").get(authMiddleware, subjectsData)
// dashboardRouter.route("/cancel").get()

export default dashboardRouter;