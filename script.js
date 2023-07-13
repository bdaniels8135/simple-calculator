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
        }
    },
};

function addButtonClickListeners() {
    for (button of ui.buttons.digits) {
        button.addEventListener('click', () => resolveDigitClick(Number(button.textContent)));
    };
}

function resolveDigitClick(digit) {
    console.log(digit)
}

