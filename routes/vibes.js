import {z} from 'zod'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Vibe from '../models/Vibes.js'
import express from 'express'
import authenticate from '../middleware/auth.js'
const app=express()
app.use(express.json())
const JWT_SECRET =  process.env.JWT_SECRET;
dotenv.config()
connectDB()

app.post('/api/v1/vibes', authenticate,async(req,res)=>{
    try{
        const{vibeText}=req.body
        if (!vibeText) {
            return res.status(400).json({ message: 'vibeText is required' });
        }
        const newVibe = new Vibe({
            user: req.user._id,
            vibeText,
        });
        await newVibe.save();
        res.status(201).json(newVibe);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error creating vibe' });
    }
})

app.get('/api/v1/vibes', async (req, res) => {
  try {
    const vibes = await Vibe.find().populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json(vibes);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching vibes' });
  }
});