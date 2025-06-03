import 'dotenv/config'
import express from "express";
import connectDB from './db/index.js';

const app = express();

connectDB();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         app.on("error", (err) => {
//             console.error("Express app error:", err);
//         })

//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server is running on port ${process.env.PORT || 8000}`);
//         })
//     }
//     catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//     }
// })();
