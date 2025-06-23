
import express from 'express';
import Vibe from '../models/Vibes.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();


router.post('/', authenticate, async (req, res) => {
  try {
    const { vibeText } = req.body;
    if (!vibeText) {
      return res.status(400).json({ message: 'vibeText is required' });
    }

    const newVibe = new Vibe({
      user: req.user._id,
      vibeText,
    });

    await newVibe.save();
    res.status(201).json(newVibe);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating vibe' });
  }
});


router.get('/', async (req, res) => {
  try {
    const vibes = await Vibe.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(vibes);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching vibes' });
  }
});

export default router;
