// src/rhythmEngine.js

import { playSound } from './audioEngine.js';
import { padMap } from './padMap.js';

/**
 * Примерные схемы на 16 шагов (шестнадцатые ноты в такте 4/4).
 * Каждая схема — массив из 16 шагов, где каждый шаг — массив событий:
 * { padIndex: число }
 */
const patterns = {
    chainA: [
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 1 }, { padIndex: 14 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 1 }, { padIndex: 14 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }]
    ],

    chainB: [
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 1 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 1 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }]
    ],

    chainC: [
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 1 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 0 }, { padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }],
        [{ padIndex: 2 }]
    ]
};

/**
 * Воспроизводит событие, используя playSound из audioEngine и подсвечивает пэд.
 */
function triggerEvent(event) {
    if (typeof event.padIndex !== 'undefined') {
        const pad = padMap[event.padIndex];
        if (pad && pad.sound) {
            playSound(pad.sound);
            // Находим DOM-элемент пэда по data-index
            const btn = document.querySelector(`#pad-grid [data-index="${event.padIndex}"]`);
            if (btn) {
                btn.classList.add('fingerpad__pad--active');
                setTimeout(() => {
                    btn.classList.remove('fingerpad__pad--active');
                }, 200);
            }
        }
    }
}

// Переменные для управления ритмом
let intervalId = null;
let currentStep = 0;
let currentPattern = null;
let currentPatternName = '';
let currentBpm = 0;

/**
 * Запускает ритмическую схему с заданным BPM.
 * Интервал для 16-й ноты: 60000 / (bpm * 4).
 * @param {number} bpm - темп в ударах в минуту.
 * @param {string} patternName - 'chainA' | 'chainB' | 'chainC'.
 */
export function startRhythm(bpm, patternName) {
    if (!patterns[patternName]) {
        console.warn(`Нет такой схемы: ${patternName}`);
        return;
    }
    stopRhythm();

    currentPattern = patterns[patternName];
    currentPatternName = patternName;
    currentBpm = bpm;
    currentStep = 0;

    const intervalMs = 60000 / (bpm * 4);

    intervalId = setInterval(() => {
        const stepEvents = currentPattern[currentStep];
        if (stepEvents && stepEvents.length) {
            stepEvents.forEach(evt => triggerEvent(evt));
        }
        currentStep = (currentStep + 1) % 16;
    }, intervalMs);

    console.log(`Паттерн "${patternName}" запущен на BPM = ${bpm}`);
}

/**
 * Останавливает воспроизведение ритмической схемы.
 */
export function stopRhythm() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    currentPattern = null;
    currentPatternName = '';
    currentStep = 0;
    currentBpm = 0;
    console.log('Ритмическая схема остановлена.');
}

/**
 * Обновляет BPM запущенной схемы, если она играет.
 * Останавливает и перезапускает схему с новым темпом.
 * @param {number} newBpm - новый BPM.
 */
export function updateRhythm(newBpm) {
    if (currentPattern && currentPatternName) {
        console.log(`Обновление ритма до BPM = ${newBpm}`);
        startRhythm(newBpm, currentPatternName);
    }
}
