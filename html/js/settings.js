import { HudState, savePrefs, resetPrefs, applyPrefsToCss } from './state.js';

const dom = {};

function cacheDom() {
    dom.menu = document.getElementById('config-menu');
    dom.tabWrapper = document.querySelector('.tab-wrapper');
    dom.tabButtons = document.querySelectorAll('.tab-btn');
    dom.tabContents = document.querySelectorAll('.tab-content');
    dom.scaleInput = document.getElementById('hud-scale');
    dom.scaleVal = document.getElementById('hud-scale-val');
    dom.closeBtn = document.getElementById('close-btn');
    dom.resetBtn = document.getElementById('reset-btn');
}

export function openTab(tabId, btnEl) {
    dom.tabContents.forEach(t => t.classList.remove('active'));
    dom.tabButtons.forEach(b => b.classList.remove('active'));

    const content = document.getElementById(tabId);
    if (content) content.classList.add('active');
    if (btnEl) btnEl.classList.add('active');
}

function bindTabs() {
    dom.tabWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        openTab(btn.dataset.tab, btn);
    });
}

function bindScale() {
    dom.scaleInput.value = HudState.prefs.scale;
    dom.scaleVal.textContent = Number(HudState.prefs.scale).toFixed(2);

    dom.scaleInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        HudState.prefs.scale = val;
        dom.scaleVal.textContent = val.toFixed(2);
        applyPrefsToCss(HudState.prefs);
        savePrefs();
    });
}

function bindPositions() {
    for (const key in HudState.prefs.positions) {
        const xInput = document.getElementById(`${key}-x`);
        const yInput = document.getElementById(`${key}-y`);
        const xVal = document.getElementById(`${key}-x-val`);
        const yVal = document.getElementById(`${key}-y-val`);
        if (!xInput || !yInput) continue;

        xInput.value = HudState.prefs.positions[key].x;
        yInput.value = HudState.prefs.positions[key].y;
        if (xVal) xVal.textContent = HudState.prefs.positions[key].x;
        if (yVal) yVal.textContent = HudState.prefs.positions[key].y;

        xInput.addEventListener('input', (e) => {
            HudState.prefs.positions[key].x = parseFloat(e.target.value);
            if (xVal) xVal.textContent = e.target.value;
            applyPrefsToCss(HudState.prefs);
            savePrefs();
        });
        yInput.addEventListener('input', (e) => {
            HudState.prefs.positions[key].y = parseFloat(e.target.value);
            if (yVal) yVal.textContent = e.target.value;
            applyPrefsToCss(HudState.prefs);
            savePrefs();
        });
    }
}

function bindColors() {
    for (const key in HudState.prefs.colors) {
        const input = document.getElementById(`color-${key}`);
        if (!input) continue;

        input.value = HudState.prefs.colors[key];
        input.addEventListener('input', (e) => {
            HudState.prefs.colors[key] = e.target.value;
            applyPrefsToCss(HudState.prefs);
            savePrefs();
        });
    }
}

function bindVisibilityToggles(onChange) {
    for (const key in HudState.prefs.visibility) {
        const input = document.getElementById(`toggle-${key}`);
        if (!input) continue;

        input.checked = HudState.prefs.visibility[key];
        input.addEventListener('change', (e) => {
            HudState.prefs.visibility[key] = e.target.checked;
            savePrefs();
            if (onChange) onChange();
        });
    }
}

function bindActionButtons(onClose) {
    dom.closeBtn.addEventListener('click', () => {
        dom.menu.style.display = 'none';
        fetch(`https://${GetParentResourceName()}/closeConfig`, { method: 'POST', body: JSON.stringify({}) });
        if (onClose) onClose();
    });

    dom.resetBtn.addEventListener('click', () => {
        resetPrefs();
        fetch(`https://${GetParentResourceName()}/closeConfig`, { method: 'POST' })
            .then(() => setTimeout(() => location.reload(), 100));
    });
}

export function initSettingsUI(onVisibilityChange, onClose) {
    cacheDom();
    bindTabs();
    bindScale();
    bindPositions();
    bindColors();
    bindVisibilityToggles(onVisibilityChange);
    bindActionButtons(onClose);
}

export function applyServerConfigGating(serverConfig, locale) {
    if (locale) {
        document.querySelectorAll('[data-trans]').forEach(el => {
            const key = el.getAttribute('data-trans');
            if (locale[key]) el.textContent = locale[key];
        });
    }

    const rowsByFlag = {
        EnableCash: ['row-toggle-cash', 'row-color-cash', 'block-pos-money'],
        EnableBank: ['row-toggle-bank', 'row-color-bank', 'block-pos-bank'],
        EnableFuel: ['row-toggle-fuel'],
        EnableStamina: ['row-toggle-stamina', 'row-color-stamina'],
        EnableOxygen: ['row-toggle-oxygen', 'row-color-oxygen'],
        EnableSpeedo: ['row-toggle-speedo', 'block-pos-speedo']
    };

    for (const flag in rowsByFlag) {
        if (!serverConfig[flag]) {
            rowsByFlag[flag].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        }
    }
}

export function openConfigMenu() {
    dom.menu.style.display = 'block';
}

export function closeConfigMenu() {
    dom.menu.style.display = 'none';
}
