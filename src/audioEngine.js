// Забираем Howl из глобального объекта window
const { Howl } = window;

const soundCache = new Map();

/**
 * Воспроизводит звук по заданному URL.
 * При первом вызове создаётся Howl и кэшируется,
 * далее - переиспользуется, чтобы снизить задержки.
 */
export function playSound(url) {
    let sound = soundCache.get(url);
    if (!sound) {
        sound = new Howl({
            src: [url],
            preload: true,
            html5: true, // чтобы снизить задержку на iOS
            // pool: 5,   // если хотим многократно накладывать один и тот же звук
        });
        soundCache.set(url, sound);
    }
    sound.play();
}
