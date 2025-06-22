import { useAtom } from "jotai";
import React, { useState, useEffect, useRef } from "react";
import {
    store,
    activityDoing,
    usingUI,
    activityInteractionAtom,
    playerAtom,
    activityGardening,
    activityMining,
    activityMenuPopUpAtom,
    inventoryAtom,
    activityDoneAtom,
} from "../js/gameManager";
import itemData from "../js/itemData";

const DoingActivity = ({ location }) => {
    const [player, setPlayer] = useAtom(playerAtom);
    const [activityCount, setActivityCount] = useAtom(activityDoneAtom);
    const [doingActivity, setDoingActivity] = useAtom(activityDoing);
    const [gardening, setGardening] = useAtom(activityGardening);
    const [mining, setMining] = useAtom(activityMining);
    const [didGardening, setDidGardening] = useState(false);
    const [didMining, setDidMining] = useState(false);
    const [activityText, setActivityText] = useState("Doing Activity");
    const [itemChoosen, setItemChoosen] = useState(null);
    const [itemGet, setItemGet] = useState(false);
    const [fastForward, setFastForward] = useState(false);
    const [errorText, setErrorText] = useState("");
    const audioRef = useRef(null);
    const [showEffectImage, setShowEffectImage] = useState(false);
    const effectRef = useRef(null);
    const timeoutRef = useRef();

    const checkFastForward = () => {
        return fastForward;
    };

    const closeActivity = () => {
        store.set(activityMenuPopUpAtom, true);
        setErrorText("");
        setGardening(false);
        setMining(false);
    };

    const closeItemGet = () => {
        setDidGardening(false);
        setDidMining(false);
        store.set(activityInteractionAtom, false);
        store.set(usingUI, false);
    };

    useEffect(() => {
        if (!doingActivity || !location.effect) return;

        if (location.soundEffect !== undefined) {
            if (location.soundEffect.endsWith(".mp3")) {
                const newAudio = new Audio(location.soundEffect);
                newAudio.loop = true;
                newAudio.play();
                audioRef.current = newAudio;
            }
        }
        if (location.effect.match(/\.(gif)$/)) {
            setShowEffectImage(true);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
            setShowEffectImage(false);
        };
    }, [doingActivity]);

    const pickSeed = (item) => {
        let inventory = store.get(inventoryAtom);
        let found = 0;

        for (const playerItem of inventory) {
            if (item.name === playerItem.name) found = 1;
        }

        if (!found) {
            setErrorText("Seed not found!");
            return;
        }

        setGardening(false);
        setItemChoosen(item);
        setDidGardening(true);
        setDoingActivity(true);
        setErrorText("");
    };

    const pickMineral = (item) => {
        setMining(false);
        setItemChoosen(item);
        setDidMining(true);
        setDoingActivity(true);
    };

    const doActivity = async () => {
        await new Promise((resolve) => {
            timeoutRef.current = setTimeout(() => {
                resolve();
            }, 1000 * location.time);
        });

        if (checkFastForward()) {
            setFastForward(false);
            return;
        }

        for (let i = 0; i < location.stats.length; i++) {
            switch (location.stats[i]) {
                case "hunger":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            hunger: prev.hunger + location.increment[i],
                        };
                    });
                    break;
                case "energy":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            energy: prev.energy + location.increment[i],
                        };
                    });
                    break;
                case "experience":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            experience: prev.experience + location.increment[i],
                        };
                    });
                    break;
                case "happiness":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            happiness: prev.happiness + location.increment[i],
                        };
                    });
                    break;
                case "coins":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            coins: prev.coins + location.increment[i],
                        };
                    });
                    break;
            }
        }

        let inventory = store.get(inventoryAtom);
        if (didGardening) {
            let itemName;
            if (itemChoosen.name === "Seed of Flower Glass") {
                itemName = "GlassShard";
            } else itemName = itemChoosen.name.split(" ")[0];

            for (const item of inventory) {
                if (item.name === itemChoosen.name) item.count--;
            }

            let found = 0;
            for (const item of inventory) {
                if (item.name === itemName || item.type === "shard1") {
                    item.count++;
                    found = 1;
                }
            }

            if (!found) {
                inventory.push({
                    ...itemData[itemName],
                    count: 1,
                });
            }

            setItemChoosen(itemData[itemName]);
            inventory = inventory.filter((element) => element.count !== 0);
            store.set(inventoryAtom, inventory);
        } else if (didMining) {
            let found = 0;
            for (const item of inventory) {
                if (item.name === itemChoosen.name) {
                    item.count++;
                    found = 1;
                }
            }

            if (!found) {
                inventory.push({ ...itemChoosen, count: 1 });
            }

            store.set(inventoryAtom, inventory);
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setShowEffectImage(false);

        setDoingActivity(false);

        if (didMining || didGardening) {
            setItemGet(true);
            return;
        }

        store.set(activityInteractionAtom, false);
        store.set(usingUI, false);
    };

    const fastForwardActivity = () => {
        setFastForward(true);
        clearTimeout(timeoutRef.current);

        for (let i = 0; i < location.stats.length; i++) {
            switch (location.stats[i]) {
                case "hunger":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            hunger: prev.hunger + location.increment[i],
                        };
                    });
                    break;
                case "energy":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            energy: prev.energy + location.increment[i],
                        };
                    });
                    break;
                case "experience":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            experience: prev.experience + location.increment[i],
                        };
                    });
                    break;
                case "happiness":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            happiness: prev.happiness + location.increment[i],
                        };
                    });
                    break;
                case "coins":
                    setPlayer((prev) => {
                        return {
                            ...prev,
                            coins: prev.coins + location.increment[i],
                        };
                    });
                    break;
            }
        }

        let inventory = store.get(inventoryAtom);
        if (didGardening) {
            let itemName;
            if (itemChoosen.name === "Seed of Flower Glass")
                itemName = "GlassShard";
            else itemName = itemChoosen.name.split(" ")[0];

            for (const item of inventory) {
                if (item.name === itemChoosen.name) item.count--;
            }

            let found = 0;
            for (const item of inventory) {
                if (item.name === itemName || item.type === "shard1") {
                    item.count++;
                    found = 1;
                }
            }

            if (!found) {
                inventory.push({
                    ...itemData[itemName],
                    count: 1,
                });
            }

            setItemChoosen(itemData[itemName]);
            inventory = inventory.filter((element) => element.count !== 0);
            store.set(inventoryAtom, inventory);
        } else if (didMining) {
            let found = 0;
            for (const item of inventory) {
                if (item.name === itemChoosen.name) {
                    item.count++;
                    found = 1;
                }
            }

            if (!found) {
                inventory.push({ ...itemChoosen, count: 1 });
            }

            store.set(inventoryAtom, inventory);
        }

        setDoingActivity(false);

        if (didMining || didGardening) {
            setItemGet(true);
            return;
        }

        store.set(activityInteractionAtom, false);
        store.set(usingUI, false);
    };

    const changeActivityText = async () => {
        const textState = [
            "Doing Activity",
            "Doing Activity.",
            "Doing Activity..",
            "Doing Activity...",
        ];

        let i = 0;
        while (doingActivity) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    setActivityText(textState[i]);
                    resolve();
                }, 500);
            });
            i = (i + 1) % textState.length;
        }

        setActivityText(textState[0]);
    };

    useEffect(() => {
        if (!doingActivity) return;
        changeActivityText();
        doActivity();
        setActivityCount((prev) => prev + 1);
    }, [doingActivity]);

    return (
        <>
            {gardening && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#85ce3b] p-6 rounded-lg h-auto max-w-md relative border-[#483816] border-4 shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-[#483816] hover:text-black cursor-pointer"
                            onClick={closeActivity}
                        >
                            ×
                        </button>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <h1 className="gameboy hover:text-[#5a4c31]">
                                Gardening
                            </h1>
                            <hr />
                            <p>Choose a seed to plant</p>
                            <div className="flex flex-row gap-2">
                                {location.choose.map((item, index) => (
                                    <div
                                        className="flex flex-col justify-center items-center"
                                        key={index}
                                        onClick={() => pickSeed(itemData[item])}
                                    >
                                        <img
                                            className="cursor-pointer hover:scale-105"
                                            src={itemData[item].imageURL}
                                        />
                                        <p className="text-sm text-center">
                                            {itemData[item].name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p style={{ color: "red" }}>{errorText}</p>
                        </div>
                    </div>
                </div>
            )}
            {mining && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#b32f2fd7] p-6 rounded-lg w-[250px] h-auto max-w-md relative shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-[#ffab1b] hover:text-black cursor-pointer"
                            onClick={closeActivity}
                        >
                            ×
                        </button>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <h1 className="gameboy text-[#fea520] text-lg">
                                Mining
                            </h1>
                            <hr />
                            <p className="gameboy text-center text-sm text-white">
                                Choose an item to mine
                            </p>
                            <div className="flex flex-row gap-2">
                                {location.choose.map((item, index) => (
                                    <div
                                        className="flex flex-col justify-center items-center"
                                        key={index}
                                        onClick={() =>
                                            pickMineral(itemData[item])
                                        }
                                    >
                                        <img
                                            className="cursor-pointer hover:scale-105"
                                            src={itemData[item].imageURL}
                                        />
                                        <p className="text-sm text-center text-white">
                                            {itemData[item].name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {doingActivity && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content p-2 bg-[#ffffff51] rounded-lg w-[200px] h-auto max-w-md relative shadow-lg">
                        <div className="flex flex-col justify-center items-center gap-2">
                            {!gardening && !mining && (
                                <>
                                    <h1 style={{ textAlign: "center" }}>
                                        {activityText}
                                    </h1>
                                    {showEffectImage && (
                                        <img
                                            ref={effectRef}
                                            src={location.effect}
                                            alt="Activity Effect"
                                            className="w-full h-28 animate-float"
                                        />
                                    )}
                                    <button
                                        className="bg-green-500 rounded-md p-1 cursor-pointer"
                                        onClick={fastForwardActivity}
                                    >
                                        Fast Forward
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {itemGet && didGardening && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#85ce3b] p-6 rounded-lg h-auto max-w-md relative border-[#483816] border-4 shadow-lg">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <img
                                className="w-16 h-auto"
                                src={itemChoosen.imageURL}
                                alt={itemChoosen.name}
                            />
                            <p>{`${itemChoosen.name} Harvested`}</p>
                            <button
                                className="bg-red-600 text-white p-2 rounded-md"
                                onClick={closeItemGet}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {itemGet && didMining && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#b32f2fd7] p-6 rounded-lg h-auto max-w-md relative shadow-lg">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <img
                                className="w-16 h-auto"
                                src={itemChoosen.imageURL}
                                alt={itemChoosen.name}
                            />
                            <p>{`${itemChoosen.name} Mined`}</p>
                            <button
                                className="bg-black text-white p-2 rounded-md"
                                onClick={closeItemGet}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoingActivity;
