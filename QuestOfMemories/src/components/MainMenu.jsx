import React from "react";

// Components Imports
import SoundBtn from "./SoundMute";
import Help from "./Help";
import FullscreenBtn from "./Fullscreen";

const BackgroundChanger = ({ start }) => {
    return (
        <div>
            <div id="mainMenu" className="flex flex-col gap-3">
                <button
                    className="startBtn gameboy transition-transform duration-200 hover:scale-105"
                    onClick={start}
                >
                    START ADVENTURE
                </button>
                <div className="flex flex-row gap-5 justify-center">
                    <SoundBtn />
                    <Help />
                    <FullscreenBtn />
                </div>
            </div>
        </div>
    );
};

export default BackgroundChanger;
