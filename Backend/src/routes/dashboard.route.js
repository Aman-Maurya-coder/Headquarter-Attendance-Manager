import express from "express"
import { getDateData , subjectWiseAttendance, subjectsData} from "../controllers/dashboard.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { requireAuth, clerkMiddleware } from '@clerk/express'

const dashboardRouter = express.Router();

dashboardRouter.use(clerkMiddleware())

dashboardRouter.route("/DateData").post(requireAuth(),getDateData)
dashboardRouter.route("/subjAttendance").post(requireAuth(),subjectWiseAttendance)
dashboardRouter.route("/subjData").get(requireAuth(), subjectsData)
// dashboardRouter.route("/cancel").get()

export default dashboardRouter;