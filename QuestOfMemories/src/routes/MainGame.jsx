import React, { useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import {
    activityInteractionAtom,
    isTextBoxVisibleAtom,
    playerAtom,
} from "./../js/gameManager";
import {
    mobileAttackTrigger,
    playCollectAnimation,
} from "../js/entities/player";
import initGame from "./../js/initGame";
import AttackButton from "../components/AttackButton";

// CSS Imports
import "./../css/maingame.css";

// Components Imports
import SoundBtn from "./../components/SoundMute";
import Help from "./../components/Help";
import FullscreenBtn from "./../components/Fullscreen";
import MobileControls from "./../components/MobileControl";
import TimeStatus from "./../components/TimeStatus";
import Status from "./../components/StatusBar";
import Inventory from "./../components/Inventory";
import TextBox from "./../components/TextBox";
import ActivityMenu from "./../components/ActivityMenu";

const zoom = 1.5; // match your mapRender zoom

const MainGame = () => {
    const player = useAtomValue(playerAtom);
    const isVisible = useAtomValue(isTextBoxVisibleAtom);
    const [playerScreenPos, setPlayerScreenPos] = useState(null);

    // Door
    const [showButton, setShowButton] = useState(false);
    const [doorPosition, setDoorPosition] = useState(null);
    const [gameInstance, setGameInstance] = useState(null);

    // Item Pickup
    const [showPickupButton, setShowPickupButton] = useState(false);
    const [pickupButtonPos, setPickupButtonPos] = useState(null);
    const [nearbyPickupItem, setNearbyPickupItem] = useState(null);

    // Activity
    const showActivityButton = useAtomValue(activityInteractionAtom);

    const intervalRef = useRef(null);

    useEffect(() => {
        const canvas = document.getElementById("game");
        if (!canvas) return;

        canvas.removeAttribute("hidden");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const game = initGame(canvas, { onItemPickup: handlePickupCleanup });
        setGameInstance(game);

        // Initial go
        game.go("mapRender").then(() => {
            startMonitoring(game);
        });

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            game.go("mapRender").then(() => {
                startMonitoring(game);
            });
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            clearInterval(intervalRef.current);
        };
    }, []);

    const startMonitoring = (game) => {
        clearInterval(intervalRef.current);
        setShowButton(false);
        setDoorPosition(null);

        intervalRef.current = setInterval(() => {
            const currentScene = game.getCurrentSceneInstance?.();
            //door check
            if (currentScene?.getNearbyDoor) {
                const door = currentScene.getNearbyDoor();
                const playerPos = currentScene.getPlayerScreenPosition?.();

                if (door && playerPos) {
                    setShowButton(true);
                    setDoorPosition(door);
                    setPlayerScreenPos(playerPos);
                } else {
                    setShowButton(false);
                    setDoorPosition(null);
                    setPlayerScreenPos(null);
                }
            }
            //pickup item check
            if (
                currentScene?.getNearbyPickupItem &&
                currentScene?.getPickupItemScreenPosition
            ) {
                const item = currentScene.getNearbyPickupItem();
                const pos = currentScene.getPickupItemScreenPosition();
                if (item && pos) {
                    setNearbyPickupItem(item);
                    setPickupButtonPos(pos);
                    setShowPickupButton(true);
                } else {
                    setNearbyPickupItem(null);
                    setPickupButtonPos(null);
                    setShowPickupButton(false);
                }
            }
        }, 100);
    };

    const handleEnter = async () => {
        const currentScene = gameInstance?.getCurrentSceneInstance?.();
        if (currentScene?.enterNearbyDoor) {
            await currentScene.enterNearbyDoor();
            startMonitoring(gameInstance);
        }
    };

    const handlePickupClick = () => {
        const currentScene = gameInstance?.getCurrentSceneInstance?.();
        if (currentScene && nearbyPickupItem) {
            currentScene.pickupItem?.(nearbyPickupItem); // call exposed method in mapRender
            const sfx = new Audio("/assets/effect/collectItemSfx.mp3");
            sfx.play();
            playCollectAnimation(currentScene.player);
            setNearbyPickupItem(null);
            setPickupButtonPos(null);
            setShowPickupButton(false);
        }
    };

    const handlePickupCleanup = () => {
        setNearbyPickupItem(null);
        setPickupButtonPos(null);
        setShowPickupButton(false);
    };

    return (
        <>
            <canvas
                id="game"
                hidden
                style={{ display: "block", pointerEvents: "none" }}
            />
            <div className="ui textbox">
                <div className="absolute flex flex-row gap-3 left-5 top-1.5">
                    <FullscreenBtn />
                    <SoundBtn />
                    <Help />
                </div>
                <div className="absolute flex flex-col justify-center items-center">
                    <TimeStatus />
                    <div className="flex flex-row gap-1">
                        <img src="/assets/coin.png" className="w-4 h-4 mt-1" />
                        <h1 className="text-[#FFD700] text-xl textbox">
                            {player.coins}
                        </h1>
                    </div>
                </div>
                <div className="absolute flex flex-row gap-3 right-5 top-1.5">
                    <Status />
                    <Inventory />
                </div>

                {showButton && doorPosition && (
                    <button
                        onClick={handleEnter}
                        className="absolute text-white bg-[#5c5959b6] text-sm gameboy z-10 border-b-4 cursor-pointer hover:scale-110 hover:text-[#93ff7d] active:text-[#93ff7d]"
                        style={{
                            left: `${playerScreenPos.x * zoom}px`,
                            top: `${playerScreenPos.y * zoom}px`,
                            transform: "translate(-50%, -180%)",
                        }}
                    >
                        Get Inside
                    </button>
                )}
                {showPickupButton && pickupButtonPos && (
                    <button
                        onClick={handlePickupClick}
                        className="absolute text-white bg-[#5c5959b6] text-sm gameboy z-10 border-b-4 cursor-pointer hover:scale-110 hover:text-[#93ff7d] active:text-[#93ff7d]"
                        style={{
                            left: `${pickupButtonPos.x * zoom}px`,
                            top: `${pickupButtonPos.y * zoom}px`,
                            transform: "translate(-50%, -180%)",
                        }}
                    >
                        Pick Up
                    </button>
                )}
                {showActivityButton && (
                    <>
                        <ActivityMenu />
                    </>
                )}
            </div>
            <div className="z-20 absolute inset-x-0 bottom-0 w-[75vw] m-auto">
                <TextBox />
            </div>
            {!isVisible && (
                <>
                    <MobileControls />
                    <AttackButton
                        onAttack={
                            typeof mobileAttackTrigger === "function"
                                ? mobileAttackTrigger
                                : undefined
                        }
                    />
                </>
            )}
        </>
    );
};

export default MainGame;
