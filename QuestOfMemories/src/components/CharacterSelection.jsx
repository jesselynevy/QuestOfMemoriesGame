import React, { useState } from "react";
import { choosenCharacterAtom, store } from "../js/gameManager";
import SoundBtn from "./SoundMute";
import Help from "./Help";
import FullscreenBtn from "./Fullscreen";

const characterInfo = [
    {
        name: "Finn",
        title: "Finn the Human",
        imageUrl: "/assets/legacy/finn_legacy.png",
        color: "#1080c2",
        backstory:
            "Finn is the last known human in the Land of Ooo. As a baby, he was abandoned in the woods and adopted by Jake's parents, Joshua and Margaret. Growing up, Finn developed a strong sense of heroism and a desire to protect the innocent. Over time, he becomes one of Ooo’s greatest adventurers and heroes.",
    },
    {
        name: "Jake",
        title: "Jake the Dog",
        imageUrl: "/assets/legacy/jake_legacy.png",
        color: "#fbbe08",
        backstory:
            "Jake is a magical dog with stretchy powers, the result of being exposed to a magic creature in utero. He was raised by Joshua and Margaret alongside Finn, becoming his adoptive brother and best friend. Jake is easygoing, loves playing music, and often acts as Finn's partner in adventure.",
    },
    {
        name: "PrincessBubblegum",
        title: "Princess Bubblegum",
        imageUrl: "/assets/legacy/princess-bubblegum_legacy.png",
        color: "#EC407A",
        backstory:
            "Princess Bubblegum is made entirely of candy biomass and rules the Candy Kingdom. She’s highly intelligent, scientific, and morally complex — sometimes making ruthless decisions for the greater good. Over a thousand years old, she’s a survivor of the Mushroom War, which devastated the world before the events of Adventure Time.",
    },
    {
        name: "Marceline",
        title: "Marceline the Vampire",
        imageUrl: "/assets/legacy/marceline_legacy.png",
        color: "#7E57C2",
        backstory:
            "Marceline is a thousand-year-old vampire and rock musician. Originally a human girl who survived the Mushroom War as a child, she was turned into a vampire later in life. She has a tumultuous relationship with her father, Hunson Abadeer (the ruler of the Nightosphere), and a long, rich history in Ooo.",
    },
    {
        name: "IceKing",
        title: "Ice King",
        imageUrl: "/assets/legacy/ice-king_legacy.png",
        color: "#3724c7",
        backstory:
            "Once an ordinary antiquarian named Simon Petrikov, he found a magical crown that granted him ice powers but slowly corrupted his mind and memory. As the Ice King, he became a lonely, misunderstood villain obsessed with kidnapping princesses, though he’s more pitiable than evil.!",
    },
];

const CharacterSelection = ({ backToMainMenu, startGame }) => {
    const [preview, setPreview] = useState(0);

    const nextCharacter = () => {
        setPreview((prev) => {
            const next = (prev + 1) % characterInfo.length;
            store.set(choosenCharacterAtom, characterInfo[next].name);
            return next;
        });
    };

    const prevCharacter = () => {
        setPreview((prev) => {
            const previous =
                (prev - 1 + characterInfo.length) % characterInfo.length;
            store.set(choosenCharacterAtom, characterInfo[previous].name);
            return previous;
        });
    };

    return (
        <>
            <div>
                <div className="absolute flex flex-row gap-3 right-4">
                    <SoundBtn />
                    <Help />
                    <FullscreenBtn />
                </div>
                <div className="title flex justify-center lg:mb-7 sm:hidden lg:block lg:ml-9">
                    <img
                        id="title"
                        src="/assets/title.png"
                        className="max-w-3xs lg:max-w-md animate-float"
                        alt="Game Title"
                    />
                </div>
                <div className="flex justify-center items-center gap-6">
                    <button
                        className="w-12 md:w-14 lg:w-16 hover:scale-105 transition-all cursor-pointer"
                        onClick={prevCharacter}
                    >
                        <img
                            src="/assets/buttons/left.png"
                            className="w-full transition-all"
                        />
                    </button>
                    <div className="flex flex-col md:gap-4 gap-2 justify-center items-center max-w-md sm:max-w-sm">
                        <div className="flex flex-col gap-2 justify-center items-center flex-1">
                            <p
                                className="characterName text-center"
                                style={{ color: characterInfo[preview].color }}
                            >
                                {characterInfo[preview].title}
                            </p>
                            <img
                                src={characterInfo[preview].imageUrl}
                                alt={characterInfo[preview].title}
                                className="w-16 md:w-30 lg:w-40 h-auto"
                            />
                            <div className="relative w-[100vw] sm:w-[1000vw] max-w-sm lg:h-40 h-30 overflow-hidden">
                                <img
                                    src="/assets/backgrounds/textbox.png"
                                    alt="Backstory Textbox"
                                    className="absolute inset-0 w-full h-full object-contain z-0"
                                />
                                <div className="absolute inset-0 lg:p-4 px-16 py-2 z-10 flex flex-col">
                                    <div className="scrollbar-hide overflow-y-auto h-full textbox text-black lg:text-lg text-sm leading-relaxed">
                                        {characterInfo[preview].backstory}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center w-full">
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter username..."
                                    required
                                    className="px-5 py-2 bg-[url('/assets/buttons/input.png')] bg-transparent bg-no-repeat bg-contain hover:scale-110 transition-all text-black
                                    focus:outline-none focus:bg-[url('/assets/buttons/input.png')] focus:bg-no-repeat focus:bg-left focus:bg-contain textbox"
                                    autoComplete="off"
                                />
                                <p
                                    id="errorMessage"
                                    className="text-red-600 lg:text-md text-sm textbox text-center"
                                ></p>
                            </div>
                        </div>
                    </div>
                    <button
                        className="w-12 md:w-14 lg:w-16 hover:scale-105 transition-all cursor-pointer"
                        onClick={nextCharacter}
                    >
                        <img
                            src="/assets/buttons/right.png"
                            className="w-full transition-all"
                        />
                    </button>
                </div>
                <div className="flex gap-6 justify-center mt-2 lg:mt-4">
                    <button
                        className="sm:w-24 lg:w-32 hover:scale-105 transition-all cursor-pointer"
                        onClick={backToMainMenu}
                    >
                        <img
                            src="/assets/buttons/back.png"
                            className="w-full transition-all cursor-pointer"
                        />
                    </button>
                    <button
                        className="sm:w-24 lg:w-32 hover:scale-105 transition-all cursor-pointer"
                        onClick={startGame}
                    >
                        <img
                            src="/assets/buttons/start.png"
                            className="w-full transition-all"
                        />
                    </button>
                </div>
            </div>
        </>
    );
};

export default CharacterSelection;
