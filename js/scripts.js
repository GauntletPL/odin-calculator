let state;

const BTN_TYPES = {
    TOTAL: 'TOTAL',
    OPERATION: 'OPERATION',
    NUMBER: 'NUMBER'
};

const MAX_FRACTION = 16;

const operations = ['+', '-', '*', '/'];

const operationsDiv = document.querySelector('#operations');
for (const operation of operations) {
    const operationButton = createCalcButton(operation);
    operationButton.addEventListener('click', handleOperationButtonClick);
    operationsDiv.appendChild(operationButton);
}

const clearButton = createCalcButton('C');
clearButton.id = 'clear-btn';
clearButton.addEventListener('click', handleClearButtonClick);
operationsDiv.appendChild(clearButton);

const numbersDiv = document.querySelector('#numbers');

const dotButton = createCalcButton('.');
dotButton.id = 'dot-btn';
dotButton.addEventListener('click', handleDotButtonClick);
numbersDiv.appendChild(dotButton);

const totalButton = createCalcButton('=');
totalButton.id = 'total-btn';
totalButton.addEventListener('click', handleTotalButtonClick);
numbersDiv.appendChild(totalButton);

for (let i = 0; i < 10; i++) {
    const numButton = createCalcButton(i);
    numButton.id = `calc-button-${i}`;
    numButton.addEventListener('click', handleNumberButtonClick);
    numbersDiv.appendChild(numButton);
}

resetState();
updateDisplay();

// FUNCTIONS

function createCalcButton(value) {
    const calcButton = document.createElement('button');
    calcButton.classList.add('calc-button');
    calcButton.textContent = value;
    calcButton.type = 'button';
    calcButton.value = value;
    return calcButton;
}

function handleOperationButtonClick(ev) {
    if (state.lastClicked === BTN_TYPES.TOTAL ||
        (state.lastClicked === BTN_TYPES.NUMBER && !state.operator)
    ) {
        state.term1 = state.display;
    } else if (state.lastClicked === BTN_TYPES.OPERATION) {
        // just change the operator
    } else if (state.operator) {
        state.term2 = state.display;
        const result = Calculator.operate(state.term1, state.operator, state.term2);
        state.term1 = result;
        state.display = state.term1;
        updateDisplay();
    }
    state.operator = ev.target.value;
    state.fractions = 0;

    state.lastClicked = BTN_TYPES.OPERATION;
}

function handleClearButtonClick(ev) {
    resetState();
    updateDisplay();
}

function handleNumberButtonClick(ev) {
    if (state.lastClicked === BTN_TYPES.TOTAL) state.operator = '';
    if (state.lastClicked !== BTN_TYPES.NUMBER) state.display = 0;
    
    if (state.fractions) {
        if (state.fractions <= MAX_FRACTION) {
            let stringDisplay = state.display.toFixed(state.fractions).slice(0, -1);
            state.display = Number(stringDisplay + ev.target.value);
        }
    }
    else state.display = state.display * 10 + +ev.target.value;
    
    updateDisplay();

    if (state.fractions && state.fractions <= MAX_FRACTION) state.fractions++;

    state.lastClicked = BTN_TYPES.NUMBER;
}

function handleDotButtonClick(ev) {
    if (state.lastClicked === BTN_TYPES.TOTAL) state.operator = '';
    if (state.lastClicked !== BTN_TYPES.NUMBER) state.display = 0;
    
    if (!state.fractions) state.fractions = 1;
    
    updateDisplay();

    state.lastClicked = BTN_TYPES.NUMBER;
}

function handleTotalButtonClick(ev) {
    if (state.lastClicked === BTN_TYPES.NUMBER) {
        state.term2 = state.display;
        state.fractions = 0;
    } else if (state.lastClicked === BTN_TYPES.OPERATION) {
        state.term2 = state.term1;
    }
    const result = Calculator.operate(state.term1, state.operator, state.term2);
    state.term1 = result;
    state.display = state.term1;
    updateDisplay();
    
    state.lastClicked = BTN_TYPES.TOTAL;
}

function updateDisplay() {
    let toDisplay = state.display;
    if (state.fractions) {
        toDisplay = state.display.toFixed(Math.min(state.fractions, MAX_FRACTION));
    }
    document.querySelector('#display').textContent = toDisplay;
}

function resetState(newState) {
    state = {
        term1: 0,
        term2: 0,
        operator: '',
        display: 0,
        lastClicked: '',
        fractions: 0
    }
}