const circumferenceStatus = 2 * Math.PI * 20;
const circumferenceSpeed = 2 * Math.PI * 54;

let serverConfig = {
    EnableCash: true, EnableBank: true, EnableFuel: true, EnableStamina: true, EnableOxygen: true
};

let allowStamina = true;
let allowOxygen = true;

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

function updateStyle(id, val) {
    let unit = "";
    if (id === 'hud-scale') {
        if (parseFloat(val) < 0.1) val = 0.5; 
        document.documentElement.style.setProperty('--hud-scale', val);
        if(document.getElementById(id + '-val')) document.getElementById(id + '-val').innerText = parseFloat(val).toFixed(2);
    } else {
        unit = id.includes('-x') ? 'vw' : 'vh';
        document.documentElement.style.setProperty('--' + id, val + unit);
        if(document.getElementById(id + '-val')) document.getElementById(id + '-val').innerText = val;
    }
    localStorage.setItem(id, val);
}

function initDefaults() {
    const defaults = {
        'hud-x': 95, 'hud-y': 5,
        'money-x': 95, 'money-y': 15,
        'bank-x': 95, 'bank-y': 22,
        'speedo-x': 95, 'speedo-y': 95,
        'hud-scale': 1.0, 
        'color-health': '#ff2d55', 'color-armor': '#007aff', 'color-hunger': '#ff9500', 
        'color-thirst': '#5ac8fa', 'color-stamina': '#ffb347', 'color-oxygen': '#87ceeb',
        'color-money': '#4cd964', 'color-bank': '#00a8ff'
    };

    Object.keys(defaults).forEach(id => {
        let saved = localStorage.getItem(id);
        if (saved === null || saved === "undefined" || saved === "0") saved = defaults[id];
        
        const el = document.getElementById(id);
        if (el) el.value = saved;
        updateStyle(id, saved);
    });

    if (localStorage.getItem('cash-visible') === null) localStorage.setItem('cash-visible', 'true');
    if (localStorage.getItem('bank-visible') === null) localStorage.setItem('bank-visible', 'true');
    if (localStorage.getItem('fuel-visible') === null) localStorage.setItem('fuel-visible', 'true');
    if (localStorage.getItem('stamina-visible') === null) localStorage.setItem('stamina-visible', 'true');
    if (localStorage.getItem('oxygen-visible') === null) localStorage.setItem('oxygen-visible', 'true');
    
    refreshVisibility();
}

function refreshVisibility() {
    let cashVis = (localStorage.getItem('cash-visible') !== 'false') && serverConfig.EnableCash;
    let bankVis = (localStorage.getItem('bank-visible') !== 'false') && serverConfig.EnableBank;
    let fuelVis = (localStorage.getItem('fuel-visible') !== 'false') && serverConfig.EnableFuel;
    
    allowStamina = (localStorage.getItem('stamina-visible') !== 'false') && serverConfig.EnableStamina;
    allowOxygen = (localStorage.getItem('oxygen-visible') !== 'false') && serverConfig.EnableOxygen;

    document.getElementById('money-container').style.display = cashVis ? 'flex' : 'none';
    if(document.getElementById('toggle-cash')) document.getElementById('toggle-cash').checked = cashVis;

    document.getElementById('bank-container').style.display = bankVis ? 'flex' : 'none';
    if(document.getElementById('toggle-bank')) document.getElementById('toggle-bank').checked = bankVis;

    document.getElementById('fuel-gauge-container').style.display = fuelVis ? 'block' : 'none';
    if(document.getElementById('toggle-fuel')) document.getElementById('toggle-fuel').checked = fuelVis;
    
    if(document.getElementById('toggle-stamina')) document.getElementById('toggle-stamina').checked = allowStamina;
    if(document.getElementById('toggle-oxygen')) document.getElementById('toggle-oxygen').checked = allowOxygen;
}

window.onload = () => { initDefaults(); };

window.addEventListener('message', function(event) {
    let data = event.data;

    if (data.type === "setupConfig") {
        serverConfig = data.config;
        let translations = data.locale;
        
        if (translations) {
            document.querySelectorAll('[data-trans]').forEach(el => {
                let key = el.getAttribute('data-trans');
                if (translations[key]) el.innerText = translations[key];
            });
        }

        if (!serverConfig.EnableCash) { document.getElementById('row-toggle-cash').style.display = 'none'; document.getElementById('block-pos-cash').style.display = 'none'; document.getElementById('row-color-cash').style.display = 'none'; }
        if (!serverConfig.EnableBank) { document.getElementById('row-toggle-bank').style.display = 'none'; document.getElementById('block-pos-bank').style.display = 'none'; document.getElementById('row-color-bank').style.display = 'none'; }
        if (!serverConfig.EnableFuel) { document.getElementById('row-toggle-fuel').style.display = 'none'; }
        if (!serverConfig.EnableStamina) { document.getElementById('row-toggle-stamina').style.display = 'none'; document.getElementById('row-color-stamina').style.display = 'none'; }
        if (!serverConfig.EnableOxygen) { document.getElementById('row-toggle-oxygen').style.display = 'none'; document.getElementById('row-color-oxygen').style.display = 'none'; }
        
        if(localStorage.getItem('hud-scale') === null && serverConfig.DefaultScale) {
            updateStyle('hud-scale', serverConfig.DefaultScale);
            if(document.getElementById('hud-scale')) document.getElementById('hud-scale').value = serverConfig.DefaultScale;
        }
        refreshVisibility();
    }
    // Blendet das gesamte HUD aus, wenn ESC gedrückt wird
    if (data.type === "toggleHUD") {
        document.body.style.opacity = data.show ? "1" : "0";
        document.body.style.transition = "opacity 0.2s ease-in-out"; // Sorgt für ein weiches Ein- und Ausblenden
    }

    if (data.type === "updateStatus") {
        if (document.getElementById('player-id')) document.getElementById('player-id').innerText = data.id;

        // --- NEU: GLITCH EFFEKT LOGIK ---
        let hudContainer = document.getElementById('hud-container');
        // Wenn das Leben unter 25 ist (und man nicht komplett tot ist, also > 0)
        if (data.health < 25 && data.health > 0) {
            hudContainer.classList.add('critical-health');
        } else {
            hudContainer.classList.remove('critical-health');
        }

        ['health', 'armor', 'hunger', 'thirst'].forEach(s => {
            const el = document.getElementById(s + '-prog');
            if (el) el.style.strokeDashoffset = circumferenceStatus - (data[s] / 100) * circumferenceStatus;
        });

        // Stamina Logik
        let staminaCircle = document.getElementById('stamina-circle');
        if (allowStamina && data.stamina < 100) {
            staminaCircle.style.display = 'flex';
            document.getElementById('stamina-prog').style.strokeDashoffset = circumferenceStatus - (data.stamina / 100) * circumferenceStatus;
        } else {
            staminaCircle.style.display = 'none';
        }

        // Oxygen Logik
        let oxygenCircle = document.getElementById('oxygen-circle');
        if (allowOxygen && data.isUnderwater) {
            oxygenCircle.style.display = 'flex';
            let oxyPc = Math.min(Math.max(data.oxygen, 0), 100);
            document.getElementById('oxygen-prog').style.strokeDashoffset = circumferenceStatus - (oxyPc / 100) * circumferenceStatus;
        } else {
            oxygenCircle.style.display = 'none';
        }
    }

    if (data.type === "updateMoney") {
        if(document.getElementById('cash-amount')) document.getElementById('cash-amount').innerText = data.cash.toLocaleString();
        if(document.getElementById('bank-amount')) document.getElementById('bank-amount').innerText = data.bank.toLocaleString();
    }

    if (data.type === "updateSpeedo") {
        let speedoCont = document.getElementById('speedo-container');
        if (speedoCont) speedoCont.style.display = data.show ? "block" : "none";
        
        if (data.show) {
            let speedPc = (data.speed / 300) * 100;
            if(document.getElementById('speed-prog')) document.getElementById('speed-prog').style.strokeDashoffset = circumferenceSpeed - (speedPc / 100) * circumferenceSpeed;
            if(document.getElementById('speed')) document.getElementById('speed').innerText = data.speed.toString().padStart(3, '0');
            
            if(document.getElementById('fuel-prog')) {
                document.getElementById('fuel-prog').style.strokeDashoffset = circumferenceStatus - (data.fuel / 100) * circumferenceStatus;
                document.getElementById('fuel-prog').style.stroke = (data.fuel < 20) ? "#ff2d55" : "#ffd200";
            }
        }
    }

    if (data.type === "openConfig") document.getElementById('config-menu').style.display = "block";
    if (data.type === "forceClose") document.getElementById('config-menu').style.display = "none";
});

function resetHUD() {
    fetch(`https://${GetParentResourceName()}/closeConfig`, { method: 'POST' })
    .then(() => { localStorage.clear(); setTimeout(() => location.reload(), 100); });
}

document.querySelectorAll('input[type="range"]').forEach(input => {
    input.oninput = (e) => updateStyle(e.target.id, e.target.value);
});

document.querySelectorAll('input[type="color"]').forEach(input => {
    input.oninput = (e) => {
        const colors = { 'color-health': '--health-col', 'color-armor': '--armor-col', 'color-hunger': '--hunger-col', 'color-thirst': '--thirst-col', 'color-stamina': '--stamina-col', 'color-oxygen': '--oxygen-col', 'color-money': '--money-col', 'color-bank': '--bank-col' };
        document.documentElement.style.setProperty(colors[e.target.id], e.target.value);
        localStorage.setItem(e.target.id, e.target.value);
    };
});

document.getElementById('toggle-cash').onchange = (e) => { localStorage.setItem('cash-visible', e.target.checked); refreshVisibility(); };
document.getElementById('toggle-bank').onchange = (e) => { localStorage.setItem('bank-visible', e.target.checked); refreshVisibility(); };
document.getElementById('toggle-fuel').onchange = (e) => { localStorage.setItem('fuel-visible', e.target.checked); refreshVisibility(); };
document.getElementById('toggle-stamina').onchange = (e) => { localStorage.setItem('stamina-visible', e.target.checked); refreshVisibility(); };
document.getElementById('toggle-oxygen').onchange = (e) => { localStorage.setItem('oxygen-visible', e.target.checked); refreshVisibility(); };

document.getElementById('close-btn').onclick = () => {
    document.getElementById('config-menu').style.display = "none";
    fetch(`https://${GetParentResourceName()}/closeConfig`, { method: 'POST', body: JSON.stringify({}) });
};

