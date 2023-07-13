const ui = {
    buttons: {
        digits: document.querySelectorAll('.button.digit'),
        operations: document.querySelectorAll('.button.operation'),
        negative: document.querySelector('#negative-button'),
        decimal: document.querySelector('#decimal-button'),
        clear: document.querySelector('#clear-button'),
        backspace: document.querySelector('#backspace-button'),
        equals: document.querySelector('#equals-button'),

        setActiveOperation(buttonID) {
            for (let operation of this.operations){
                if (operation.id === buttonID) {
                    operation.classList.add('active');
                };
            };
        },

        clearActiveOperation() {
            for (let operation of this.operations) {
                operation.classList.remove('active');
            };
        },

        toggleDecimal() {
            this.decimal.classList.toggle('active');
        },
    },

    displays: {
        main: document.querySelector('#main-display'),
        sign: document.querySelector('#sign-display'),
        readyToClear: false,

        get displayNumber() { 
            const neg = !!this.sign.innerHTML;
            const num = neg ? -Number(ui.displays.main.innerHTML) : Number(ui.displays.main.innerHTML);
            return num;
        },

        clear() {
            this.main.innerHTML = '0.';
            ui.buttons.clearActiveOperation();
            this.sign.innerHTML = '';
        },

        updateMain(num) {
            let newTextContent;
            const exponent = Number(num.toString().split('e-')[1]);
            if (!exponent) {
                newTextContent = String(num).slice(0, 11);
                if (!newTextContent.split('').includes('.')) {
                    newTextContent += '.';
                };
            } else {
                num *= 10**exponent;
                newTextContent = `0.${Array(exponent).join('0')}${num.toString()}`.slice(0,10);
            }       
            this.main.innerHTML = newTextContent;
        },

        toggleSign() {
            this.sign.innerHTML = this.sign.innerHTML ? '' : '&minus;';
        },

        displayOverflow() {
            this.main.innerHTML = 'OVERFLOW';
        },

        displayUnderflow() {
            this.main.innerHTML = 'UNDERFLOW';
        },

        displayZeroDivision() {
            this.main.innerHTML = '&#128293;&#128293;&#128293;&#128293;';
        },

        backspace() {
            const backspacedText = this.main.innerHTML.split('').slice(0,-2).join('')
            if (backspacedText !== '') {
                this.updateMain(Number(backspacedText));
            } else {
                this.updateMain(0);
            };
        },
    },
};

const memory = {
    firstNumber: null,
    operation: null,
    secondNumber: null, 
    decimalActive: false,

    get readyToOperate() { return this.firstNumber != null && !!this.operation && this.secondNumber != null },

    clear() {
        this.firstNumber = 0;
        this.operation = null;
        this.secondNumber = null;
    },

    toggleDecimal() {
        this.decimalActive = !this.decimalActive;
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
    if (displayString.length >= 10) return;
    let newDisplayNumber;
    if (memory.decimalActive) {
        newDisplayNumber = Number(displayString + '.' + digit);
        resolveDecimalClick();
    } else {
        newDisplayNumber = Number(displayString + digit);
    };
    ui.displays.updateMain(newDisplayNumber);
    memory.storeNumber(ui.displays.displayNumber);
};

function resolveOperationClick(buttonID) {
    resolveEqualsClick();
    if (memory.decimalActive) {
        resolveDecimalClick();
    };
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
        ui.buttons.clearActiveOperation();
        ui.buttons.setActiveOperation(buttonID);
        ui.displays.readyToClear = true;
    };
};

function resolveNegativeClick() {
    if (ui.displays.readyToClear) return;
    ui.displays.toggleSign();
    memory.storeNumber(ui.displays.displayNumber);
};

function resolveDecimalClick() {
    if (ui.displays.displayNumber.toString().split('').slice(0,-1).includes('.') && !ui.displays.readyToClear) return;
    ui.buttons.toggleDecimal();
    memory.toggleDecimal();
};

function resolveClearClick() {
    memory.clear();
    ui.displays.clear();
    if (memory.decimalActive) {
        resolveDecimalClick();
    };
};

function resolveBackspaceClick() {
    if (ui.displays.readyToClear) return;
    if (memory.decimalActive) {
        resolveDecimalClick();
    };
    ui.displays.backspace()
};

function resolveEqualsClick() {
    if (!memory.readyToOperate) return;
    
    if (memory.operation === 'divide' && memory.secondNumber === 0) {
        ui.displays.displayZeroDivision();
        return;
    };

    const result = memory.operate();
    memory.clear();
    ui.displays.clear();
    ui.displays.readyToClear = true;
    if (memory.decimalActive) {
        resolveDecimalClick();
    };

    if (Math.abs(result) < 0.000000001 && result !== 0) {
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