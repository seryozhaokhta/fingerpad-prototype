let bpm = 90;
let intervalId;
const clickSound = new Audio('../public/sounds/metronome_soft.wav');

export function startMetronome(newBpm) {
    stopMetronome();
    bpm = newBpm;
    const interval = 60000 / bpm;
    intervalId = setInterval(() => {
        clickSound.currentTime = 0;
        clickSound.play();
    }, interval);
}

export function stopMetronome() {
    clearInterval(intervalId);
}

export function getCurrentBpm() {
    return bpm;
}
