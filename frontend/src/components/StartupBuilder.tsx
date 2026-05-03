"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  ShieldCheck, 
  BarChart3, 
  Layout, 
  Code2, 
  Presentation,
  CheckCircle2,
  Copy,
  AlertCircle,
  Loader2,
  Terminal as TerminalIcon,
  Cpu,
  Globe,
  Zap
} from "lucide-react";

type AgentLog = {
  id: string;
  agent: string;
  message: string;
  status: 'pending' | 'loading' | 'completed';
};

const AGENTS = [
  { id: 'validator', name: 'SYSTEM_VALIDATOR', icon: ShieldCheck, message: 'VERIFYING IDEA VIABILITY...' },
  { id: 'market', name: 'MARKET_ANALYZER', icon: BarChart3, message: 'SCANNING SECTOR TRENDS...' },
  { id: 'ui', name: 'INTERFACE_ARCHITECT', icon: Layout, message: 'MAPPING NEURAL UX...' },
  { id: 'dev', name: 'CORE_DEVELOPER', icon: Code2, message: 'COMPILING SOURCE CODE...' },
  { id: 'pitch', name: 'STRATEGIC_PITCHER', icon: Presentation, message: 'GENERATING PITCH DECK...' },
];

export default function StartupBuilder() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [results, setResults] = useState<{ [key: string]: string } | null>(null);
  const [error, setError] = useState("");
  const [typedSubheading, setTypedSubheading] = useState("");
  
  const fullSubheading = "CONVERTING RAW CONCEPTS INTO NEURAL STARTUP ARCHITECTURES_";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedSubheading(fullSubheading.slice(0, i));
      i++;
      if (i > fullSubheading.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const runSimulation = async () => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setResults(null);
    setError("");
    
    setLogs(AGENTS.map(a => ({
      id: a.id,
      agent: a.name,
      message: a.message,
      status: 'pending'
    })));

    try {
      const logMessages = [
        "[SYSTEM] Initializing neural link...",
        "[VALIDATOR] Checking market viability...",
        "[VALIDATOR] Running risk assessment...",
        "[MARKET] Scraping competitor data...",
        "[MARKET] Analyzing target demographics...",
        "[UI] Drafting wireframes...",
        "[UI] Selecting color palette (Neon Green/Black)...",
        "[DEV] Initializing Git repository...",
        "[DEV] Writing core business logic...",
        "[PITCH] Crafting elevator pitch...",
        "[SYSTEM] Compiling final report..."
      ];

      for (let i = 0; i < AGENTS.length; i++) {
        setLogs(prev => prev.map((l, idx) => 
          idx === i ? { ...l, status: 'loading' } : l
        ));
        
        // Show sub-logs for each agent
        for (let j = 0; j < 2; j++) {
          const msgIdx = i * 2 + j;
          if (logMessages[msgIdx]) {
             setLogs(prev => prev.map((l, idx) => 
               idx === i ? { ...l, message: logMessages[msgIdx] } : l
             ));
          }
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        setLogs(prev => prev.map((l, idx) => 
          idx === i ? { ...l, status: 'completed' } : l
        ));
      }

      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) throw new Error('CONNECTION_FAILURE: NEURAL_LINK_DROPPED');

      const data = await response.text();
      setResults(parseResponse(data));
    } catch (err: any) {
      setError(err.message || "SYSTEM_ERROR: UNKNOWN_EXCEPTION");
    } finally {
      setIsLoading(false);
    }
  };

  const parseResponse = (text: string) => {
    const sections = ['VALIDATION', 'MARKET', 'UI', 'CODE', 'PITCH'];
    const result: { [key: string]: string } = {};
    let currentSection = "";
    text.split('\n').forEach(line => {
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
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] bg-circuit text-[#e0e0e0] font-body selection:bg-[#00ff88]/30">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16">
        
        {/* Hero Section */}
        <header className="text-center space-y-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] text-xs font-accent tracking-[0.3em] uppercase mb-6 cyber-chamfer-sm">
              <Cpu className="w-4 h-4" />
              <span>NEURAL_GRID_ACTIVE</span>
            </div>
            
            <h1 
              className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter mb-4 glitch-effect"
              data-text="AI_STARTUP_BUILDER"
            >
              AI_STARTUP_BUILDER
            </h1>
            
            <div className="h-6 flex justify-center items-center">
              <p className="text-sm md:text-base text-[#00ff88] font-accent tracking-widest uppercase">
                {typedSubheading}
                <span className="inline-block w-2 h-4 bg-[#00ff88] ml-1 animate-blink"></span>
              </p>
            </div>
          </motion.div>
        </header>

        {/* Input Section */}
        <section className="max-w-3xl mx-auto">
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] opacity-20 blur group-focus-within:opacity-40 transition-opacity cyber-chamfer"></div>
            <div className="relative bg-[#12121a] cyber-chamfer p-1 flex items-center border border-[#2a2a3a]">
              <span className="pl-6 text-[#00ff88] font-accent text-xl">{'>'}</span>
              <input 
                type="text" 
                placeholder="ENTER_STARTUP_CONCEPT_HERE..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-5 text-lg font-accent tracking-wider text-[#00ff88] placeholder:text-[#2a2a3a] focus:ring-0"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && runSimulation()}
              />
              <button 
                onClick={runSimulation}
                disabled={isLoading || !idea.trim()}
                className="bg-[#00ff88] hover:brightness-110 disabled:grayscale text-[#0a0a0f] px-10 py-5 font-heading font-bold uppercase tracking-widest cyber-chamfer-sm transition-all flex items-center gap-3 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                <span>INITIALIZE</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 font-accent text-sm cyber-chamfer-sm flex items-center gap-3 max-w-xl mx-auto"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neural Link Console */}
        {(isLoading || logs.length > 0) && !results && (
          <section className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-accent text-[#00ff88] uppercase tracking-[0.4em] flex items-center gap-2">
                <TerminalIcon className="w-3 h-3" />
                NEURAL_LINK_CONSOLE_V2.0
              </h3>
              <span className="text-[10px] font-accent text-[#2a2a3a]">ENCRYPTION: AES-256</span>
            </div>
            
            <div className="bg-[#0a0a0f] border border-[#00ff88]/20 cyber-chamfer p-6 font-accent text-[11px] leading-relaxed relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent animate-scanline"></div>
              
              <div className="space-y-2 h-[200px] overflow-y-auto custom-scrollbar">
                {logs.filter(l => l.status !== 'pending').map((log, i) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <span className="text-[#2a2a3a]">[{new Date().toLocaleTimeString()}]</span>
                    <span className={log.status === 'completed' ? 'text-[#00ff88]' : 'text-[#00d4ff]'}>
                      {log.agent}
                    </span>
                    <span className="text-[#e0e0e0] flex-1">{log.message}</span>
                    {log.status === 'loading' && <span className="animate-blink">_</span>}
                  </motion.div>
                ))}
                
                {isLoading && logs.every(l => l.status === 'completed') && (
                  <div className="text-[#ff00ff] animate-pulse">
                    [SYSTEM] FINALIZING_NEURAL_CONSTRUCT...
                  </div>
                )}
              </div>

              {/* Decorative HUD corners */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00ff88]/40"></div>
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00ff88]/40"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#00ff88]/40"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#00ff88]/40"></div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {results && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <ResultCard 
              title="SYSTEM_VALIDATION" 
              icon={ShieldCheck} 
              content={results.VALIDATION} 
              accent="green"
            />
            <ResultCard 
              title="MARKET_INTELLIGENCE" 
              icon={BarChart3} 
              content={results.MARKET} 
              accent="cyan"
            />
            <ResultCard 
              title="INTERFACE_CONCEPT" 
              icon={Layout} 
              content={results.UI} 
              accent="magenta"
            />
            <ResultCard 
              title="INVESTOR_PITCH" 
              icon={Presentation} 
              content={results.PITCH} 
              accent="green"
            />
            <div className="md:col-span-2">
              <ResultCard 
                title="SOURCE_CODE_GEN" 
                icon={Code2} 
                content={results.CODE} 
                accent="cyan"
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

function ResultCard({ title, icon: Icon, content, accent, isCode = false, onCopy }: any) {
  const accentColors: any = {
    green: "text-[#00ff88] border-[#00ff88]/30 hover:border-[#00ff88]",
    magenta: "text-[#ff00ff] border-[#ff00ff]/30 hover:border-[#ff00ff]",
    cyan: "text-[#00d4ff] border-[#00d4ff]/30 hover:border-[#00d4ff]",
  };

  const glows: any = {
    green: "shadow-[0_0_15px_rgba(0,255,136,0.1)]",
    magenta: "shadow-[0_0_15px_rgba(255,0,255,0.1)]",
    cyan: "shadow-[0_0_15px_rgba(0,212,255,0.1)]",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#12121a] cyber-chamfer p-8 flex flex-col h-full border ${accentColors[accent]} transition-all duration-500 group ${glows[accent]}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 bg-[#0a0a0f] border ${accentColors[accent]} cyber-chamfer-sm`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm tracking-[0.2em] uppercase">{title}</h3>
        </div>
        {isCode && (
          <button 
            onClick={onCopy}
            className="p-2 hover:bg-[#00ff88]/10 rounded-lg transition-colors text-[#6b7280] hover:text-[#00ff88]"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCode ? (
        <div className="relative">
          <div className="absolute top-0 right-0 p-2 text-[10px] font-accent text-[#2a2a3a] uppercase">TS_STRICT</div>
          <pre className="bg-[#0a0a0f] p-6 text-xs font-body text-[#00d4ff] overflow-x-auto border border-[#2a2a3a] leading-relaxed cyber-chamfer-sm">
            <code>{content.trim()}</code>
          </pre>
        </div>
      ) : (
        <div className="text-[#e0e0e0]/80 text-sm font-body leading-relaxed whitespace-pre-wrap relative pl-4 border-l-2 border-[#2a2a3a]">
          <span className="absolute top-0 left-[-2px] w-0.5 h-4 bg-[#00ff88]"></span>
          {content.trim()}
        </div>
      )}
      
      <div className="mt-8 flex justify-end">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-[#2a2a3a]"></div>
          <div className="w-4 h-1 bg-[#2a2a3a]"></div>
          <div className="w-8 h-1 bg-[#00ff88]/20 group-hover:bg-[#00ff88] transition-colors"></div>
        </div>
      </div>
    </motion.div>
  );
}
