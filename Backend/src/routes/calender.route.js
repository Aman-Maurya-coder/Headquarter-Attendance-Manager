import express from "express"
import { dateSubjects } from "../controllers/calender.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { requireAuth, clerkMiddleware } from '@clerk/express'

const calenderRouter = express.Router();
calenderRouter.use(clerkMiddleware())

calenderRouter.route("/date").get(requireAuth(), dateSubjects);

export default calenderRouter;