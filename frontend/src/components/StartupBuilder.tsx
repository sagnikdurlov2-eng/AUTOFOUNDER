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
      for (let i = 0; i < AGENTS.length; i++) {
        setLogs(prev => prev.map((l, idx) => 
          idx === i ? { ...l, status: 'loading' } : l
        ));
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
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

        {/* Simulation Logs */}
        {(isLoading || logs.length > 0) && !results && (
          <section className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-[#2a2a3a]"></div>
              <h3 className="text-xs font-accent text-[#6b7280] uppercase tracking-[0.4em]">Active_Subprocesses</h3>
              <div className="h-[1px] flex-1 bg-[#2a2a3a]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {logs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 bg-[#12121a] border border-[#2a2a3a] cyber-chamfer-sm transition-all duration-500 ${
                    log.status === 'completed' ? 'border-[#00ff88]/40 bg-[#00ff88]/5' : 
                    log.status === 'loading' ? 'border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'opacity-40'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-accent text-[10px] text-[#6b7280]">{log.agent}</span>
                      {log.status === 'loading' && <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></div>}
                    </div>
                    <p className={`text-[10px] leading-tight ${log.status === 'completed' ? 'text-[#00ff88]' : 'text-[#e0e0e0]'}`}>
                      {log.message}
                    </p>
                  </div>
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
