import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import cutscenes from "./../js/cutscenes";
import SoundBtn from "./../components/SoundMute";
import Help from "./../components/Help";
import FullscreenBtn from "./../components/Fullscreen";
import "./../css/homepage.css";

const Intro = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [startTransition, setStartTransition] = useState(false);
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const isFinalScreen = currentIndex === cutscenes.length;

    useEffect(() => {
        const currentText = cutscenes[currentIndex]?.text || "";
        let index = 0;
        setTypedText("");
        const typingInterval = setInterval(() => {
            if (index <= currentText.length) {
                setTypedText(currentText.slice(0, index));
                index++;
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                }
            } else {
                clearInterval(typingInterval);
            }
        }, 30);

        return () => clearInterval(typingInterval);
    }, [currentIndex]);

    useEffect(() => {
        if (isFinalScreen) return;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 10000);

        return () => clearTimeout(timer);
    }, [currentIndex, isFinalScreen]);

    if (currentIndex > cutscenes.length) return null;

    if (isFinalScreen) {
        return (
            <div
                className={`flex items-center justify-center w-full h-screen bg-black text-white text-2xl cursor-pointer intro 
        transition-opacity duration-1000 ${
            startTransition ? "fade-out" : ""
        } hover:text-[#eed262] active:text-[#eed262]`}
                onClick={() => {
                    setStartTransition(true);
                    setTimeout(() => {
                        navigate("/Main");
                    }, 1000);
                }}
            >
                Your next adventure begins now
            </div>
        );
    }

    const { imageURL } = cutscenes[currentIndex];

    return (
        <div
            style={{
                backgroundImage: `url('${imageURL}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                position: "relative",
                height: "100dvh",
                width: "100dvw",
                translateY: "20%",
            }}
        >
            <audio
                ref={audioRef}
                src="/assets/effect/typewriter.mp3"
                preload="auto"
            />
            <div className="absolute flex flex-row gap-3 left-5 top-1.5">
                <FullscreenBtn />
                <SoundBtn />
                <Help />
            </div>
            <div className="intro absolute bottom-0 text-center w-full text-white p-10 text-xl bg-[#00000099]">
                {typedText}
            </div>

            <button
                className="intro absolute bottom-4 right-4 text-white cursor-pointer"
                onClick={() =>
                    setCurrentIndex((prev) =>
                        prev < cutscenes.length ? prev + 1 : prev
                    )
                }
            >
                Next
            </button>
        </div>
    );
};

export default Intro;
