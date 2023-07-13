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
        
        updateMain(newText) {
            this.main.textContent = newText;
        },

        toggleSign() {
            if (this.sign.innerHTML) {
                this.sign.innerHTML = '';
            } else {
                this.sign.innerHTML = '&minus;';
            }
        },
    },
};

const memory = {
    firstNumber: null,
    operation: null,
    secondNumber: null, 

    reset() {
        this.firstNumber = null;
        this.operation = null;
        this.secondNumber = null;
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
        this.reset();
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
    console.log('Negative button clicked.')
}

function resolveDecimalClick() {
    console.log('Decimal button clicked.')
}

function resolveClearClick() {
    console.log('Clear button clicked.')
}

function resolveBackspaceClick() {
    console.log('Backspace button clicked.')
}

function resolveEqualsClick() {
    console.log('Equals button clicked.')
}

document.addEventListener('DOMContentLoaded', () => {
    addButtonClickListeners();
});