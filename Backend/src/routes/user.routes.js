import express from "express"
import { registerUser } from "../controllers/user.controllers.js"
const router = express.Router()

router.route("/signup").post(registerUser)
// router.route("/login").post(existingUser)





export default router













