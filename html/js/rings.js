import { ICONS } from './icons.js';

// "Signal HUD"-Optik: Ringe bestehen aus einzelnen Tick-Segmenten statt einem
// glatten Bogen. Ein einziger Radius/Tick-Count treibt sowohl das generierte
// SVG als auch die Fortschritts-Berechnung - keine über zwei Dateien verteilten
// Konstanten mehr, die manuell synchron gehalten werden müssen.
const SVG_NS = 'http://www.w3.org/2000/svg';
const TICK_COUNT = 28;
const TICK_RADIUS = 38;

export const RING_DEFS = [
    { id: 'health',  icon: 'heart',    colorVar: '--health-col' },
    { id: 'armor',   icon: 'shield',   colorVar: '--armor-col' },
    { id: 'hunger',  icon: 'utensils', colorVar: '--hunger-col' },
    { id: 'thirst',  icon: 'droplet',  colorVar: '--thirst-col' },
    { id: 'stamina', icon: 'running',  colorVar: '--stamina-col', conditional: true },
    { id: 'oxygen',  icon: 'lungs',    colorVar: '--oxygen-col',  conditional: true }
];

const lastRenderedPct = {};

function buildTick(angle, colorVar) {
    const tick = document.createElementNS(SVG_NS, 'line');
    tick.setAttribute('x1', '50');
    tick.setAttribute('y1', String(50 - TICK_RADIUS - 6));
    tick.setAttribute('x2', '50');
    tick.setAttribute('y2', String(50 - TICK_RADIUS + 1));
    tick.setAttribute('class', 'ring-tick');
    tick.setAttribute('transform', `rotate(${angle} 50 50)`);
    tick.style.setProperty('--tick-col', `var(${colorVar})`);
    return tick;
}

export function buildRing(def, extraClass) {
    const wrap = document.createElement('div');
    wrap.className = 'ring' + (extraClass ? ' ' + extraClass : '');
    wrap.id = `ring-${def.id}`;
    if (def.conditional) wrap.style.display = 'none';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'ring-svg');

    const ticks = [];
    for (let i = 0; i < TICK_COUNT; i++) {
        const angle = (360 / TICK_COUNT) * i;
        const tick = buildTick(angle, def.colorVar);
        svg.appendChild(tick);
        ticks.push(tick);
    }
    wrap.appendChild(svg);

    if (def.icon) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'ring-icon';
        iconWrap.style.color = `var(${def.colorVar})`;
        iconWrap.innerHTML = ICONS[def.icon];
        wrap.appendChild(iconWrap);
    }

    wrap._ticks = ticks;
    return wrap;
}

export function setRingValue(id, percent) {
    const pct = Math.max(0, Math.min(100, percent));
    if (lastRenderedPct[id] === pct) return;
    lastRenderedPct[id] = pct;

    const wrap = document.getElementById(`ring-${id}`);
    if (!wrap || !wrap._ticks) return;

    const activeCount = Math.round((pct / 100) * TICK_COUNT);
    wrap._ticks.forEach((tick, i) => {
        tick.classList.toggle('active', i < activeCount);
    });
}

export function setRingVisible(id, visible) {
    const wrap = document.getElementById(`ring-${id}`);
    if (wrap) wrap.style.display = visible ? 'flex' : 'none';
}
