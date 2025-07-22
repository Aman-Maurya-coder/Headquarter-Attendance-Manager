import express from "express"
import { registerUser, loginUser, logoutUser} from "../controllers/user.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const userRouter = express.Router()

// For registering a new user
userRouter.route("/signup").post(registerUser)

// For logging in a user
userRouter.route("/login").post(loginUser)

//fior logging out a user
userRouter.route("/logout").post(authMiddleware, logoutUser)


export default userRouter













