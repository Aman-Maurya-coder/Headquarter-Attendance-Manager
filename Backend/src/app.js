import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import uploadRouter from "./routes/upload.route.js" 
import dashboardRouter from "./routes/dashboard.route.js"
import calenderRouter from "./routes/calender.route.js"
// import scheduleRouter from "./routes/schedule.routes.js"

const app = express()

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173", // Use environment variable or default to your frontend URL
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users",userRouter)

app.use("/api/v1/upload", uploadRouter) 

app.use("/api/v1/dashboard", dashboardRouter)

app.use("/api/v1/calendar", calenderRouter)




export {app}