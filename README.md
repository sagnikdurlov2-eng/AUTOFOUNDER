# AI Startup Builder (MERN Stack)

A full-stack application that transforms startup ideas into structured concepts using Gemini AI and a simulated multi-agent system.

## Tech Stack
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **AI**: Google Gemini API

## Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a remote URI)
- Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=mongodb://localhost:27017/ai-startup-builder
```
Start the backend:
```bash
node index.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

## How to Use
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Enter your startup idea in the input box.
3. Watch the multi-agent simulation (Validator, Market, UI, Dev, Pitch).
4. View the generated results and copy the code if needed.

## Project Structure
- `/frontend`: Next.js application with Tailwind CSS and Framer Motion.
- `/backend`: Express server with Gemini API integration and MongoDB storage.
