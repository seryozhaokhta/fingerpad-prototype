import { padMap } from './padMap.js';
import { playSound } from './audioEngine.js';
import { startMetronome, stopMetronome } from './metronome.js';
import { enableDragDrop, disableDragDrop } from './dragDrop.js';

let currentMap = [...padMap];
const grid = document.getElementById('pad-grid');

/**
 * Отрисовывает пэды на гриде.
 * @param {Array} map - Массив с настройками пэдов.
 */
function renderPads(map) {
    grid.innerHTML = '';
    map.forEach((pad, index) => {
        const btn = document.createElement('button');
        btn.className = 'pad';
        btn.textContent = pad.label;
        btn.style.backgroundColor = '#333';
        btn.dataset.index = index;
        btn.dataset.color = pad.color;

        // Используем событие pointerdown для лучшей поддержки multi-touch
        btn.addEventListener('pointerdown', (e) => {
            // Предотвращаем стандартное поведение (например, зум)
            e.preventDefault();
            playSound(pad.sound);
            btn.style.backgroundColor = pad.color;
            // Возвращаем цвет через 200 мс
            setTimeout(() => {
                btn.style.backgroundColor = '#333';
            }, 200);
        });

        grid.appendChild(btn);
    });
}

renderPads(currentMap);

/* Управление Drag & Drop */
let dragDropEnabled = false;
const toggleDragDropButton = document.getElementById('toggleDragDrop');

toggleDragDropButton.addEventListener('click', () => {
    if (!dragDropEnabled) {
        enableDragDrop(grid, currentMap, renderPads);
        toggleDragDropButton.textContent = 'Disable Drag & Drop';
        dragDropEnabled = true;
    } else {
        disableDragDrop();
        toggleDragDropButton.textContent = 'Enable Drag & Drop';
        dragDropEnabled = false;
    }
});

/* Метроном */
const bpmInput = document.getElementById('bpm');
const bpmSlider = document.getElementById('bpm-slider');
const toggleMetronomeButton = document.getElementById('toggleMetronome');

let metronomeRunning = false;

function updateBpm(value) {
    bpmInput.value = value;
    bpmSlider.value = value;
    if (metronomeRunning) {
        startMetronome(parseInt(value, 10));
    }
}

bpmInput.addEventListener('input', (e) => updateBpm(e.target.value));
bpmSlider.addEventListener('input', (e) => updateBpm(e.target.value));

toggleMetronomeButton.addEventListener('click', () => {
    if (metronomeRunning) {
        stopMetronome();
        toggleMetronomeButton.textContent = 'Start Metronome';
    } else {
        const bpmValue = parseInt(bpmInput.value, 10);
        startMetronome(bpmValue);
        toggleMetronomeButton.textContent = 'Stop Metronome';
    }
    metronomeRunning = !metronomeRunning;
});
