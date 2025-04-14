import { padMap } from './padMap.js';
import { playSound } from './audioEngine.js';
import { startMetronome, stopMetronome } from './metronome.js';
import { enableDragDrop, disableDragDrop } from './dragDrop.js';
import { startRhythm, stopRhythm, updateRhythm } from './rhythmEngine.js';
import { enablePadConfigurationMode, disablePadConfigurationMode, isPadConfigurationModeEnabled } from './padConfigurator.js';

let currentMap = [...padMap];
const grid = document.getElementById('pad-grid');

function renderPads(map) {
    grid.innerHTML = '';
    map.forEach((pad, index) => {
        const btn = document.createElement('button');
        btn.classList.add('fingerpad__pad');
        btn.dataset.index = index;
        btn.style.setProperty('--active-bg', pad.color);
        btn.innerHTML = `
            <div class="instrument-type">${pad.instrumentType}</div>
            <div class="sample-name">${pad.sampleName}</div>
        `;
        // Воспроизведение звука при нажатии
        btn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            playSound(pad.sound);
            btn.classList.add('fingerpad__pad--active');
            setTimeout(() => {
                btn.classList.remove('fingerpad__pad--active');
            }, 200);
        });
        grid.appendChild(btn);
    });
    // Если режим конфигурации активен – добавляем иконки
    if (isPadConfigurationModeEnabled()) {
        enablePadConfigurationMode(grid, currentMap, renderPads);
    }
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
    updateRhythm(parseInt(value, 10));
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

/* Блок управления ритмическими схемами */
const toolbar = document.querySelector('.fingerpad__toolbar');

const rhythmContainer = document.createElement('div');
rhythmContainer.classList.add('fingerpad__toolbar-item');
rhythmContainer.innerHTML = `
  <label for="rhythmSelect" class="fingerpad__label">Ритм-схема:</label>
  <select id="rhythmSelect" class="fingerpad__input">
    <option value="">-- Выбрать --</option>
    <option value="chainA">Chain A</option>
    <option value="chainB">Chain B</option>
    <option value="chainC">Chain C</option>
  </select>
  <button id="startRhythmBtn" class="fingerpad__button">Play Rhythm</button>
  <button id="stopRhythmBtn" class="fingerpad__button">Stop Rhythm</button>
`;
toolbar.appendChild(rhythmContainer);

const rhythmSelect = document.getElementById('rhythmSelect');
const startRhythmBtn = document.getElementById('startRhythmBtn');
const stopRhythmBtn = document.getElementById('stopRhythmBtn');

startRhythmBtn.addEventListener('click', () => {
    const scheme = rhythmSelect.value;
    if (!scheme) {
        console.warn('Ритмическая схема не выбрана');
        return;
    }
    const bpmValue = parseInt(bpmInput.value, 10) || 90;
    startRhythm(bpmValue, scheme);
});

stopRhythmBtn.addEventListener('click', () => {
    stopRhythm();
});

/* Режим конфигурации пэдов */
const configButton = document.createElement('button');
configButton.textContent = 'Toggle Pad Config Mode';
configButton.classList.add('fingerpad__button');
configButton.addEventListener('click', () => {
    if (!isPadConfigurationModeEnabled()) {
        enablePadConfigurationMode(grid, currentMap, renderPads);
        configButton.textContent = 'Disable Pad Config Mode';
    } else {
        disablePadConfigurationMode(grid);
        configButton.textContent = 'Enable Pad Config Mode';
    }
});
toolbar.appendChild(configButton);
