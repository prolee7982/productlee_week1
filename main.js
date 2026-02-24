class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const number = this.getAttribute('number');
        const ball = document.createElement('div');
        ball.textContent = number;
        const style = document.createElement('style');
        style.textContent = `
            div {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--primary-color, #f39c12);
                color: var(--background-color, #2c3e50);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 -3px 5px rgba(0, 0, 0, 0.3);
                transition: transform 0.3s ease-in-out, background-color 0.3s, color 0.3s;
            }
            div:hover {
                transform: scale(1.1);
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(ball);
    }
}

customElements.define('lotto-ball', LottoBall);

// DOM Elements
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateButton = document.getElementById('generate-button');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

function toggleTheme() {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeIcon.textContent = isLight ? '☀️' : '🌙';
}

// Lotto Logic
function generateNumbers() {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
}

// Event Listeners
generateButton.addEventListener('click', generateNumbers);
themeToggle.addEventListener('click', toggleTheme);

// Initialize
initTheme();
generateNumbers();
