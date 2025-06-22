import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { soundMutedAtom } from "../js/gameManager";
import { updateVolumeOrMute } from "../js/soundManager";

const SoundBtn = () => {
    const [isMuted, setIsMuted] = useAtom(soundMutedAtom);

    const handleSound = () => {
        setIsMuted((prev) => !prev);
    };

    useEffect(() => {
        updateVolumeOrMute();
    }, [isMuted]);

    return (
        <button onClick={handleSound} className="cursor-pointer">
            <img
                src={
                    isMuted
                        ? "/assets/buttons/mute.png"
                        : "/assets/buttons/sound.png"
                }
                className="w-full h-6 sm:h-8 md:h-10 lg:h-12"
            />
        </button>
    );
};

export default SoundBtn;
