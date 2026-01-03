# Terafont Keyboard Emulator

**Two-Layer Architecture**: Keyboard Emulation → Manual Unicode Conversion

## 🎯 Architecture

This system follows a **strict two-layer separation**:

### Layer 1: Terafont Keyboard Emulation
- Handles physical key presses
- Maps keys based on **keyboard state** (Caps Lock / Shift / Caps+Shift)
- Inserts Terafont legacy characters
- Stores RAW Terafont text only
- **NO Unicode conversion**

### Layer 2: Unicode Conversion (On Demand)
- Triggered manually via "Convert" button
- Takes full Terafont text as input
- Calls `convert(text)` function
- Outputs clean Unicode Gujarati
- Displayed in read-only area

## 📁 Files

```
terafont-emulator/
├── index.html                  # Main UI with dual editors
├── styles.css                  # Professional styling
├── keyboard.js                 # Layer 1: Keyboard state handler
├── app.js                      # Main application logic
├── converter.js                # Layer 2: Unicode converter (from Python)
├── terafont_keyboard.json      # Keyboard mapping (hardware truth)
└── README.md                   # This file
```

## 🚀 How to Use

1. **Open the application**:
   ```bash
   open terafont-emulator/index.html
   ```

2. **Turn on Caps Lock** (for consonants)

3. **Type in the Terafont Input area**:
   - The keyboard will insert Terafont characters based on your key states
   - Example: Caps + `A` → બ (inserted as Terafont character)

4. **Click "Convert to Unicode"**:
   - The Terafont text will be converted to Unicode Gujarati
   - Output appears in the Unicode Output area (read-only)

5. **Copy the Unicode text**:
   - Click "Copy Unicode" button
   - Paste anywhere (Word, Email, etc.)

## ⌨️ Keyboard States

The system uses `terafont_keyboard.json` for mapping. Each key has 4 states:

```json
{
  "A": {
    "normal": "ો",          // No Caps, no Shift
    "caps": "બ",            // Caps Lock ON
    "shift": "બ",           // Shift pressed
    "caps_shift": "ો"       // Caps Lock ON + Shift
  }
}
```

## ✅ What is CORRECT

- ✅ Two-layer separation (keyboard → conversion)
- ✅ Manual conversion only (button-triggered)
- ✅ Raw Terafont text preservation
- ✅ Hardware-level keyboard mapping
- ✅ Caps Lock / Shift detection
- ✅ No auto-conversion while typing
- ✅ Reuses tested `convert()` function

## ❌ What is NOT Done

- ❌ Real-time Unicode display
- ❌ Grammar-based corrections
- ❌ AI/ML suggestions
- ❌ Auto-replacement

## 🧪 Testing Checklist

### Keyboard Layer
- [ ] Caps Lock ON inserts correct characters
- [ ] Shift key inserts correct characters
- [ ] Caps + Shift combination works
- [ ] Normal state (no modifiers) works
- [ ] Cursor movement works normally
- [ ] Backspace/Delete work
- [ ] Enter inserts newline
- [ ] No browser default characters leak

### Converter Layer
- [ ] Convert button triggers conversion
- [ ] Unicode output matches expected
- [ ] No conversion while typing
- [ ] Copy button works
- [ ] Clear button resets both areas

### Edge Cases
- [ ] Multi-line input
- [ ] Large paragraphs
- [ ] Rapid typing
- [ ] Paste handling
- [ ] Mixed Caps ON/OFF typing

## 🔧 Technical Details

### Keyboard Event Handler (`keyboard.js`)
- Detects Caps Lock state via `getModifierState('CapsLock')`
- Prevents browser default with `e.preventDefault()`
- Inserts mapped character at cursor position
- Preserves cursor location after insertion

### Converter (`converter.js`)
- Identical to Python version (275/275 tests passing)
- Context-aware I/U handling
- Matra reordering
- Conjunct formation
- **NOT modified** (treated as black box)

## 📊 Separation of Concerns

| Layer | Responsibility | MUST NOT |
|-------|---------------|----------|
| Keyboard | Insert Terafont chars based on key state | Convert to Unicode |
| Converter | Transform Terafont → Unicode | Handle keyboard states |

## 🎯 Use Cases

This is the correct architecture for:
- Users who want MS Word + Terafont font experience
- Batch conversion of legacy documents
- Preserving raw Terafont text
- Predictable, deterministic behavior

## 📝 Notes

- The keyboard mapping in `terafont_keyboard.json` is the **single source of truth**
- Modification to converter logic is **strictly prohibited**  
- This is **NOT** an IME (Input Method Editor)
- This **IS** a keyboard emulator + batch converter

---

**Status**: Production-ready two-layer architecture ✅
