const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-startup-builder';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const StartupSchema = new mongoose.Schema({
  idea: String,
  result: String,
  createdAt: { type: Date, default: Date.now }
});
const Startup = mongoose.model('Startup', StartupSchema);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.post('/api/generate', async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  const prompt = `You are a team of AI startup experts working together:

1. Idea Validator
2. Market Analyst
3. UI/UX Designer
4. Software Developer
5. Pitch Strategist

User idea: ${idea}

Instructions:
* Keep each section concise (max 4-5 lines)
* Be practical, not generic
* Make output sound like real startup thinking

Respond EXACTLY in this format:

VALIDATION:
...

MARKET:
...

UI:
...

CODE:
...

PITCH:
...`;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const result = response.data.candidates[0].content.parts[0].text;
    
    // Save to MongoDB
    try {
      await Startup.create({ idea, result });
    } catch (saveError) {
      console.error('Failed to save to MongoDB:', saveError.message);
    }

    res.send(result);
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to generate startup concept',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
