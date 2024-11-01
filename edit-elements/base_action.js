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

    sendUpdate(attribute, value, element) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.csrf) {
            headers['X-CSRF-TOKEN'] = this.csrf;
        }

        const conditions = element.getAttribute(this.constructor.CONDITIONS_ATTRIBUTE);
        let additionalParams = {};
        if (conditions) {
            try {
                const json = '{' + conditions.replace(/(\w+):/g, '"$1":') + '}';
                additionalParams = JSON.parse(json);
            } catch (e) {
                console.debug(`${this.constructor.CONDITIONS_ATTRIBUTE}:`, conditions);
                console.error('Invalid JSON in data-conditions attribute:', e);
            }
        }

        if (this.endpoint) {
            fetch(this.endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    attribute: attribute,
                    value: value,
                    ...additionalParams
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
    }


}