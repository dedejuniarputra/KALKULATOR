const calculatorDisplay = document.querySelector('h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.querySelector('#clear-btn');

const calculate = {
    '/': (firstNumber, secondNumber) => secondNumber === 0 ? 'Error' : firstNumber / secondNumber,
    '*': (firstNumber, secondNumber) => firstNumber * secondNumber,
    '+': (firstNumber, secondNumber) => firstNumber + secondNumber,
    '-': (firstNumber, secondNumber) => firstNumber - secondNumber,
    '=': (firstNumber, secondNumber) => secondNumber
};

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;
let currentOperation = '';

function sendNumberValue(number) {
    if (awaitingNextValue) {
        calculatorDisplay.textContent = number;
        awaitingNextValue = false;
    } else {
        const displayValue = calculatorDisplay.textContent;
        calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
    currentOperation += number;
}

function addDecimal() {
    if (awaitingNextValue) return;
    if (!calculatorDisplay.textContent.includes('.')) {
        calculatorDisplay.textContent += '.';
        currentOperation += '.';
    }
}

function useOperator(operator) {
    const currentValue = Number(calculatorDisplay.textContent);

    if (operatorValue && awaitingNextValue) {
        operatorValue = operator;
        currentOperation = currentOperation.slice(0, -3) + ` ${operator} `;
        return;
    }

    if (!firstValue) {
        firstValue = currentValue;
    } else if (operatorValue) {
        const calculation = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = isNaN(calculation) ? 'Error' : calculation;
        firstValue = isNaN(calculation) ? 0 : calculation;
    }

    awaitingNextValue = true;
    operatorValue = operator;
    currentOperation += ` ${operator} `;

    if (operator === '=') {
        currentOperation = `${firstValue}`;
        resetAfterEquals();
    }
}

function resetAfterEquals() {
    operatorValue = '';
    awaitingNextValue = false;
}

function resetAll() {
    firstValue = 0;
    operatorValue = '';
    awaitingNextValue = false;
    currentOperation = '';
    calculatorDisplay.textContent = '0';
}

// Add event listener on number, operators, decimal
inputBtns.forEach(inputBtn => {
    if (inputBtn.classList.length === 0) {
        inputBtn.addEventListener('click', () => sendNumberValue(inputBtn.value));
    } else if (inputBtn.classList.contains('operator')) {
        inputBtn.addEventListener('click', () => useOperator(inputBtn.value));
    } else if (inputBtn.classList.contains('decimal')) {
        inputBtn.addEventListener('click', addDecimal);
    }
});

// Event listener
clearBtn.addEventListener('click', resetAll);