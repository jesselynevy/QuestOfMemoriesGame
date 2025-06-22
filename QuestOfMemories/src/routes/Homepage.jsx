import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { playerUsernameAtom, store, soundMutedAtom, soundVolumeAtom } from "./../js/gameManager";
// CSS Imports
import "./../css/homepage.css";

// Components Imports
import MainMenu from "../components/MainMenu";
import CharacterSelection from "../components/CharacterSelection";

const Homepage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [characterSelection, setCharacterSelection] = useState(false);
    const [backgroundImg, setBackgroundImg] = useState("");
    const [isMuted] = useAtom(soundMutedAtom);
    const [volume] = useAtom(soundVolumeAtom);
    const [bgAudio] = useState(() => new Audio("/assets/bgSound/homeSound.mp3"));

    const hasShownAlertRef = React.useRef(false);

    useEffect(() => {
        if (location.state?.showAlert && !hasShownAlertRef.current) {
            hasShownAlertRef.current = true;
            alert("Please refresh the page.");
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        bgAudio.loop = true;
        bgAudio.volume = isMuted ? 0 : volume;
        if (!isMuted) {
            bgAudio.play().catch((e) => console.warn("Autoplay blocked:", e));
        }

        return () => {
            bgAudio.pause();
            bgAudio.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        // When mute toggled
        bgAudio.volume = isMuted ? 0 : volume;
        if (isMuted) {
            bgAudio.pause();
        } else {
            bgAudio.play().catch((e) => console.warn("Autoplay blocked:", e));
        }
    }, [isMuted, volume]);

    useEffect(() => {
        const updateBackground = () => {
            const hour = new Date().getHours();
            if (hour >= 4 && hour <= 9) {
                setBackgroundImg("/assets/backgrounds/morningBg.png");
            } else if (hour >= 10 && hour <= 14) {
                setBackgroundImg("/assets/backgrounds/dayBg.png");
            } else if (hour >= 15 && hour <= 18) {
                setBackgroundImg("/assets/backgrounds/afternoonBg.png");
            } else {
                setBackgroundImg("/assets/backgrounds/nightBg.png");
            }
        };

        updateBackground();
        const interval = setInterval(updateBackground, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const gameElement = document.querySelector("#game");
        if (gameElement) {
            gameElement.setAttribute("hidden", true);
        }
    }, []);

    const startGame = () => {
        const input = document.querySelector("#username");
        const error = document.querySelector("#errorMessage");
        if (input.value.length < 8 || input.value.length > 16) {
            error.textContent =
                "Please enter a username with at least 8 - 16 characters long.";
            return;
        }

        error.textContent = "";
        store.set(playerUsernameAtom, input.value);
        navigate("/Intro");
    };

    const handleCharacterSelectionClick = () => {
        setCharacterSelection(
            (prevCharacterSelection) => !prevCharacterSelection
        );
    };

    return (
        <>
            <div
                style={{
                    backgroundImage: `url('${backgroundImg}')`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    position: "relative",
                    height: "100dvh",
                    width: "100dvw",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    translateY: "20%",
                }}
            >
                {!characterSelection && (
                    <div className="title flex justify-start items-start sm:mb-5 md:mb-7 lg:mb-10">
                        <img
                            id="title"
                            src="/assets/title.png"
                            className="max-w-xs lg:max-w-md animate-float"
                            alt="Game Title"
                        />
                    </div>
                )}
                {!characterSelection && (
                    <MainMenu start={handleCharacterSelectionClick} />
                )}
                {characterSelection && (
                    <CharacterSelection
                        backToMainMenu={handleCharacterSelectionClick}
                        startGame={startGame}
                    />
                )}
            </div>
        </>
    );
};

export default Homepage;
