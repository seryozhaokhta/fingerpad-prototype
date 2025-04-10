import { padMap } from './padMap.js';
import { playSound } from './audioEngine.js';
import { startMetronome, stopMetronome } from './metronome.js';
import { enableDragDrop, disableDragDrop } from './dragDrop.js';

let currentMap = [...padMap];
const grid = document.getElementById('pad-grid');

/**
 * Отрисовывает пэды на гриде.
 * Каждый пэд получает класс по методологии БЭМ,
 * устанавливается CSS‑переменная --active-bg для активного состояния,
 * и прослушивается событие pointerdown.
 * 
 * @param {Array} map - Массив настроек пэдов.
 */
function renderPads(map) {
    grid.innerHTML = '';
    map.forEach((pad, index) => {
        const btn = document.createElement('button');
        // Используем правильное именование по БЭМ
        btn.classList.add('fingerpad__pad');
        btn.textContent = pad.label;
        btn.dataset.index = index;
        // Задаём CSS-переменную для активного цвета
        btn.style.setProperty('--active-bg', pad.color);

        // Обработка события для поддержки multi-touch
        btn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            playSound(pad.sound);
            // Добавляем класс активного состояния,
            // который изменяет фон на значение из --active-bg
            btn.classList.add('fingerpad__pad--active');
            setTimeout(() => {
                btn.classList.remove('fingerpad__pad--active');
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
