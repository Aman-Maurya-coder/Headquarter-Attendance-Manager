import express from "express"
import { getDateData , subjectWiseAttendance} from "../controllers/dashboard.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const dashboardRouter = express.Router();

dashboardRouter.route("/DateData").post(authMiddleware,getDateData)
// dashboardRouter.route("/subjAttendance").get(authMiddleware,subjectWiseAttendance)
// dashboardRouter.route("/absent").get()
// dashboardRouter.route("/cancel").get()

export default dashboardRouter;