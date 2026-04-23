let display = document.getElementById('display');
let history = document.getElementById('history');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let calculationHistory = [];

// Append number to display
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (operator !== null && currentInput !== '') {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

// Clear display
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete last digit
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Toggle sign (positive/negative)
function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
            ? currentInput.slice(1) 
            : '-' + currentInput;
    }
    updateDisplay();
}

// Calculate result
function calculate() {
    if (operator === null || previousInput === '' || currentInput === '') {
        return;
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 'Error';
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Format result to avoid floating point errors
    if (typeof result === 'number') {
        result = Math.round(result * 100000000) / 100000000;
    }

    // Add to history
    const calculation = `${prev} ${operator} ${current} = ${result}`;
    calculationHistory.unshift(calculation);
    addToHistory(calculation);

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Scientific functions
function squareRoot() {
    const num = parseFloat(currentInput);
    if (num < 0) {
        currentInput = 'Error';
    } else {
        const result = Math.sqrt(num);
        currentInput = Math.round(result * 100000000) / 100000000;
    }
    shouldResetDisplay = true;
    updateDisplay();
}

function square() {
    const num = parseFloat(currentInput);
    currentInput = (num * num).toString();
    shouldResetDisplay = true;
    updateDisplay();
}

function reciprocal() {
    const num = parseFloat(currentInput);
    if (num === 0) {
        currentInput = 'Error';
    } else {
        const result = 1 / num;
        currentInput = Math.round(result * 100000000) / 100000000;
    }
    shouldResetDisplay = true;
    updateDisplay();
}

function factorial() {
    const num = Math.floor(parseFloat(currentInput));
    if (num < 0) {
        currentInput = 'Error';
    } else if (num === 0 || num === 1) {
        currentInput = '1';
    } else {
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        currentInput = result.toString();
    }
    shouldResetDisplay = true;
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.value = currentInput;
}

// Add to history
function addToHistory(calculation) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.textContent = calculation;
    
    // Click to copy
    historyItem.style.cursor = 'pointer';
    historyItem.addEventListener('click', () => {
        const result = calculation.split(' = ')[1];
        currentInput = result;
        shouldResetDisplay = true;
        updateDisplay();
    });

    history.insertBefore(historyItem, history.firstChild);

    // Keep only last 10 items
    while (history.children.length > 10) {
        history.removeChild(history.lastChild);
    }
}

// Clear history
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    history.innerHTML = '';
    calculationHistory = [];
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+' || e.key === '-') appendOperator(e.key);
    if (e.key === '*') appendOperator('*');
    if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    }
    if (e.key === 'Escape') {
        clearDisplay();
    }
});

// Initialize
updateDisplay();
