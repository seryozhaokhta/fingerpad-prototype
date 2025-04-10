export function playSound(url) {
    const audio = new Audio(url);
    audio.currentTime = 0;
    audio.play();
}
