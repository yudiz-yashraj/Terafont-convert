// keyboard.js - Terafont Keyboard Emulation Layer

class TerafontKeyboard {
    constructor(textareaElement) {
        this.textarea = textareaElement;
        this.keyMapping = null;
        this.capsLockOn = false;

        this.init();
    }

    async init() {
        // Load keyboard mapping
        try {
            const response = await fetch('terafont_keyboard.json');
            this.keyMapping = await response.json();
            console.log('Terafont keyboard mapping loaded');
        } catch (error) {
            console.error('Failed to load keyboard mapping:', error);
            return;
        }

        // Setup event listeners
        this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Monitor Caps Lock state
        this.textarea.addEventListener('keyup', (e) => this.updateCapsLockState(e));
        this.textarea.addEventListener('click', (e) => this.updateCapsLockState(e));

        console.log('Terafont keyboard initialized');
    }

    updateCapsLockState(e) {
        // Detect Caps Lock state from event
        this.capsLockOn = e.getModifierState && e.getModifierState('CapsLock');
    }

    handleKeyDown(e) {
        // Get the physical key
        const key = e.key;

        // Ignore special keys that should have default behavior
        if (this.shouldIgnoreKey(key)) {
            return; // Allow default behavior
        }

        // Check if we have a mapping for this key
        if (!this.keyMapping || !this.keyMapping[key]) {
            return; // Allow default behavior for unmapped keys
        }

        // Prevent browser default insertion
        e.preventDefault();

        // Determine keyboard state
        const state = this.getKeyboardState(e);

        // Get mapped character
        const mappedChar = this.keyMapping[key][state];

        // Insert character if mapping exists
        if (mappedChar !== null && mappedChar !== undefined) {
            this.insertText(mappedChar);
        }
    }

    getKeyboardState(e) {
        const isCaps = this.capsLockOn;
        const isShift = e.shiftKey;

        if (isCaps && isShift) {
            return 'caps_shift';
        } else if (isCaps) {
            return 'caps';
        } else if (isShift) {
            return 'shift';
        } else {
            return 'normal';
        }
    }

    shouldIgnoreKey(key) {
        // Keys that should have default behavior
        const ignoreKeys = [
            'Enter', 'Tab', 'Backspace', 'Delete',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', 'PageUp', 'PageDown',
            'Escape', 'Insert',
            'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
            'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
        ];

        // Also ignore Ctrl/Alt/Meta combinations (for copy/paste etc.)
        return ignoreKeys.includes(key);
    }

    insertText(text) {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const currentValue = this.textarea.value;

        // Insert text at cursor position
        const newValue =
            currentValue.substring(0, start) +
            text +
            currentValue.substring(end);

        this.textarea.value = newValue;

        // Move cursor after inserted text
        const newCursorPos = start + text.length;
        this.textarea.selectionStart = newCursorPos;
        this.textarea.selectionEnd = newCursorPos;

        // Trigger input event so other listeners know content changed
        this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    getTerafontText() {
        return this.textarea.value;
    }

    setTerafontText(text) {
        this.textarea.value = text;
    }

    clear() {
        this.textarea.value = '';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TerafontKeyboard };
}
