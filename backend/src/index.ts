import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;
const model = apiKey
    ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
    : null;

app.use(cors());
app.use(express.json());

interface GenerateRequest {
    idea: string;
};

const buildPrompt = (idea: string) => `You are a team of AI startup experts working together:

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

const fallbackResponse = (idea: string) => `VALIDATION:
${idea} has demo-worthy potential if it solves one painful workflow for a clearly named buyer.
The first version should prove speed, trust, and output quality before adding integrations.
Risk: broad positioning. Win by narrowing the first customer segment and showing immediate ROI.

MARKET:
Target time-starved founders, student builders, and small agencies who need fast validation assets.
Competes with generic AI chat, pitch tools, and no-code generators; differentiation is guided execution.
Pricing can start as freemium with paid export packs, team workspaces, and launch templates.

UI:
Use a command-center interface: idea input, live specialist logs, and five crisp output cards.
Show momentum with progressive reveal, status lights, and copy-ready artifacts.
Keep the visual language premium, dark, and operational instead of looking like a generic chatbot.

CODE:
Frontend: Vite/TypeScript app posts one request to /api/generate and parses header sections.
Backend: Express receives the idea, builds a single expert-team prompt, calls Gemini, returns text.
Next build step: add saved projects, PDF export, and shareable public startup briefs.

PITCH:
AI Startup Builder turns a raw idea into a structured startup brief in seconds.
Instead of chatting endlessly, founders get validation, market insight, UI direction, code scaffolding, and a pitch.
It feels like a specialized founding team compressed into one launch console.`;

const generateStartup = async (req: Request<{}, {}, GenerateRequest>, res: Response) => {
    const { idea } = req.body;

    if (!idea?.trim()) {
        return res.status(400).json({ error: 'Startup idea is required' });
    }

    if (!model) {
        return res.json({
            result: fallbackResponse(idea.trim()),
            mode: 'demo',
            warning: 'GEMINI_API_KEY is not set, so a demo response was returned.'
        });
    }

    try {
        const result = await model.generateContent(buildPrompt(idea.trim()));
        const response = await result.response;
        const text = response.text();

        res.json({ result: text });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to generate startup plan. Check if your API key is correct.' });
    }
};

app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, ai: model ? 'gemini' : 'demo' });
});

app.post('/api/generate', generateStartup);
app.post('/generate', generateStartup);

app.listen(port, () => {
    console.log(`[SERVER]: Auto-Founder AI backend running at http://localhost:${port}`);
});
