import { Howl } from 'https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.core.js';

const soundCache = new Map();

/**
 * Воспроизводит звук по заданному URL.
 * При первом вызове создаёт Howl-объект и кэширует его,
 * а затем при последующих вызовах переиспользует его.
 *
 * @param {string} url – URL аудиофайла.
 */
export function playSound(url) {
    let sound = soundCache.get(url);
    if (!sound) {
        sound = new Howl({
            src: [url],
            preload: true,
            // HTML5 Audio помогает снизить задержки на мобильных устройствах (особенно в iOS)
            html5: true,
            // Пул звука (опционально) – если хотите одновременное воспроизведение одного и того же звука без прерывания:
            // pool: 5
        });
        soundCache.set(url, sound);
    }
    sound.play();
}
