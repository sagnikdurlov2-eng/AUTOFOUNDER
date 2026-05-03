const ideaInput = document.getElementById('startup-idea');
const buildBtn = document.getElementById('build-btn');
const agentSim = document.getElementById('agent-simulation');
const outputSection = document.getElementById('output-section');
const logsContainer = document.getElementById('logs');
const cardsContainer = document.getElementById('cards-container');

const agentLogs = [
    { agent: 'VALIDATOR', message: 'CHECKING_IDEA_VIABILITY...' },
    { agent: 'MARKET_ANALYST', message: 'ANALYZING_TRENDS_AND_COMPETITORS...' },
    { agent: 'UI_DESIGNER', message: 'ARCHITECTING_INTERFACE_SYSTEMS...' },
    { agent: 'SOFTWARE_DEV', message: 'GENERATING_CORE_LOGIC_LAYER...' },
    { agent: 'PITCH_CREATOR', message: 'SYNTHESIZING_STRATEGIC_NARRATIVE...' }
];

buildBtn.addEventListener('click', async () => {
    const idea = ideaInput.value.trim();
    if (!idea) return;

    // Reset UI
    buildBtn.disabled = true;
    outputSection.classList.add('hidden');
    agentSim.classList.remove('hidden');
    logsContainer.innerHTML = '';
    cardsContainer.innerHTML = '';

    // Step 1: Simulate Logs (Terminal Style)
    for (const log of agentLogs) {
        await addLog(log.agent, log.message);
        await sleep(600);
    }

    await addLog('SYSTEM', 'WAITING_FOR_GEMINI_API_RESPONSE...');

    // Step 2: Call API
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        await addLog('SYSTEM', 'DATA_STREAM_RECEIVED. INITIATING_RENDER...');
        await sleep(500);

        // Step 3: Parse and Display Results
        agentSim.classList.add('hidden');
        outputSection.classList.remove('hidden');
        displayResults(data.result);
        
    } catch (error) {
        await addLog('ERROR', error.message.toUpperCase());
        buildBtn.disabled = false;
    } finally {
        buildBtn.disabled = false;
    }
});

async function addLog(agent, message) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    div.innerHTML = `<span class="log-status">[${timestamp}]</span> <span class="log-agent">${agent}</span>: ${message}`;
    logsContainer.appendChild(div);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function displayResults(text) {
    const sections = {
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
            await sleep(300); // Stagger card appearance
        }
    }
}

async function createCard(meta, content) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <div class="card-header">
            <span>${meta.icon} ${meta.title}</span>
            <span>ID_${Math.floor(Math.random() * 10000)}</span>
        </div>
        <div class="card-content" id="card-${meta.title}"></div>
    `;
    
    cardsContainer.appendChild(card);
    const contentArea = card.querySelector('.card-content');
    
    // Typewriter effect
    await typeWriter(contentArea, content);
}

async function typeWriter(element, text) {
    let i = 0;
    const speed = 5; // ms per character
    
    // Check if it's the code section to handle formatting
    const isCode = text.includes('```') || text.length > 500; 

    // Simple markdown code block detection and handling
    let processedText = text;
    let hasCode = false;

    if (processedText.includes('```')) {
        hasCode = true;
        processedText = processedText.replace(/```(?:\w+)?([\s\S]*?)```/g, (match, code) => {
            return `<code id="code-block-${Math.random().toString(36).substr(2, 9)}">${code.trim()}<button class="copy-btn" onclick="copyCode(this)">[ COPY ]</button></code>`;
        });
    }

    // Since we are adding HTML, we can't do a simple char-by-char if we want formatting.
    // For this brutalist style, we'll just inject it and maybe animate the opacity or something,
    // OR we do a hybrid approach. Let's do char-by-char for the plain text version.
    
    if (hasCode) {
        element.innerHTML = processedText;
    } else {
        return new Promise(resolve => {
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

window.copyCode = (btn) => {
    const code = btn.parentElement.innerText.replace('[ COPY ]', '').trim();
    navigator.clipboard.writeText(code);
    btn.textContent = '[ COPIED ]';
    setTimeout(() => btn.textContent = '[ COPY ]', 2000);
};

// Initial system message
window.onload = () => {
    addLog('SYSTEM', 'KERNEL_LOADED_SUCCESSFULLY');
    addLog('SYSTEM', 'AWAITING_INPUT_SIGNAL...');
};
