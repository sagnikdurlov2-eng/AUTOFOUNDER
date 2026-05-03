const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-startup-builder';
mongoose.connect(MONGO_URI)
  .then(() => console.log('\x1b[32m[SYSTEM] NEURAL_DB_CONNECTED\x1b[0m'))
  .catch(err => console.error('\x1b[31m[ERROR] DB_SYNC_FAILURE\x1b[0m', err));

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

// Gemini SDK Setup
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// Neural Generation Logic with Fallbacks
async function generateWithFallback(prompt) {
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`\x1b[33m[UPLINK] Attempting connection: ${modelName}...\x1b[0m`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`\x1b[32m[SUCCESS] Neural link established via ${modelName}\x1b[0m`);
      return text;
    } catch (error) {
      lastError = error;
      console.log(`\x1b[31m[FAIL] ${modelName} unavailable. Trying next...\x1b[0m`);
    }
  }
  throw lastError;
}

app.post('/api/generate', async (req, res) => {
  const { idea } = req.body;

  console.log(`\n\x1b[35m[INCOMING_SIGNAL] Idea: ${idea}\x1b[0m`);

  if (!idea) {
    return res.status(400).json({ error: 'NEURAL_ERROR: EMPTY_INPUT' });
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
    const responseText = await generateWithFallback(prompt);
    console.log(`\x1b[32m[DOWNLINK] Processing neural response...\x1b[0m`);

    // Save to MongoDB
    try {
      await Startup.create({ idea, result: responseText });
    } catch (saveError) {
      console.error('\x1b[31m[ERROR] DATA_VAULT_WRITE_FAILURE\x1b[0m');
    }

    res.send(responseText);
  } catch (error) {
    console.log(`\x1b[41m\x1b[37m[NEURAL_CRASH] CRITICAL_FAILURE:\x1b[0m`);
    console.error('\x1b[31mMessage:\x1b[0m', error.message);
    res.status(500).json({ 
      error: 'NEURAL_LINK_DROPPED',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n\x1b[32m========================================`);
  console.log(`   AI STARTUP BUILDER - SELF-HEALING CORE `);
  console.log(`   PORT: ${PORT} | STATUS: ACTIVE         `);
  console.log(`========================================\x1b[0m\n`);
});
