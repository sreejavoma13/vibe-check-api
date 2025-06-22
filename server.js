import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from "./routes/auth"
import vibeRoutes from "./routes/vibes"
import connectDB from '../config/db.js'

dotenv.config(); 

const app = express();

app.use(express.json());

connectDB()

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vibes", vibeRoutes);   

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server blasting off on port ${PORT}.`);
});
