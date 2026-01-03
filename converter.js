// converter.js - JavaScript port of Python Terafont → Unicode converter

// CAPS_MAPPING: Consonants (checked FIRST for precedence)
const CAPS_MAPPING = {
    // A–L row (Caps Lock ON)
    "A": "બ", "S": "ક", "D": "મ", "F": "લ", "G": "ન",
    "H": "જ", "J": "વ", "K": "છ",

    // Z–M row (Caps Lock ON)
    "Z": "ર", "X": "શ", "C": "હ", "B": "ખ", "N": "દ", "M": "ણ",

    // Q–P row (Caps Lock ON)
    "Q": "ણ", "W": "ધ", "E": "ભ", "R": "ચ", "T": "ત",
    "Y": "થ", "U": "ગ", "I": "ય", "O": "ફ",
};

// NOCAPS_MAPPING: Matras, vowels, signs (checked SECOND)
const NOCAPS_MAPPING = {
    // Matras & vowels (Caps Lock OFF)
    "f": "ા", "l": "િ", "I": "ી", "u": "ુ", "U": "ૂ",
    "s": "ે", "o": "ો",

    // Special characters
    ";": "સ", ",": "લ",

    // Independent vowel
    "x": "ઋ",

    // Halant (virama)
    "+": "્", "?": "ઞ",
};

// Helper functions
const CONSONANT_REGEX = /[\u0A95-\u0AB9]/;

function isConsonant(ch) {
    return ch && CONSONANT_REGEX.test(ch);
}

function isMatra(ch) {
    return ch && "ાિીુૂેોૈૌ".includes(ch);
}

// Phase 1: Context-aware decode
function decodeBase(text) {
    const out = [];
    let prev = null;
    let afterHalant = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const nextCh = i + 1 < text.length ? text[i + 1] : null;

        // HALANT
        if (ch === "+") {
            out.push("્");
            prev = "્";
            afterHalant = true;
            continue;
        }

        // Ambiguous keys: I / U
        if (ch === "I" || ch === "U") {
            // CASE 0: FORCE consonant if next is 'l' (short-i)
            // Grammar rule: િ cannot be applied to a matra (ી, ૂ)
            if (nextCh === "l") {
                out.push(CAPS_MAPPING[ch]);
                prev = CAPS_MAPPING[ch];
                afterHalant = false;
                continue;
            }

            // CASE 1: After pre-base matra 'િ' → FORCE matra (not consonant)
            if (prev === "િ") {
                out.push(NOCAPS_MAPPING[ch]);
                prev = NOCAPS_MAPPING[ch];
                afterHalant = false;
                continue;
            }

            // CASE 2: After independent vowel (e.g. ઋ) → FORCE matra
            if (prev && "ઋઅઆઇઈઉઊએઐઓઔ".includes(prev)) {
                out.push(NOCAPS_MAPPING[ch]);
                prev = NOCAPS_MAPPING[ch];
                afterHalant = false;
                continue;
            }

            // DEFAULT RULE
            if (afterHalant || prev === null || (!isConsonant(prev) && !isMatra(prev))) {
                out.push(CAPS_MAPPING[ch]);
                prev = CAPS_MAPPING[ch];
            } else {
                out.push(NOCAPS_MAPPING[ch]);
                prev = NOCAPS_MAPPING[ch];
            }

            afterHalant = false;
            continue;
        }

        // CAPS consonants
        if (ch in CAPS_MAPPING) {
            out.push(CAPS_MAPPING[ch]);
            prev = CAPS_MAPPING[ch];
            afterHalant = false;
            continue;
        }

        // Matras & symbols
        if (ch in NOCAPS_MAPPING) {
            out.push(NOCAPS_MAPPING[ch]);
            prev = NOCAPS_MAPPING[ch];
            afterHalant = false;
            continue;
        }

        // Passthrough
        out.push(ch);
        prev = ch;
        afterHalant = false;
    }

    return out.join("");
}

// Phase 2: Matra reordering
function reorderMatraI(text) {
    // Move pre-base matra 'િ' before consonants, conjuncts, and independent vowels
    return text.replace(/((?:[\u0A85-\u0A94\u0A95-\u0AB9](?:્[\u0A95-\u0AB9])*)?)િ/g, 'િ$1');
}

function normalizePrebaseIClusters(text) {
    // Ensure 'િ' appears before the entire conjunct + matras
    return text.replace(/(ક્ષ|ત્ર|શ્ર|જ્ઞ)([ાીુૂેો]*)િ/g, 'િ$1$2');
}

function normalizeHalants(text) {
    return text.replace(/્+/g, "્");
}

// Phase 3: Conjunct formation
function applyConjuncts(text) {
    // Terafont legacy conjunct
    text = text.replace(/ક્ણ/g, "ક્ષ");

    // Standard Gujarati conjuncts
    text = text.replace(/ક્ષ/g, "ક્ષ");
    text = text.replace(/ત્ર/g, "ત્ર");
    text = text.replace(/શ્ર/g, "શ્ર");
    text = text.replace(/જ્ઞ/g, "જ્ઞ");

    return text;
}

// Master pipeline
function convert(text) {
    text = decodeBase(text);

    // Pass 1: initial short-i positioning
    text = reorderMatraI(text);

    // Halant cleanup
    text = normalizeHalants(text);

    // Conjunct formation
    text = applyConjuncts(text);

    // Pass 2: short-i after conjuncts
    text = reorderMatraI(text);

    // Final fix: short-i across conjunct clusters
    text = normalizePrebaseIClusters(text);

    return text;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convert };
}
