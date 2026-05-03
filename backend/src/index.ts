import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

app.use(cors());
app.use(express.json());

interface GenerateRequest {
    idea: string;
}

app.post('/generate', async (req: Request<{}, {}, GenerateRequest>, res: Response) => {
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
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to generate startup plan. Check if your API key is correct.' });
    }
});

app.listen(port, () => {
    console.log(`[SERVER]: Auto-Founder AI backend running at http://localhost:${port}`);
});
