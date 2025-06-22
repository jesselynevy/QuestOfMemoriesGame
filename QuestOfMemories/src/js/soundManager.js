import { store } from "./gameManager"; 
import { soundMutedAtom, soundVolumeAtom } from "./gameManager"; 

let currentAudio = null;

export function playSceneMusic(src) {
    const isMuted = store.get(soundMutedAtom);
    const volume = store.get(soundVolumeAtom) ?? 0.15;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(src);
    currentAudio.loop = true;
    currentAudio.volume = isMuted ? 0 : volume;

    if (!isMuted) {
        currentAudio.play().catch((e) => {
            console.warn("Audio blocked or failed to play:", e);
        });
    }
}

export function stopSceneMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

export function updateVolumeOrMute() {
    if (currentAudio) {
        const isMuted = store.get(soundMutedAtom);
        const volume = store.get(soundVolumeAtom) ?? 0.15;
        currentAudio.volume = isMuted ? 0 : volume;
        if (isMuted) {
            currentAudio.pause();
        } else {
            currentAudio.play().catch(() => {});
        }
    }
}
