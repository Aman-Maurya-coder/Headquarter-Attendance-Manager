import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import uploadRouter from "./routes/upload.route.js" 
import dashboardRouter from "./routes/dashboard.route.js"
// import scheduleRouter from "./routes/schedule.routes.js"

const app = express()

app.use(cors({
    credentials: true,
    origin: "*",
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users",userRouter)

app.use("/api/v1/upload", uploadRouter) 

app.use("/api/v1/dashboard", dashboardRouter)




export {app}