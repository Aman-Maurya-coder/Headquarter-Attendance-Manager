import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"

const app = express()

app.use(cors({
    credentials: true,
    origin: "*",
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/users",userRouter)




export {app}