import express from "express"
import { registerUser } from "../controllers/user.controllers.js"
const router = express.Router()

router.route("/signup").post(registerUser)
// router.route("/login").post(existingUser)

// Secured Routes
router.route("/logout").post(authMiddleware, logout)
router.route("/refreshToken").post(refreshAccessToken)




export default userRouter













