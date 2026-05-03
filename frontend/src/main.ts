import './style.css'

const ideaInput = document.getElementById('startup-idea') as HTMLInputElement;
const buildBtn = document.getElementById('build-btn') as HTMLButtonElement;
const agentSim = document.getElementById('agent-simulation') as HTMLElement;
const outputSection = document.getElementById('output-section') as HTMLElement;
const logsContainer = document.getElementById('logs') as HTMLElement;
const cardsContainer = document.getElementById('cards-container') as HTMLElement;

const BACKEND_URL = 'http://localhost:3000';

interface AgentLog {
    agent: string;
    message: string;
}

const agentLogs: AgentLog[] = [
    { agent: 'VALIDATOR', message: 'CHECKING_IDEA_VIABILITY...' },
    { agent: 'MARKET_ANALYST', message: 'ANALYZING_TRENDS_AND_COMPETITORS...' },
    { agent: 'UI_DESIGNER', message: 'ARCHITECTING_INTERFACE_SYSTEMS...' },
    { agent: 'SOFTWARE_DEV', message: 'GENERATING_CORE_LOGIC_LAYER...' },
    { agent: 'PITCH_CREATOR', message: 'SYNTHESIZING_STRATEGIC_NARRATIVE...' }
];

buildBtn?.addEventListener('click', async () => {
    const idea = ideaInput?.value.trim();
    if (!idea) return;

    // Reset UI
    buildBtn.disabled = true;
    outputSection?.classList.add('hidden');
    agentSim?.classList.remove('hidden');
    logsContainer.innerHTML = '';
    cardsContainer.innerHTML = '';

    // Step 1: Simulate Logs
    for (const log of agentLogs) {
        await addLog(log.agent, log.message);
        await sleep(600);
    }

    await addLog('SYSTEM', 'WAITING_FOR_GEMINI_API_RESPONSE...');

    // Step 2: Call API
    try {
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        await addLog('SYSTEM', 'DATA_STREAM_RECEIVED. INITIATING_RENDER...');
        await sleep(500);

        // Step 3: Parse and Display Results
        agentSim?.classList.add('hidden');
        outputSection?.classList.remove('hidden');
        displayResults(data.result);
        
    } catch (error: any) {
        await addLog('ERROR', error.message.toUpperCase());
        buildBtn.disabled = false;
    } finally {
        buildBtn.disabled = false;
    }
});

async function addLog(agent: string, message: string) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    div.innerHTML = `<span class="log-status">[${timestamp}]</span> <span class="log-agent">${agent}</span>: ${message}`;
    logsContainer?.appendChild(div);
    if (logsContainer) logsContainer.scrollTop = logsContainer.scrollHeight;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function displayResults(text: string) {
    const sections: Record<string, { title: string, icon: string }> = {
        VALIDATION: { title: 'VALIDATION_REPORT', icon: '[V]' },
        MARKET: { title: 'MARKET_ANALYSIS', icon: '[M]' },
        UI: { title: 'UI_SPECIFICATION', icon: '[U]' },
        CODE: { title: 'SOURCE_ARCHITECTURE', icon: '[C]' },
        PITCH: { title: 'EXECUTIVE_SUMMARY', icon: '[P]' }
    };

    const parts = text.split(/(VALIDATION|MARKET|UI|CODE|PITCH):/i);
    
    for (let i = 1; i < parts.length; i += 2) {
        const key = parts[i].toUpperCase().trim();
        const content = parts[i + 1].trim();
        
        if (sections[key]) {
            await createCard(sections[key], content);
            await sleep(300);
        }
    }
}

async function createCard(meta: { title: string, icon: string }, content: string) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <div class="card-header">
            <span>${meta.icon} ${meta.title}</span>
            <span>ID_${Math.floor(Math.random() * 10000)}</span>
        </div>
        <div class="card-content"></div>
    `;
    
    cardsContainer?.appendChild(card);
    const contentArea = card.querySelector('.card-content') as HTMLElement;
    
    await typeWriter(contentArea, content);
}

async function typeWriter(element: HTMLElement, text: string) {
    let i = 0;
    const speed = 5;
    
    let processedText = text;
    let hasCode = false;

    if (processedText.includes('```')) {
        hasCode = true;
        processedText = processedText.replace(/```(?:\w+)?([\s\S]*?)```/g, (_match, code) => {
            return `<code>${code.trim()}<button class="copy-btn" data-code="${btoa(code.trim())}">[ COPY ]</button></code>`;
        });
    }

    if (hasCode) {
        element.innerHTML = processedText;
        // Re-attach copy listeners
        element.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const code = atob(target.dataset.code || '');
                navigator.clipboard.writeText(code);
                const originalText = target.textContent;
                target.textContent = '[ COPIED ]';
                setTimeout(() => target.textContent = originalText, 2000);
            });
        });
    } else {
        return new Promise<void>(resolve => {
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }
}

// Initial system message
window.onload = () => {
    addLog('SYSTEM', 'KERNEL_LOADED_SUCCESSFULLY');
    addLog('SYSTEM', 'AWAITING_INPUT_SIGNAL...');
};
