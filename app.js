// app.js - Main Application Logic (Two-Layer Architecture)

class TerafontEmulatorApp {
    constructor() {
        // DOM elements
        this.terafontInput = document.getElementById('terafontInput');
        this.unicodeOutput = document.getElementById('unicodeOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearInputBtn = document.getElementById('clearInputBtn');
        this.capsIndicator = document.getElementById('capsIndicator');
        this.capsText = document.getElementById('capsText');
        this.statusMessage = document.getElementById('statusMessage');
        this.charCount = document.getElementById('charCount');

        // Keyboard handler
        this.keyboard = null;

        this.init();
    }

    async init() {
        // Initialize Terafont keyboard (Layer 1)
        this.keyboard = new TerafontKeyboard(this.terafontInput);

        // Wait for keyboard to load mapping
        await new Promise(resolve => setTimeout(resolve, 500));

        // Event listeners
        this.convertBtn.addEventListener('click', () => this.convertToUnicode());
        this.copyBtn.addEventListener('click', () => this.copyUnicode());
        this.clearInputBtn.addEventListener('click', () => this.clearInput());
        this.terafontInput.addEventListener('input', () => this.updateStats());
        this.terafontInput.addEventListener('keyup', (e) => this.updateCapsIndicator(e));
        this.terafontInput.addEventListener('click', (e) => this.updateCapsIndicator(e));

        // Initial state
        this.updateStats();
        this.setStatus('Ready to type Terafont text');

        console.log('Terafont Emulator App initialized');
    }

    // Layer 2: Unicode Conversion (Manual Trigger)
    convertToUnicode() {
        const terafontText = this.terafontInput.value;

        if (!terafontText || terafontText.trim().length === 0) {
            this.setStatus('⚠️ Please type some Terafont text first', 'warning');
            return;
        }

        try {
            // Call the converter (Layer 2)
            const unicodeText = convert(terafontText);

            // Display in output area
            this.unicodeOutput.value = unicodeText;

            this.setStatus('✅ Converted to Unicode successfully!', 'success');

            // Auto-fade status after 2 seconds
            setTimeout(() => {
                this.setStatus('Ready');
            }, 2000);

        } catch (error) {
            console.error('Conversion error:', error);
            this.setStatus('❌ Conversion failed. Please check your input.', 'error');
        }
    }

    async copyUnicode() {
        const unicodeText = this.unicodeOutput.value;

        if (!unicodeText || unicodeText.trim().length === 0) {
            this.setStatus('⚠️ Nothing to copy. Convert first!', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(unicodeText);
            this.setStatus('📋 Copied to clipboard!', 'success');

            setTimeout(() => {
                this.setStatus('Ready');
            }, 2000);

        } catch (error) {
            console.error('Copy failed:', error);
            this.setStatus('❌ Copy failed', 'error');
        }
    }

    clearInput() {
        this.terafontInput.value = '';
        this.unicodeOutput.value = '';
        this.updateStats();
        this.setStatus('Cleared');
        this.terafontInput.focus();
    }

    updateStats() {
        const charLength = this.terafontInput.value.length;
        this.charCount.textContent = `${charLength} character${charLength !== 1 ? 's' : ''}`;
    }

    updateCapsIndicator(e) {
        const isCapsLock = e.getModifierState && e.getModifierState('CapsLock');

        if (isCapsLock) {
            this.capsIndicator.classList.add('active');
            this.capsText.textContent = 'Caps Lock ON';
        } else {
            this.capsIndicator.classList.remove('active');
            this.capsText.textContent = 'Caps Lock OFF';
        }
    }

    setStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-${type}`;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new TerafontEmulatorApp();
});
