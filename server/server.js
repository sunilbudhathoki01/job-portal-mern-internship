import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import webhookRouter from "./routes/webhookRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import { connectCloudinary } from "./config/cloudinary.js";

// initialize expree
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// call mongodb connection function and cloudinary config
await connectDb();
await connectCloudinary();

// routes
app.use("/webhooks", webhookRouter);
app.use("/api/company", companyRouter);

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
