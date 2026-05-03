const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
    const { idea } = req.body;

    if (!idea) {
        return res.status(400).json({ error: 'Startup idea is required' });
    }

    try {
        const prompt = `You are a team of AI startup experts:
- Idea Validator
- Market Analyst
- UI Designer
- Software Developer
- Pitch Creator

User idea: ${idea}

Respond in this exact format:

VALIDATION:
[Validation details here]

MARKET:
[Market analysis here]

UI:
[UI design suggestions here]

CODE:
[Sample code or architecture here]

PITCH:
[Elevator pitch here]

Keep answers concise but useful. Use markdown formatting within sections if needed.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ result: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to generate startup plan. Check if your API key is correct.' });
    }
});

app.listen(port, () => {
    console.log(`Auto-Founder AI server running at http://localhost:${port}`);
});
