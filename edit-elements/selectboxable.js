// Selectboxable
/**
 * Usage:
 * <h1 data-action="selectboxable" data-property="name" data-options="Yes,No">Select answer</h1>
 * <script type="module">
 *      import Selectboxable from 'selectboxable.js';
 *      (new Selectboxable("/update")).fire();
 * </script>
 */
import BaseAction from "./base_action.js";

export default class Selectboxable extends BaseAction {
    static ACTION_NAME = 'selectboxable';
    static OPTIONS_ATTRIBUTE = 'data-options';
    static REQUIRED_ATTRIBUTES = [this.PROPERTY_ATTRIBUTE, this.OPTIONS_ATTRIBUTE];
    static STYLES = `
        .floating-select {
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 5px 0 #ccc;

            z-index: 1000;
            position: absolute;
            width: 100px;
        }
        .floating-select div {
            cursor: pointer;
            padding: 5px;
        }
        .floating-select div.selected {
            background-color: #f0f0f0;
        }
        .floating-select div:hover {
            background-color: #f0f0f0;
        }
        [data-action="selectboxable"] {
            cursor: pointer;
            display: inline-block;
            position: relative;
        }
        [data-action="selectboxable"]::after {
            content: ' ▼';
            font-size: 0.7em;
            color: #888;
        }
    `;
    initialized = false;

    constructor() {
        super();
        this.originalValue = '';
        this.timeOut = null;
    }

    // On click, after timeout
    fireEvent(element) {
        this.originalValue = element.target.innerHTML;
        this.renderSelectbox(element.target);
        element.target.classList.add('active');
    }

    renderSelectbox(element) {
        let div = document.createElement('div');
        div.classList.add('floating-select');

        let options = element.getAttribute(this.constructor.OPTIONS_ATTRIBUTE).split(',');
        for (let option of options) {
            let optionElement = document.createElement('div');
            optionElement.innerHTML = option;
            optionElement.onclick = (e) => this.handleChange(element, e);
            // Downcased for comparison
            if (option.toLowerCase() === this.originalValue.toLowerCase()) {
                optionElement.classList.add('selected');
            }
            div.appendChild(optionElement);
        }

        element.innerHTML = '';
        element.appendChild(div);

        // Close select on click outside
        document.onclick = (e) =>{
            // Click not in element with data-action="selectboxable"
            if (e.target.getAttribute(this.constructor.ACTION_ATTRIBUTE) !== this.constructor.ACTION_NAME) {
                element.innerHTML = this.originalValue;
                element.classList.remove('active');
            }
        };
    }

    removeSelectbox(element) {
        let selectbox = element.querySelector('.floating-select');
        if (selectbox) {
            selectbox.remove();
        }

        document.onclick = null;
    }

    handleChange(main, e) {
        let option = e.target;
        option.classList.remove('active');

        let val = option.innerHTML;
        if (val === this.originalValue) return;
        if (this.originalValue === this.constructor.NULL_TEXT && val === '') {
            option.innerHTML = this.constructor.NULL_TEXT;
            return;
        }
        let property = main.getAttribute(this.constructor.PROPERTY_ATTRIBUTE);

        this.sendUpdate(property, val, main);
        console.log(`Saving value of ${property} from ${this.originalValue} to ${val}`);

        // Update element text
        this.removeSelectbox(main);
        main.innerHTML = val;

        e.stopPropagation();
        return false;
    }

    addStyles() {
        let style = document.createElement('style');
        style.innerHTML = this.constructor.STYLES;
        document.head.appendChild(style);
    }

    checkRequiredAttributes(element) {
        return this.constructor.REQUIRED_ATTRIBUTES.every((attr) => element.hasAttribute(attr));
    }

    fire() {
        var elements = this.getElements();
        if (!this.constructor.initialized) {
            this.addStyles();
            this.constructor.initialized = true;
        }
        for (let element of elements) {
            if (!this.checkRequiredAttributes(element)) {
                console.error(`Element missing required attributes: ${element.outerHTML}`, this.constructor.REQUIRED_ATTRIBUTES);
                continue;
            }

            // Before edit keep original value
            element.onclick = (e) => this.fireEvent(e);

            if (element.innerHTML === '') {
                element.innerHTML = this.constructor.NULL_TEXT;
            }

        }
    }
}