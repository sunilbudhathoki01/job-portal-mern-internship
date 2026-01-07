import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/db.js";

// initialize expree
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// call mongodb connection function
await connectDb();

// routes
app.get("/", (req, res) => {
  res.send("API is working");
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
