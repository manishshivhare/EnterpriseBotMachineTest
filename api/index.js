import express, { urlencoded } from "express";
import connectDB from "./db/database.js";
import dotenv from "dotenv";
import adminRoutes from "./routers/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(cors());

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Admin API" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
