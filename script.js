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
        
        clear() {
            this.main.textContent = '';
            this.sign.innerHTML = '';
        },

        updateMain(newText) {
            this.main.textContent = newText;
        },

        toggleSign() {
            if (this.sign.innerHTML) {
                this.sign.innerHTML = '';
            } else {
                this.sign.innerHTML = '&minus;';
            };
        },
    },
};

const memory = {
    firstNumber: null,
    operation: null,
    secondNumber: null, 
    negativeActive: false,

    get readyToOperate() {
        return !(!this.firstNumber || !this.operation || !this.secondNumber);
    },

    clear() {
        this.firstNumber = null;
        this.operation = null;
        this.secondNumber = null;
    },

    storeNumber(num) {
        if (!this.operation) {
            this.firstNumber = num; 
        } else {
            this.secondNumber = num;
        }
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
        }
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
    console.log(digit);
};

function resolveOperationClick(buttonID) {
    console.log(buttonID);
};

function resolveNegativeClick() {
    ui.displays.toggleSign();
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
    if (memory.readyToOperate) {
        const result = memory.operate();
        memory.clear();
        ui.displays.clear();
        if (result < 0) {
            ui.displays.toggleSign();
        };
        ui.displays.updateMain(String(Math.abs(result)));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    addButtonClickListeners();
});