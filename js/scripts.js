let state;

const BTN_TYPES = {
    TOTAL: 'TOTAL',
    OPERATION: 'OPERATION',
    NUMBER: 'NUMBER'
};

const INPUTS = {
    ADDITION: '+',
    SUBTRACTION: '-',
    MULTIPLICATION: '*',
    DIVISION: '/',
    NUM_0: '0',
    NUM_9: '9',
    BACKSPACE: 'Backspace',
    TOTAL_1: '=',
    TOTAL_2: 'Enter',
    FRACTION_1: '.',
    FRACTION_2: ',',
    CLEAR: 'Delete'
}

const MAX_FRACTION = 16;

const OPERATIONS = [
    INPUTS.ADDITION,
    INPUTS.SUBTRACTION,
    INPUTS.MULTIPLICATION,
    INPUTS.DIVISION
];

const bodyEl = document.querySelector('body');
bodyEl.addEventListener('keydown', handleKeyDown);

const operationsDiv = document.querySelector('#operations');
for (const operation of OPERATIONS) {
    const operationButton = createCalcButton(operation);
    operationButton.addEventListener('click', handleCalcButtonClick);
    operationsDiv.appendChild(operationButton);
}

const deleteButton = createCalcButton('\u2190', INPUTS.BACKSPACE);
deleteButton.id = 'delete-btn';
deleteButton.addEventListener('click', handleCalcButtonClick);
operationsDiv.appendChild(deleteButton);

const clearButton = createCalcButton('CLEAR', INPUTS.CLEAR);
clearButton.id = 'clear-btn';
clearButton.addEventListener('click', handleClearButtonClick);
operationsDiv.appendChild(clearButton);

const numbersDiv = document.querySelector('#numbers');

const dotButton = createCalcButton(INPUTS.FRACTION_1);
dotButton.id = 'dot-btn';
dotButton.addEventListener('click', handleCalcButtonClick);
numbersDiv.appendChild(dotButton);

const totalButton = createCalcButton(INPUTS.TOTAL_1);
totalButton.id = 'total-btn';
totalButton.addEventListener('click', handleCalcButtonClick);
numbersDiv.appendChild(totalButton);

for (let i = 0; i < 10; i++) {
    const numButton = createCalcButton(i);
    numButton.id = `calc-button-${i}`;
    numButton.addEventListener('click', handleCalcButtonClick);
    numbersDiv.appendChild(numButton);
}

resetState();
updateDisplay();

// FUNCTIONS

function createCalcButton(name, value) {
    const calcButton = document.createElement('button');
    calcButton.classList.add('calc-button');
    calcButton.textContent = name;
    calcButton.type = 'button';
    calcButton.value = value ?? name;
    return calcButton;
}

function handleKeyDown(ev) {
    processInput(ev.key);
}

function handleCalcButtonClick(ev) {
    processInput(ev.target.value);
}

function handleClearButtonClick() {
    resetState();
    updateDisplay();
}

function updateDisplay() {
    let toDisplay = state.display;
    if (state.fractions === 0) {
        toDisplay = state.display + INPUTS.FRACTION_1;
    }
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
        lastInputType: '',
        fractions: null
    }
}

function processInput(input) {
    if (OPERATIONS.includes(input)) processOperationInput(input);
    else if (input >= +INPUTS.NUM_0 && input <= +INPUTS.NUM_9) processNumberInput(input);
    else if (input === INPUTS.BACKSPACE) processDeleteInput();
    else if (input === INPUTS.FRACTION_1 || input === INPUTS.FRACTION_2) processDotInput();
    else if (input === INPUTS.TOTAL_1 || input === INPUTS.TOTAL_2) processTotalInput();
}

function processOperationInput(input) {
    if (state.lastInputType === BTN_TYPES.TOTAL ||
        (state.lastInputType === BTN_TYPES.NUMBER && !state.operator)
    ) {
        state.term1 = state.display;
    } else if (state.lastInputType === BTN_TYPES.OPERATION) {
        // just change the operator
    } else if (state.operator) {
        state.term2 = state.display;
        const result = Calculator.operate(state.term1, state.operator, state.term2);
        state.term1 = result;
        state.display = state.term1;
        updateDisplay();
    }
    state.operator = input;
    state.fractions = null;

    state.lastInputType = BTN_TYPES.OPERATION;
}

function processNumberInput(input) {
    if (state.lastInputType === BTN_TYPES.TOTAL) state.operator = '';
    if (state.lastInputType !== BTN_TYPES.NUMBER) state.display = 0;
    
    if (state.fractions !== null) {
        if (state.fractions < MAX_FRACTION) {
            state.fractions++;
            let stringDisplay = state.display.toFixed(state.fractions).slice(0, -1);
            state.display = Number(stringDisplay + input);
        }
    }
    else state.display = state.display * 10 + +input;
    
    updateDisplay();

    state.lastInputType = BTN_TYPES.NUMBER;
}

function processDeleteInput() {
    if (state.lastInputType === BTN_TYPES.TOTAL) state.operator = '';
    if (state.lastInputType !== BTN_TYPES.NUMBER) state.display = 0;
    
    if (state.fractions >= 1) {
        let stringDisplay = state.display.toFixed(state.fractions).slice(0, -1);

        if (state.fractions === 1) state.fractions = null;
        else state.fractions--;

        state.display = Number(stringDisplay);
    }
    else state.display = Math.floor(state.display / 10);
    
    updateDisplay();

    state.lastInputType = BTN_TYPES.NUMBER;
}

function processDotInput() {
    if (state.lastInputType === BTN_TYPES.TOTAL) state.operator = '';
    if (state.lastInputType !== BTN_TYPES.NUMBER) state.display = 0;
    
    if (!state.fractions) state.fractions = 0;
    
    updateDisplay();

    state.lastInputType = BTN_TYPES.NUMBER;
}

function processTotalInput() {
    if (state.lastInputType === BTN_TYPES.NUMBER) {
        state.term2 = state.display;
    } else if (state.lastInputType === BTN_TYPES.OPERATION) {
        state.term2 = state.term1;
    }
    const result = Calculator.operate(state.term1, state.operator, state.term2);
    state.term1 = result;
    state.display = state.term1;
    state.fractions = null;
    updateDisplay();
    
    state.lastInputType = BTN_TYPES.TOTAL;
}