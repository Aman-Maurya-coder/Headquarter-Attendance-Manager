import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User } from "./models/user.model.js";
import userRouter from "./routes/user.routes.js";
import uploadRouter from "./routes/upload.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import calenderRouter from "./routes/calender.route.js";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { verifyWebhook } from '@clerk/express/webhooks'
import { ApiResponse } from "./utils/ApiResponse.js";
// import scheduleRouter from "./routes/schedule.routes.js"

const app = express();

app.post('/api/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const evt = await verifyWebhook(req)
        // const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const { type, data } = evt;

        if (type === "user.created") {
            await User.create({
            clerk_id: data.id,
            email: data.email_addresses[0].email_address,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            });
            console.log("User created:", data.id);
        }

        if (type === "user.updated") {
            await User.findOneAndUpdate(
            { clerk_id: data.id },
            {
                email: data.email_addresses[0].email_address,
                first_name: data.first_name || "",
                last_name: data.last_name || "",
            }
            );
            console.log("User updated:", data.id);
        }

        if (type === "user.deleted") {
            await User.findOneAndDelete({ clerk_id: data.id });
            console.log("User deleted:", data.id);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
})

app.use(clerkMiddleware());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Use environment variable or default to your frontend URL
  })
);

// Clerk requires raw body for signature verification
app.use("/webhooks/clerk", express.raw({ type: "application/json" }));

app.post("/webhooks/clerk", async (req, res) => {
    console("webhook called");
    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
        evt = wh.verify(payload, headers); // verify Clerk signature
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).send("Invalid signature");
    }

    const { type, data } = evt;

    if (type === "user.created") {
        await User.create({
        clerk_id: data.id,
        email: data.email_addresses[0].email_address,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        });
        console.log("User created:", data.id);
    }

    if (type === "user.updated") {
        await User.findOneAndUpdate(
        { clerk_id: data.id },
        {
            email: data.email_addresses[0].email_address,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
        }
        );
        console.log("User updated:", data.id);
    }

    if (type === "user.deleted") {
        await User.findOneAndDelete({ clerk_id: data.id });
        console.log("User deleted:", data.id);
    }

    res.status(200).json({ received: true });
});
// app.get("/api/protected", requireAuth(), async (req, res) => {
//     console.log("user signed up");
//     const { userId } = getAuth(req); // Clerk’s userId
  
//     let dbUser = await User.findOne({ clerk_id: userId });
  
//     if (!dbUser) {
//       dbUser = await User.create({
//         clerk_id: userId,
//         email: "placeholder@example.com",
//         first_name: "",
//         last_name: "",
//       });
//     }
  
//     return res
//       .status(200)
//       .json(new ApiResponse(200, dbUser, "User fetched successfully"));
//   });

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);

app.use("/api/v1/upload", uploadRouter);

app.use("/api/v1/dashboard", dashboardRouter);

app.use("/api/v1/calendar", calenderRouter);

export { app };
