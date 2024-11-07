// Fileuploadable
/**
 * Usage:
 * <input type="file" data-action="fileuploadable" accept="image/*">
 * <span class="alternate-style">Click to upload</span>
 *
 * <script type="module">
 *      import Contenteditable from 'contenteditable.js';
 *      (new Fileuploadable().setEndpoint('/upload')).fire();
 * </script>
 */
import BaseAction from './base_action.js';

export default class Fileuploadable extends BaseAction {
    static ACTION_NAME = 'fileuploadable';
    originalElement = null;
    callback = null;

    setCallback(callback) {
        this.callback = callback;
        return this;
    }

    reStyle(element) {
        let nextElement = element.nextElementSibling;
        if (!nextElement.classList.contains('alternate-style')) {
            return null;
        }

        element.style.display = 'none';

        nextElement.style.cursor = 'pointer';

        nextElement.onclick = (e) => {
            element.click();
        }

        return nextElement;
    }

    fire() {
        var elements = this.getElements();
        for (let element of elements) {
            let newElement = this.reStyle(element);

            // On file change
            element.onchange = (e) => {
                if (element.files.length > 0) {
                    if (newElement) {
                        newElement.innerHTML = element.files[0].name;
                    }

                    // Get file data from file input
                    let file = element.files[0];
                    this.sendFile(file, element);

                    if (this.callback) {
                        this.callback(file, element);
                    }
                }
            }

        }
    }
}