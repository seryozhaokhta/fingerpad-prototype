import { playSound } from './audioEngine.js';
import { padMap } from './padMap.js';

/**
 * Примерные схемы на 16 шагов (шестнадцатые ноты в такте 4/4).
 * Каждый паттерн — массив из 16 шагов, где каждый шаг — массив объектов вида:
 * { padIndex: число }
 *
 * В данной реализации:
 * - "House" — классический ровный 4 on the floor (120 BPM).
 * - "Electronica" — условно плотные 16-е хэты (100 BPM).
 * - "Dubstep" — half-time грув (70 BPM).
 * - "French House" — вариант с добавлением clap на ударных (120 BPM).
 * - "Hip-Hop" — базовый грув (85 BPM).
 * - "Trap" — с насыщенными хэтами (140 BPM).
 *
 * Далее следуют джазовые варианты, условно имитирующие:
 * - "Swing" — с отложенными offbeat-ударениями (примерно 160 BPM).
 * - "Bebop" — плотный рисунок с быстрым темпом (220 BPM).
 * - "Jazz Blues" — расслабленный рисунок (90 BPM).
 * - "Hard Bop" — немного более насыщенный, «земной» грув (120 BPM).
 * - "Cool Jazz" — с разреженной, «просторной» пульсацией (80 BPM).
 * - "Dixieland" — упрощённая форма раннего нью-орлеанского джаза (примерно 110 BPM).
 */

const patterns = {
    /* ---------- HOUSE (120 BPM) ---------- */
    house: [
        [{ padIndex: 0 }], // step 0: Kick
        [],                // step 1
        [{ padIndex: 2 }], // step 2: Hihat
        [],                // step 3
        [{ padIndex: 0 }, { padIndex: 1 }], // step 4: Kick+Snare
        [],                // step 5
        [{ padIndex: 2 }], // step 6: Hihat
        [],                // step 7
        [{ padIndex: 0 }], // step 8: Kick
        [],                // step 9
        [{ padIndex: 2 }], // step 10: Hihat
        [],                // step 11
        [{ padIndex: 0 }, { padIndex: 1 }], // step 12: Kick+Snare
        [],                // step 13
        [{ padIndex: 2 }], // step 14: Hihat
        []                 // step 15
    ],

    /* ---------- ELECTRONICA (100 BPM) ---------- */
    electronica: [
        [{ padIndex: 0 }], // 0: Kick
        [{ padIndex: 2 }], // 1: Hihat
        [{ padIndex: 2 }], // 2: Hihat
        [{ padIndex: 2 }], // 3: Hihat
        [{ padIndex: 1 }], // 4: Snare
        [{ padIndex: 2 }], // 5: Hihat
        [{ padIndex: 2 }], // 6: Hihat
        [{ padIndex: 2 }], // 7: Hihat
        [{ padIndex: 0 }], // 8: Kick
        [{ padIndex: 2 }], // 9: Hihat
        [{ padIndex: 2 }], // 10: Hihat
        [{ padIndex: 2 }], // 11: Hihat
        [{ padIndex: 1 }], // 12: Snare
        [{ padIndex: 2 }], // 13: Hihat
        [{ padIndex: 2 }], // 14: Hihat
        [{ padIndex: 2 }]  // 15: Hihat
    ],

    /* ---------- DUBSTEP (70 BPM) ---------- */
    dubstep: [
        [{ padIndex: 0 }], // 0: Kick
        [],
        [],
        [],
        [{ padIndex: 1 }], // 4: Snare
        [],
        [{ padIndex: 0 }], // 6: Kick
        [],
        [],
        [],
        [],
        [],
        [{ padIndex: 1 }], // 12: Snare
        [],
        [],
        []
    ],

    /* ---------- FRENCH HOUSE (120 BPM) ---------- */
    frenchHouse: [
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Hihat
        [{ padIndex: 2 }],                  // 1
        [{ padIndex: 2 }],                  // 2
        [{ padIndex: 2 }],                  // 3
        [{ padIndex: 0 }, { padIndex: 1 }, { padIndex: 14 }], // 4: Kick + Snare + Clap
        [{ padIndex: 2 }],                  // 5
        [{ padIndex: 2 }],                  // 6
        [{ padIndex: 2 }],                  // 7
        [{ padIndex: 0 }, { padIndex: 2 }], // 8: Kick + Hihat
        [{ padIndex: 2 }],                  // 9
        [{ padIndex: 2 }],                  // 10
        [{ padIndex: 2 }],                  // 11
        [{ padIndex: 0 }, { padIndex: 1 }, { padIndex: 14 }], // 12: Kick + Snare + Clap
        [{ padIndex: 2 }],                  // 13
        [{ padIndex: 2 }],                  // 14
        [{ padIndex: 2 }]                   // 15: Hihat
    ],

    /* ---------- HIP-HOP (85 BPM) ---------- */
    hipHop: [
        [{ padIndex: 0 }], // 0: Kick
        [],
        [],
        [],
        [{ padIndex: 1 }], // 4: Snare
        [],
        [{ padIndex: 0 }], // 6: Kick
        [],
        [],
        [],
        [],
        [],
        [{ padIndex: 1 }], // 12: Snare
        [],
        [],
        []
    ],

    /* ---------- TRAP (140 BPM) ---------- */
    trap: [
        [{ padIndex: 0 }], // 0: Kick
        [],
        [{ padIndex: 2 }], // 2: Hihat
        [{ padIndex: 2 }], // 3: Hihat
        [{ padIndex: 1 }], // 4: Snare
        [{ padIndex: 2 }], // 5: Hihat
        [{ padIndex: 0 }], // 6: Kick
        [{ padIndex: 2 }], // 7: Hihat
        [],
        [],
        [{ padIndex: 2 }], // 10: Hihat
        [{ padIndex: 2 }], // 11: Hihat
        [{ padIndex: 1 }], // 12: Snare
        [{ padIndex: 2 }], // 13: Hihat
        [],
        [{ padIndex: 2 }]  // 15: Hihat
    ],

    /* ========= Джазовые / блюзовые ритмы ========= */

    /* ---------- SWING (160 BPM) ---------- */
    swing: [
        // Каждый такт: удар на downbeat (шаги 0,4,8,12) + «подтяжка» на offbeat (шаги 3,7,11,15)
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Ride (downbeat)
        [],
        [],
        [{ padIndex: 2 }],                  // 3: Offbeat (Ride)
        [{ padIndex: 1 }],                  // 4: Snare
        [],
        [],
        [{ padIndex: 2 }],                  // 7: Offbeat (Ride)
        [{ padIndex: 0 }, { padIndex: 2 }], // 8: Kick + Ride (downbeat)
        [],
        [],
        [{ padIndex: 2 }],                  // 11: Offbeat (Ride)
        [{ padIndex: 1 }],                  // 12: Snare
        [],
        [],
        [{ padIndex: 2 }]                   // 15: Offbeat (Ride)
    ],

    /* ---------- BEBOP (220 BPM) ---------- */
    bebop: [
        // Плотный рисунок с постоянным Ride, акценты на 0,4,8,12.
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Ride
        [{ padIndex: 2 }],                  // 1: Ride
        [{ padIndex: 2 }],                  // 2: Ride
        [{ padIndex: 2 }],                  // 3: Ride
        [{ padIndex: 1 }, { padIndex: 2 }], // 4: Snare + Ride
        [{ padIndex: 2 }],                  // 5: Ride
        [{ padIndex: 2 }],                  // 6: Ride
        [{ padIndex: 2 }],                  // 7: Ride
        [{ padIndex: 0 }, { padIndex: 2 }], // 8: Kick + Ride
        [{ padIndex: 2 }],                  // 9: Ride
        [{ padIndex: 2 }],                  // 10: Ride
        [{ padIndex: 2 }],                  // 11: Ride
        [{ padIndex: 1 }, { padIndex: 2 }], // 12: Snare + Ride
        [{ padIndex: 2 }],                  // 13: Ride
        [{ padIndex: 2 }],                  // 14: Ride
        [{ padIndex: 2 }]                   // 15: Ride
    ],

    /* ---------- JAZZ BLUES (90 BPM) ---------- */
    jazzBlues: [
        // Простая структура: Kick+Ride на 0 и 8, Snare+Ride на 4 и 12.
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Ride
        [],
        [],
        [],
        [{ padIndex: 1 }, { padIndex: 2 }], // 4: Snare + Ride
        [],
        [],
        [],
        [{ padIndex: 0 }, { padIndex: 2 }], // 8: Kick + Ride
        [],
        [],
        [],
        [{ padIndex: 1 }, { padIndex: 2 }], // 12: Snare + Ride
        [],
        [],
        []
    ],

    /* ---------- HARD BOP (120 BPM) ---------- */
    hardBop: [
        // Более насыщенный рисунок: добавлены промежуточные Ride-удары.
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Ride
        [{ padIndex: 2 }],                  // 1: Ride
        [{ padIndex: 2 }],                  // 2: Ride
        [],
        [{ padIndex: 1 }, { padIndex: 2 }], // 4: Snare + Ride
        [{ padIndex: 2 }],                  // 5: Ride
        [{ padIndex: 2 }],                  // 6: Ride
        [],
        [{ padIndex: 0 }, { padIndex: 2 }], // 8: Kick + Ride
        [{ padIndex: 2 }],                  // 9: Ride
        [{ padIndex: 2 }],                  // 10: Ride
        [],
        [{ padIndex: 1 }, { padIndex: 2 }], // 12: Snare + Ride
        [{ padIndex: 2 }],                  // 13: Ride
        [{ padIndex: 2 }],                  // 14: Ride
        []
    ],

    /* ---------- COOL JAZZ (80 BPM) ---------- */
    coolJazz: [
        // Сдержанный рисунок с минимальными ударными: лишь акцент на далеких нотах.
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Ride
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [{ padIndex: 1 }],                  // 8: Snare
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],

    /* ---------- DIXIELAND (110 BPM) ---------- */
    dixieland: [
        // Упрощённая форма: имитация раннего нью-орлеанского джаза.
        [{ padIndex: 0 }, { padIndex: 2 }], // 0: Kick + Ride
        [],
        [],
        [],
        [{ padIndex: 1 }],                  // 4: Snare
        [],
        [],
        [],
        [{ padIndex: 0 }, { padIndex: 2 }], // 8: Kick + Ride
        [],
        [],
        [],
        [{ padIndex: 1 }],                  // 12: Snare
        [],
        [],
        []
    ],
};

/**
 * Воспроизводит событие: playSound и визуально подсвечивает пэд.
 */
function triggerEvent(event) {
    if (typeof event.padIndex !== 'undefined') {
        const pad = padMap[event.padIndex];
        if (pad && pad.sound) {
            playSound(pad.sound);
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

// Глобальные переменные для ритмической схемы
let intervalId = null;
let currentStep = 0;
let currentPattern = null;
let currentPatternName = '';
let currentBpm = 0;

/**
 * Запускает выбранную схему с заданным BPM.
 * Интервал для каждого шага (16th): 60000 / (bpm * 4).
 *
 * @param {number} bpm - Темп в ударах в минуту.
 * @param {string} patternName - Имя схемы (например, 'house', 'swing', 'bebop' и т.д.).
 */
export function startRhythm(bpm, patternName) {
    if (!patterns[patternName]) {
        console.warn(`Нет такой схемы: ${patternName}`);
        return;
    }
    stopRhythm(); // останавливаем предыдущую схему, если была

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
 * Останавливает воспроизведение текущего паттерна.
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
 * Обновляет BPM текущей схемы (останавливает и запускает заново).
 *
 * @param {number} newBpm - Новый BPM.
 */
export function updateRhythm(newBpm) {
    if (currentPattern && currentPatternName) {
        console.log(`Обновление ритма до BPM = ${newBpm}`);
        startRhythm(newBpm, currentPatternName);
    }
}
