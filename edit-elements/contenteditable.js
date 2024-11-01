// Contenteditable
/**
 * Usage:
 * <h1 contenteditable data-property="name">{{ name }}</h1>
 * <script type="module">
 *      import Contenteditable from 'contenteditable.js';
 *      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
 *      (new Contenteditable("/update")).setCSRFToken(csrf).fire();
 * </script>
 */
import BaseAction from './base_action.js';

export default class Contenteditable extends BaseAction {
    static SELECTOR_NAME = 'contenteditable';

    constructor() {
        super();
        this.originalValue = '';
        this.timeOut = null;
    }

    // On click, after timeout
    fireEvent(element) {
        this.originalValue = element.target.innerHTML;
        if (element.target.innerHTML == this.constructor.NULL_TEXT) {
            element.target.innerHTML = '';
        }
        if (!element.target.classList.contains('active')) {
            this.selectAllTextInNode(element.target);
        }
        element.target.classList.add('active');
    }

    handleChange(element) {
        element.target.classList.remove('active');

        let val = element.target.innerHTML;
        if (val === this.originalValue) return;
        if (this.originalValue === this.constructor.NULL_TEXT && val === '') {
            element.target.innerHTML = this.constructor.NULL_TEXT;
            return;
        }
        let attribute = element.target.getAttribute(this.constructor.PROPERTY_ATTRIBUTE);

        this.sendUpdate(attribute, val, element.target);

        console.log(`Saving value of ${attribute} from ${this.originalValue} to ${val}`);
    }

    fire() {
        var elements = this.getElements();
        for (let element of elements) {

            // Before edit keep original value
            element.onclick = (e) => {
                this.timeOut = setTimeout(() => {
                    if (!this.timeOut) {
                        return;
                    }
                    this.fireEvent(e);
                }, 300);
            }

            // Prevent double click selection
            element.ondblclick = (e) => {
                clearTimeout(this.timeOut);
                this.timeOut = null;
            }

            // On unfocus, save the value
            element.onblur = (e) => this.handleChange(e);

            if (element.innerHTML === '') {
                element.innerHTML = this.constructor.NULL_TEXT;
            }

            // Return in edit fires save
            element.onkeydown = (e) => {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        element.blur();
                        break;
                    case 'Escape':
                        element.innerHTML = this.originalValue;
                        element.blur();
                        break;
                }
            }
        }
    }
}