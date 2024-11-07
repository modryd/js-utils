// Verify
/**
 * Ask Yes/No question before proceeding
 * Uses Bootstrap btn
 * Usage:
 * <a href="/delete/1" class="btn btn-danger" data-action="verify" data-description="Delete first thing">Delete</a>
 * <script type="module">
 *  (new Verify()).fire();
 * </script>
 */
import BaseAction from './base_action.js';

export default class Verify extends BaseAction {
    static ACTION_NAME = 'verify';
    static HREF_ATTRIBUTE = 'data-href';
    static DESCRIPTION_ATTRIBUTE = 'data-description';
    static STYLE = `
        .verify-modal {
            position: fixed;
            z-index: 1100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .verify-modal-content {
            background-color: #fefefe;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        }
        .verify-close {
            color: #aaa;
            float: right;
            position: relative;
            top: -16px;
            font-size: 28px;
            font-weight: bold;
        }
        .verify-close:hover,
        .verify-close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    `;
    initialized = false;
    lang_yes = 'Yes, agree';
    lang_cancel = 'Cancel';

    setTexts(yes, cancel) {
        this.lang_yes = yes;
        this.lang_cancel = cancel;
        return this;
    }

    fire() {
        if (!this.constructor.initialized) {
            this.addStyles(this.constructor.STYLE);
            this.constructor.initialized = true;
        }

        this.getElements().forEach((element) => {
            element.onclick = (event) => {
                this.clicked(event);
            };

            // Change href to data-href
            const href = element.getAttribute('href');
            element.setAttribute(this.constructor.HREF_ATTRIBUTE, href);
            element.removeAttribute('href');
        });
    }

    showModal(msg, link, description) {
        const modal = document.createElement('div');
        modal.classList.add('verify-modal');
        modal.innerHTML = `
            <div class="verify-modal-content">
                <span class="verify-close verify-close-btn">&times;</span>
                <h2>${msg}?</h2>
                <p>${description}</p>
                <a href="${link}" class="btn btn-danger">${this.lang_yes}</a>
                <a class="btn btn-secondary verify-close-btn">${this.lang_cancel}</a>
            </div>
        `;
        document.body.appendChild(modal);

        // Add timer
        document.onmousedown = (e) => {
            if (e.target.classList.contains('verify-modal')) {
                this.hideModal(modal);
            }
        };

        const closeButtons = modal.querySelectorAll('.verify-close-btn');
        for (let button of closeButtons) {
            button.onmousedown = () => {
                this.hideModal(modal);
            };
        }
    }

    hideModal(modal) {
        modal.remove();
    }

    clicked(event) {
        const element = event.target;
        let msg = element.innerText;
        let link = element.getAttribute(this.constructor.HREF_ATTRIBUTE);
        let description = element.getAttribute(this.constructor.DESCRIPTION_ATTRIBUTE) || '';
        this.showModal(msg, link, description);
    }
}