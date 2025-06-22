import {z} from 'zod'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import express from 'express'
const app=express()
app.use(express.json())
const JWT_SECRET =  process.env.JWT_SECRET;
dotenv.config()
connectDB()

const usersschema=z.object({
    username:z.string().min(6,{message:"Username must be atleast 6 character long"}),
    email:z.string().email(),
    password:z.string().min(8,{message:"password must be atleast 8 character long"}).max(12,{message:"password must be less than 12 characters "})
})
const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8,{message:"password must be atleast 8 character long"}).max(12,{message:"password must be less than 12 characters "})
})

app.post('/api/v1/auth/signup',async (req,res)=>{
    try{
        const parsed=usersschema.safeParse(req.body)
        const username=parsed.data.username
        const email=parsed.data.email
        const password=parsed.data.password
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.errors });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'An unexpected server error' });
    }
})

app.post('/api/v1/auth/login',async (req,res)=>{
    try{
        const parsed=loginSchema.safeParse(req.body)
        const email=req.body.email
        const password=req.body.password
        const user=await User.findOne({email})
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
        );

        return res.status(200).json({ token });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'An unexpected server error' });
    }
})