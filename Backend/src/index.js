import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

app.listen(process.env.PORTPORT || 8000, () => {
  console.log(`Server is running on local host ${process.env.PORT||8000}`);
});




