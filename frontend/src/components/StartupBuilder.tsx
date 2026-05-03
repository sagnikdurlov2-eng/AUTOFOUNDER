"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Search, 
  ShieldCheck, 
  BarChart3, 
  Layout, 
  Code2, 
  Presentation,
  CheckCircle2,
  Copy,
  AlertCircle,
  Loader2
} from "lucide-react";

type AgentLog = {
  id: string;
  agent: string;
  message: string;
  status: 'pending' | 'loading' | 'completed';
};

const AGENTS = [
  { id: 'validator', name: 'Validator Agent', icon: ShieldCheck, message: 'Checking idea viability...' },
  { id: 'market', name: 'Market Agent', icon: BarChart3, message: 'Analyzing market trends...' },
  { id: 'ui', name: 'UI Agent', icon: Layout, message: 'Designing user interface...' },
  { id: 'dev', name: 'Dev Agent', icon: Code2, message: 'Generating core codebase...' },
  { id: 'pitch', name: 'Pitch Agent', icon: Presentation, message: 'Preparing investor pitch...' },
];

export default function StartupBuilder() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [results, setResults] = useState<{ [key: string]: string } | null>(null);
  const [error, setError] = useState("");

  const runSimulation = async () => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setResults(null);
    setError("");
    
    // Initialize logs
    const initialLogs: AgentLog[] = AGENTS.map(a => ({
      id: a.id,
      agent: a.name,
      message: a.message,
      status: 'pending'
    }));
    setLogs(initialLogs);

    try {
      // Simulate agent thinking with delays
      for (let i = 0; i < AGENTS.length; i++) {
        setLogs(prev => prev.map((l, idx) => 
          idx === i ? { ...l, status: 'loading' } : l
        ));
        
        // Random delay for simulation effect
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        setLogs(prev => prev.map((l, idx) => 
          idx === i ? { ...l, status: 'completed' } : l
        ));
      }

      // Call Backend API
      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) throw new Error('Failed to generate startup plan');

      const data = await response.text();
      const parsedResults = parseResponse(data);
      setResults(parsedResults);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseResponse = (text: string) => {
    const sections = ['VALIDATION', 'MARKET', 'UI', 'CODE', 'PITCH'];
    const result: { [key: string]: string } = {};
    
    let currentSection = "";
    const lines = text.split('\n');

    lines.forEach(line => {
      const foundSection = sections.find(s => line.startsWith(`${s}:`));
      if (foundSection) {
        currentSection = foundSection;
        result[currentSection] = "";
      } else if (currentSection) {
        result[currentSection] += line + "\n";
      }
    });

    return result;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12 selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              <span>Next Gen Startup Builder</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              AI <span className="neon-text">Startup Builder</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transform your raw ideas into fully documented startup concepts with our 
              multi-agent AI workforce. Validated, analyzed, and ready to build.
            </p>
          </motion.div>
        </header>

        {/* Input Section */}
        <section className="relative z-10">
          <motion.div 
            className="glass rounded-2xl p-2 flex flex-col md:flex-row gap-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input 
              type="text" 
              placeholder="e.g. A marketplace for recycled rocket parts..."
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg focus:ring-0"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && runSimulation()}
            />
            <button 
              onClick={runSimulation}
              disabled={isLoading || !idea.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Build Startup</span>
                </>
              )}
            </button>
          </motion.div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulation Logs */}
        {(isLoading || logs.length > 0) && !results && (
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-1">Active Agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {logs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl glass border-l-4 transition-all duration-500 ${
                    log.status === 'completed' ? 'border-l-green-500 opacity-60' : 
                    log.status === 'loading' ? 'border-l-blue-500' : 'border-l-slate-700 opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {log.status === 'loading' ? (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : log.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600" />
                    )}
                    <span className="font-bold text-xs">{log.agent}</span>
                  </div>
                  <p className="text-xs text-slate-400">{log.message}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Results Section */}
        {results && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Validation Card */}
            <ResultCard 
              title="AI Validator" 
              icon={ShieldCheck} 
              content={results.VALIDATION} 
              color="blue"
            />
            
            {/* Market Card */}
            <ResultCard 
              title="Market Intelligence" 
              icon={BarChart3} 
              content={results.MARKET} 
              color="purple"
            />

            {/* UI Concept Card */}
            <ResultCard 
              title="UI Concept" 
              icon={Layout} 
              content={results.UI} 
              color="pink"
            />

            {/* Pitch Card */}
            <ResultCard 
              title="Investor Pitch" 
              icon={Presentation} 
              content={results.PITCH} 
              color="orange"
            />

            {/* Code Card - Full Width */}
            <div className="md:col-span-2">
              <ResultCard 
                title="Generated Code" 
                icon={Code2} 
                content={results.CODE} 
                color="green"
                isCode
                onCopy={() => copyToClipboard(results.CODE)}
              />
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}

function ResultCard({ title, icon: Icon, content, color, isCode = false, onCopy }: any) {
  const colorMap: any = {
    blue: "text-blue-400 border-blue-500/20",
    purple: "text-purple-400 border-purple-500/20",
    pink: "text-pink-400 border-pink-500/20",
    orange: "text-orange-400 border-orange-500/20",
    green: "text-green-400 border-green-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 flex flex-col h-full border-t-2 border-t-transparent hover:border-t-blue-500/50 transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-800 ${colorMap[color].split(' ')[0]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        {isCode && (
          <button 
            onClick={onCopy}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCode ? (
        <div className="relative group">
          <pre className="bg-[#0b1121] p-4 rounded-xl text-sm font-mono text-blue-300 overflow-x-auto border border-white/5 leading-relaxed">
            <code>{content.trim()}</code>
          </pre>
        </div>
      ) : (
        <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
          {content.trim()}
        </div>
      )}
    </motion.div>
  );
}
