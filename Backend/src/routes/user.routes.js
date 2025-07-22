import express from "express"
import { loginUser, registerUser, logoutUser } from "../controllers/user.controllers.js"
const userRouter = express.Router()

userRouter.route("/signup").post(registerUser)

userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(logoutUser)





export default userRouter













