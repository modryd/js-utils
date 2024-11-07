export default class BaseAction {
    static ACTION_ATTRIBUTE = 'data-action';
    static CONDITIONS_ATTRIBUTE = 'data-conditions';
    static PROPERTY_ATTRIBUTE = 'data-property';
    static DOMAIN_ATTRIBUTE = 'data-domain';
    static ACTION_NAME = null;
    static NULL_TEXT = '_Click to edit_';

    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        return this;
    }

    setCSRFToken(token) {
        this.csrf = token;
        return this;
    }

    setDomain(domain) {
        this.domain = domain;
        return this;
    }

    addStyles(styles) {
        let style = document.createElement('style');
        style.innerHTML = styles;
        document.head.appendChild(style);
    }

    selectAllTextInNode(node) {
        if (!node) return;
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    getElements() {
        let selector;
        if (this.constructor.ACTION_NAME) {
            selector = `${this.constructor.ACTION_ATTRIBUTE}="${this.constructor.ACTION_NAME}"`;
        } else if (this.constructor.SELECTOR_NAME) {
            selector = this.constructor.SELECTOR_NAME;
        }
        // Select by attribute SELECTOR_NAME and has no onclick event
        const elements = document.querySelectorAll(`[${selector}]:not([onclick])`);

        // Filter same domain
        return Array.from(elements).filter((element) => {
            const elementDomain = element.getAttribute(this.constructor.DOMAIN_ATTRIBUTE) || '';
            return (this.domain || '') === elementDomain;
        });
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.csrf) {
            headers['X-CSRF-TOKEN'] = this.csrf;
        }

        return headers;
    }

    getAdditionalParams(element) {
        let additionalParams = {};
        const conditions = element.getAttribute(this.constructor.CONDITIONS_ATTRIBUTE);
        if (!conditions) return additionalParams;

        try {
            const json = '{' + conditions.replace(/(\w+):/g, '"$1":') + '}';
            additionalParams = JSON.parse(json);
        } catch (e) {
            console.debug(`${this.constructor.CONDITIONS_ATTRIBUTE}:`, conditions);
            console.error('Invalid JSON in data-conditions attribute:', e);
        }
    }

    sendUpdate(attribute, value, element) {
        if (!this.endpoint) {
            console.error('No endpoint set for:', element);
            return;
        }

        fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                attribute: attribute,
                value: value,
                ...this.getAdditionalParams(element)
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    sendFile(file, element) {
        if (!this.endpoint) {
            console.error('No endpoint set for:', element);
            return;
        }

        const formData = new FormData();
        formData.append('file', file, file.name);

        let additionalParams = this.getAdditionalParams(element);
        for (let key in additionalParams) {
            formData.append(key, additionalParams[key]);
        }

        const headers = this.getHeaders();
        delete headers['Content-Type'];

        fetch(this.endpoint, {
            method: 'POST',
            headers: headers,
            body: formData,
        })
   }

}
