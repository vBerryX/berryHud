// Zentraler State: ein JSON-Blob statt ~10 einzelner localStorage-Keys.
// Löst dabei strukturell den alten "0"-Bug (localStorage-Werte wurden früher als
// String verglichen, wodurch ein gespeichertes "0" fälschlich als "nicht gesetzt" galt).
const STORAGE_KEY = 'berryhud-prefs';

export const DEFAULT_PREFS = {
    scale: 1.0,
    positions: {
        id:     { x: 2,  y: 3 },
        hud:    { x: 3,  y: 95 },
        money:  { x: 97, y: 4 },
        bank:   { x: 97, y: 10 },
        speedo: { x: 97, y: 95 }
    },
    colors: {
        health: '#ff2d55', armor: '#007aff', hunger: '#ff9500', thirst: '#5ac8fa',
        stamina: '#ffb347', oxygen: '#87ceeb', cash: '#4cd964', bank: '#00a8ff'
    },
    visibility: {
        cash: true, bank: true, fuel: true, stamina: true, oxygen: true, speedo: true
    }
};

export const HudState = {
    prefs: null,
    hadSavedPrefs: false,
    serverConfig: null,
    live: {
        status: { id: 0, health: 100, armor: 0, hunger: 100, thirst: 100, stamina: 100, isUnderwater: false, oxygen: 100 },
        money: { cash: 0, bank: 0 },
        speedo: { show: false, speed: 0, fuel: 100, gear: 0 },
        talking: false
    }
};

function deepMerge(base, saved) {
    const out = { ...base };
    for (const key in base) {
        if (saved && Object.prototype.hasOwnProperty.call(saved, key)) {
            const value = saved[key];
            out[key] = (value && typeof value === 'object' && !Array.isArray(value))
                ? deepMerge(base[key], value)
                : value;
        }
    }
    return out;
}

export function loadPrefs() {
    let saved = null;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            saved = JSON.parse(raw);
            HudState.hadSavedPrefs = true;
        }
    } catch (e) {
        saved = null;
    }

    HudState.prefs = deepMerge(DEFAULT_PREFS, saved);
    return HudState.prefs;
}

export function savePrefs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(HudState.prefs));
}

export function resetPrefs() {
    localStorage.removeItem(STORAGE_KEY);
    HudState.hadSavedPrefs = false;
    HudState.prefs = JSON.parse(JSON.stringify(DEFAULT_PREFS));
    return HudState.prefs;
}

export function applyPrefsToCss(prefs) {
    const root = document.documentElement.style;

    root.setProperty('--hud-scale', prefs.scale);

    for (const key in prefs.positions) {
        const pos = prefs.positions[key];
        root.setProperty(`--${key}-x`, pos.x + 'vw');
        root.setProperty(`--${key}-y`, pos.y + 'vh');
    }

    for (const key in prefs.colors) {
        root.setProperty(`--${key}-col`, prefs.colors[key]);
    }
}
