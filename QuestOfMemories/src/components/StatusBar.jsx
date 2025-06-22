import React, { useState, useEffect } from "react";
import "./../css/statusOverlay.css";
import { useAtom, useAtomValue } from "jotai";
import {
    playerAtom,
    playerDiedAtom,
    playerUsernameAtom,
    store,
} from "./../js/gameManager";
import { useNavigate } from "react-router-dom";

const Status = () => {
    const navigate = useNavigate();
    const [player, setPlayer] = useAtom(playerAtom);
    const username = useAtomValue(playerUsernameAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [statusBar, setStatusBar] = useState({
        hunger: "/assets/StatusBar/innerbar.png",
        happiness: "/assets/StatusBar/innerbar.png",
        energy: "/assets/StatusBar/innerbar.png",
        experience: "/assets/StatusBar/innerbar.png",
    });
    const [statusBarWidth, setStatusBarWidth] = useState({
        hunger: Math.ceil((player.hunger * 90) / 100),
        happiness: Math.ceil((player.happiness * 90) / 100),
        energy: Math.ceil((player.energy * 90) / 100),
        experience: Math.ceil((player.experience * 90) / 100),
    });

    const statusOverlay = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const statusInterval = setInterval(() => {
            setPlayer((prev) => {
                return {
                    ...prev,
                    hunger: prev.hunger - 2,
                    happiness: prev.happiness - 2,
                    energy: prev.energy - 2,
                    experience: prev.experience - 2,
                };
            });
        }, 10000);

        for (const stats in player) {
            if (player[stats] > 100 && stats !== "coins") player[stats] = 100;

            if (player[stats] < 0 && stats !== "coins") player[stats] = 0;
        }

        let zeroCounter = 0;
        let statusBarCopy = { ...statusBar };
        let statusBarWidthCopy = { ...statusBarWidth };
        for (const stats in player) {
            if (stats === "coins") continue;

            if (player[stats] <= 0) {
                zeroCounter++;
            }

            const balanced = Math.ceil((player[stats] * 90) / 100);

            if (balanced <= 20)
                statusBarCopy[stats] = "/assets/StatusBar/low.png";
            else if (balanced <= 45)
                statusBarCopy[stats] = "/assets/StatusBar/half.png";
            else statusBarCopy[stats] = "/assets/StatusBar/innerbar.png";

            statusBarWidthCopy[stats] = balanced;
        }

        if (zeroCounter >= 2) {
            store.set(playerDiedAtom, true);
            navigate("/GameOver");
        }

        setStatusBar(statusBarCopy);
        setStatusBarWidth(statusBarWidthCopy);

        return () => clearInterval(statusInterval);
    }, [player.hunger, player.happiness, player.energy, player.experience]);

    return (
        <>
            <div>
                <button onClick={statusOverlay} className="cursor-pointer">
                    <img
                        src="/assets/buttons/status.png"
                        className="w-full h-6 sm:h-8 md:h-10 lg:h-12 hover:scale-105"
                    />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-2 z-50 text-white">
                        <div className="relative status-content bg-[rgba(55,65,81,0.8)] p-4 lg:p-6 rounded-lg max-w-sm lg:max-w-md shadow-lg">
                            <button
                                className="textbox absolute top-2 right-3 text-xl font-bold text-white hover:text-black active:text-black cursor-pointer"
                                onClick={statusOverlay}
                            >
                                ×
                            </button>
                            <h2 className="text-sm lg:text-xl font-bold mb-1 text-center">
                                {`${username} Status`}
                            </h2>
                            <p className="text-xs lg:text-md font-bold mb-2 text-center textbox">
                                Don't forget to take care of yourself
                            </p>

                            <ul className="list-inside flex flex-col justify-center text-xs lg:text-sm space-y-2">
                                <li>
                                    <h4 className="textbox">Energy</h4>
                                    <div className="relative w-[200px] h-[25px]">
                                        <img
                                            src="/assets/StatusBar/outerbar.png"
                                            className="absolute top-0 left-0 w-full h-full z-10"
                                        />
                                        <img
                                            src={statusBar.energy}
                                            className="absolute top-0 left-2.5 h-[20px] z-0"
                                            style={{
                                                width: `${statusBarWidth.energy}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <h4 className="textbox">Hunger</h4>
                                    <div className="relative w-[200px] h-[25px]">
                                        <img
                                            src="/assets/StatusBar/outerbar.png"
                                            className="absolute top-0 left-0 w-full h-full z-10"
                                        />
                                        <img
                                            src={statusBar.hunger}
                                            className="absolute top-0 left-2.5 h-[20px] z-0"
                                            style={{
                                                width: `${statusBarWidth.hunger}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <h4 className="textbox">Happiness</h4>
                                    <div className="relative w-[200px] h-[25px]">
                                        <img
                                            src="/assets/StatusBar/outerbar.png"
                                            className="absolute top-0 left-0 w-full h-full z-10"
                                        />
                                        <img
                                            src={statusBar.happiness}
                                            className="absolute top-0 left-2.5 h-[20px] z-0"
                                            style={{
                                                width: `${statusBarWidth.happiness}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <h4 className="textbox">Experience</h4>
                                    <div className="relative w-[200px] h-[25px]">
                                        <img
                                            src="/assets/StatusBar/outerbar.png"
                                            className="absolute top-0 left-0 w-full h-full z-10"
                                        />
                                        <img
                                            src={statusBar.experience}
                                            className="absolute top-0 left-2.5 h-[20px] z-0"
                                            style={{
                                                width: `${statusBarWidth.experience}%`,
                                            }}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Status;
