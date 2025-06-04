import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";



// import signupRoute from "./routes/signupRoutes.js";
// import loginRoute from "./routes/loginRoute.js";

dotenv.config({
  path: "./env",
});

const app = express();

app.use(cors({credentials: true,origin: "*",}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users",userRouter)
// app.use("/signup",signupRoute)



app.listen(process.env.PORTPORT || 8000, () => {
  console.log(`Server is running on local host ${process.env.PORT || 8000}`);
});
