import express from 'express';
import { z } from 'zod';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Validation Schemas
const usersschema = z.object({
  username: z.string().min(6, { message: "Username must be atleast 6 character long" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be atleast 8 characters" }).max(12, { message: "Password must be less than 12 characters" })
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be atleast 8 characters" }).max(12, { message: "Password must be less than 12 characters" })
});

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const parsed = usersschema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { username, email, password } = parsed.data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected server error' });
  }
});

export default router;
