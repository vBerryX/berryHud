import { HudState, loadPrefs, savePrefs, applyPrefsToCss } from './state.js';
import { RING_DEFS, buildRing, setRingValue, setRingVisible } from './rings.js';
import { initSettingsUI, applyServerConfigGating, openConfigMenu, closeConfigMenu } from './settings.js';

const dom = {};
const lastText = {};
let glitchActive = false;

function cacheDom() {
    dom.statusCluster = document.getElementById('status-cluster');
    dom.speedoContainer = document.getElementById('speedo-container');
    dom.speedoWidget = document.getElementById('speedo-widget');
    dom.playerId = document.getElementById('player-id');
    dom.voiceIcon = document.getElementById('voice-icon');
    dom.cashAmount = document.getElementById('cash-amount');
    dom.bankAmount = document.getElementById('bank-amount');
    dom.moneyContainer = document.getElementById('money-container');
    dom.bankContainer = document.getElementById('bank-container');
}

function buildStatusRings() {
    RING_DEFS.forEach(def => {
        dom.statusCluster.appendChild(buildRing(def));
    });
}

function buildSpeedoWidget() {
    const speedRing = buildRing({ id: 'speed', colorVar: '--speed-col' }, 'ring-lg');
    const speedText = document.createElement('div');
    speedText.className = 'speed-text';
    speedText.innerHTML = '<span id="speed-value">000</span><span class="speed-unit">KM/H</span><span id="speed-gear">N</span>';
    speedRing.appendChild(speedText);

    const fuelRing = buildRing({ id: 'fuel', icon: 'fuel', colorVar: '--fuel-col' }, 'ring-sm');

    dom.speedoWidget.appendChild(speedRing);
    dom.speedoWidget.appendChild(fuelRing);

    dom.speedValue = document.getElementById('speed-value');
    dom.speedGear = document.getElementById('speed-gear');
}

function updateGlitchState(healthPct) {
    const threshold = (HudState.serverConfig && HudState.serverConfig.GlitchThreshold) || 25;
    const shouldGlitch = healthPct <= threshold;
    if (shouldGlitch !== glitchActive) {
        glitchActive = shouldGlitch;
        document.body.classList.toggle('critical-health', glitchActive);
    }
}

function renderStatus(data) {
    if (lastText.id !== data.id) {
        lastText.id = data.id;
        if (dom.playerId) dom.playerId.textContent = data.id;
    }

    setRingValue('health', data.health);
    setRingValue('armor', data.armor);
    setRingValue('hunger', data.hunger);
    setRingValue('thirst', data.thirst);
    updateGlitchState(data.health);

    const staminaAllowed = HudState.prefs.visibility.stamina && (!HudState.serverConfig || HudState.serverConfig.EnableStamina);
    const staminaVisible = staminaAllowed && data.stamina < 100;
    setRingVisible('stamina', staminaVisible);
    if (staminaVisible) setRingValue('stamina', data.stamina);

    const oxygenAllowed = HudState.prefs.visibility.oxygen && (!HudState.serverConfig || HudState.serverConfig.EnableOxygen);
    const oxygenVisible = oxygenAllowed && data.isUnderwater;
    setRingVisible('oxygen', oxygenVisible);
    if (oxygenVisible) setRingValue('oxygen', data.oxygen);
}

function renderMoney(data) {
    if (lastText.cash !== data.cash) {
        lastText.cash = data.cash;
        if (dom.cashAmount) dom.cashAmount.textContent = data.cash.toLocaleString();
    }
    if (lastText.bank !== data.bank) {
        lastText.bank = data.bank;
        if (dom.bankAmount) dom.bankAmount.textContent = data.bank.toLocaleString();
    }
}

function refreshMoneyVisibility() {
    const cashVisible = HudState.prefs.visibility.cash && (!HudState.serverConfig || HudState.serverConfig.EnableCash);
    const bankVisible = HudState.prefs.visibility.bank && (!HudState.serverConfig || HudState.serverConfig.EnableBank);
    if (dom.moneyContainer) dom.moneyContainer.style.display = cashVisible ? 'flex' : 'none';
    if (dom.bankContainer) dom.bankContainer.style.display = bankVisible ? 'flex' : 'none';
}

function renderSpeedo(data) {
    const speedoAllowed = HudState.prefs.visibility.speedo && (!HudState.serverConfig || HudState.serverConfig.EnableSpeedo);
    const show = data.show && speedoAllowed;

    if (dom.speedoContainer) dom.speedoContainer.style.display = show ? 'block' : 'none';
    if (!show) return;

    setRingValue('speed', (data.speed / 300) * 100);

    const fuelAllowed = !HudState.serverConfig || HudState.serverConfig.EnableFuel;
    setRingVisible('fuel', fuelAllowed && HudState.prefs.visibility.fuel);
    if (fuelAllowed) {
        setRingValue('fuel', data.fuel);
        const fuelWrap = document.getElementById('ring-fuel');
        if (fuelWrap) fuelWrap.style.setProperty('--fuel-col', data.fuel < 20 ? '#ff2d55' : '#ffd200');
    }

    if (lastText.speed !== data.speed) {
        lastText.speed = data.speed;
        if (dom.speedValue) dom.speedValue.textContent = String(data.speed).padStart(3, '0');
    }
    if (lastText.gear !== data.gear) {
        lastText.gear = data.gear;
        if (dom.speedGear) dom.speedGear.textContent = data.gear === 0 ? 'N' : String(data.gear);
    }
}

function renderVoice(talking) {
    if (lastText.talking === talking) return;
    lastText.talking = talking;
    if (dom.voiceIcon) dom.voiceIcon.classList.toggle('active', talking);
}

function refreshAllVisibility() {
    refreshMoneyVisibility();
    renderStatus(HudState.live.status);
    renderSpeedo(HudState.live.speedo);
}

function handleMessage(event) {
    const data = event.data;

    switch (data.type) {
        case 'setupConfig':
            HudState.serverConfig = data.config;
            applyServerConfigGating(data.config, data.locale);

            if (!HudState.hadSavedPrefs) {
                if (data.config.Colors) Object.assign(HudState.prefs.colors, data.config.Colors);
                if (data.config.DefaultScale) HudState.prefs.scale = data.config.DefaultScale;
                applyPrefsToCss(HudState.prefs);
                savePrefs();
            }

            refreshAllVisibility();
            break;

        case 'toggleHUD':
            document.body.classList.toggle('hud-visible', data.show);
            break;

        case 'updateStatus':
            HudState.live.status = data;
            renderStatus(data);
            break;

        case 'updateMoney':
            renderMoney(data);
            break;

        case 'updateSpeedo':
            HudState.live.speedo = data;
            renderSpeedo(data);
            break;

        case 'updateVoice':
            renderVoice(data.talking);
            break;

        case 'openConfig':
            openConfigMenu();
            break;

        case 'forceClose':
            closeConfigMenu();
            break;
    }
}

function boot() {
    loadPrefs();
    cacheDom();
    applyPrefsToCss(HudState.prefs);
    buildStatusRings();
    buildSpeedoWidget();
    initSettingsUI(refreshAllVisibility, null);
    window.addEventListener('message', handleMessage);

    // Signalisiert dem Client-Skript, dass das DOM steht - ersetzt ein früheres
    // willkürliches Wait(1500) in Lua durch einen echten Ready-Callback.
    fetch(`https://${GetParentResourceName()}/uiReady`, { method: 'POST' }).catch(() => {});
}

window.addEventListener('DOMContentLoaded', boot);
