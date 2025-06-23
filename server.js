import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import auth from "./routes/auth.js"
import vibe from "./routes/vibes.js"
import connectDB from './config/db.js'

dotenv.config(); 

const app = express();

app.use(express.json());

connectDB()

app.use("/api/v1/auth", auth);
app.use("/api/v1/vibes", vibe);   

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server blasting off on port ${PORT}.`);
});
