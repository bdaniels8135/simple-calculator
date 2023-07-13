const ui = {
    buttons: {
        digits: document.querySelectorAll('.button.digit'),
        operations: document.querySelectorAll('.button.operation'),
        negative: document.querySelector('#negative-button'),
        decimal: document.querySelector('#decimal-button'),
        clear: document.querySelector('#clear-button'),
        backspace: document.querySelector('#backspace-button'),
        equals: document.querySelector('#equals-button'),
    },

    displays: {
        main: document.querySelector('#main-display'),
        sign: document.querySelector('#sign-display'),
        readyToClear: false,

        get displayNumber() { 
            const neg = !!this.sign.innerHTML;
            const num = neg ? -Number(ui.displays.main.textContent) : Number(ui.displays.main.textContent);
            return num;
        },

        clear() {
            this.main.textContent = '';
            this.sign.innerHTML = '';
        },

        updateMain(num) {
            let newTextContent;
            const exponent = Number(num.toString().split('e-')[1]);
            if (!exponent) {
                newTextContent = String(num).slice(0, 10);
            } else {
                num *= 10**exponent;
                newTextContent = `0.${Array(exponent).join('0')}${num.toString()}`.slice(0,10);
            }       
            this.main.textContent = newTextContent;
        },

        toggleSign() {
            this.sign.innerHTML = this.sign.innerHTML ? '' : '&minus;';
        },

        displayOverflow() {
            this.main.textContent = 'OVERFLOW';
        },

        displayUnderflow() {
            this.main.textContent = 'UNDERFLOW';
        },
    },
};

const memory = {
    firstNumber: null,
    operation: null,
    secondNumber: null, 

    get readyToOperate() { return this.firstNumber != null && !!this.operation && this.secondNumber != null },

    clear() {
        this.firstNumber = null;
        this.operation = null;
        this.secondNumber = null;
    },

    storeNumber(num) {
        this.operation ? this.secondNumber = num : this.firstNumber = num;
    },

    operate() {
        let result;
        switch (this.operation){
            case 'add':
                result =  this.firstNumber + this.secondNumber;
                break;
            case 'subtract':
                result = this.firstNumber - this.secondNumber;
                break;
            case 'multiply':
                result = this.firstNumber * this.secondNumber;
                break;
            case 'divide':
                result = this.firstNumber / this.secondNumber;
                break;
            case 'power':
                result = this.firstNumber ** this.secondNumber;
        };
        return result;
    },
};

function addButtonClickListeners() {
    for (let button of ui.buttons.digits) {
        button.addEventListener('click', () => {
            resolveDigitClick(Number(button.textContent));
        });
    };
    for (let button of ui.buttons.operations) {
        button.addEventListener('click', () => {
            resolveOperationClick(button.id);
        });
    };
    ui.buttons.negative.addEventListener('click', () => resolveNegativeClick());
    ui.buttons.decimal.addEventListener('click', () => resolveDecimalClick());
    ui.buttons.clear.addEventListener('click', () => resolveClearClick());
    ui.buttons.backspace.addEventListener('click', () => resolveBackspaceClick());
    ui.buttons.equals.addEventListener('click', () => resolveEqualsClick());
};

function resolveDigitClick(digit) {
    if (ui.displays.readyToClear) {
        ui.displays.clear();
        ui.displays.readyToClear = false;
    };
    const displayString = String(Math.abs(ui.displays.displayNumber));
    if (displayString.length < 10) {
        const newDisplayNumber = Number(displayString + digit);
        ui.displays.updateMain(newDisplayNumber);
        memory.storeNumber(ui.displays.displayNumber);
    };
};

function resolveOperationClick(buttonID) {
    resolveEqualsClick();
    if (memory.firstNumber != null) {
        switch (buttonID) {
            case 'add-button':
                memory.operation = 'add';
                break;
            case 'subtract-button':
                memory.operation = 'subtract';
                break;
            case 'multiply-button':
                memory.operation = 'multiply';
                break;
            case 'divide-button':
                memory.operation = 'divide';
                break;
            case 'power-button':
                memory.operation = 'power';
        };
        ui.displays.readyToClear = true;
    };
};

function resolveNegativeClick() {
    ui.displays.toggleSign();
    memory.storeNumber(ui.displays.displayNumber);
};

function resolveDecimalClick() {
    alert('Sorry the decimal button is still under construction!');
};

function resolveClearClick() {
    memory.clear();
    ui.displays.clear();
};

function resolveBackspaceClick() {
    alert('Sorry the backspace button is still under construction!');
};

function resolveEqualsClick() {
    if (!memory.readyToOperate) return;
    
    const result = memory.operate();
    memory.clear();
    ui.displays.clear();
    ui.displays.readyToClear = true;

    if (Math.abs(result) < 0.00000001) {
        ui.displays.displayUnderflow();
        return;
    };
    
    if (Math.abs(result) > 9999999999) {
        ui.displays.displayOverflow();
        return;
    };

    if (result < 0) {
        ui.displays.toggleSign();
    };

    ui.displays.updateMain(Math.abs(result));
    memory.storeNumber(result);
};

document.addEventListener('DOMContentLoaded', () => {
    addButtonClickListeners();
});