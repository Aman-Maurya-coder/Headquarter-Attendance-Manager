import express from "express"
import { registerUser,
    loginUser,
    logout,
    refreshAccessToken
}
    from "../controllers/user.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(authMiddleware, logout)
router.route("/refreshToken").post(refreshAccessToken)




export default router













