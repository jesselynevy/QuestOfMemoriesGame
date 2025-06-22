import React, { useState } from "react";
import {
    store,
    inventoryAtom,
    usingUI,
    playerAtom,
    itemUsedAtom,
    playerUsernameAtom,
} from "./../js/gameManager";
import { player as playerAnim, playEatAnimation } from "../js/entities/player";
import { useAtom, useAtomValue } from "jotai";

const Inventory = () => {
    const [player, setPlayer] = useAtom(playerAtom);
    const [itemUseCount, setItemUseCount] = useAtom(itemUsedAtom);
    const inventory = useAtomValue(inventoryAtom);
    const [isClickInventory, setIsClickInventory] = useState(false);
    const [isClickItem, setIsClickItem] = useState(false);
    const [item, setItem] = useState(null);
    const [letterView, setLetterView] = useState(false);

    const handleClickInventory = () => {
        const ui = store.get(usingUI);
        store.set(usingUI, !ui);
        setIsClickInventory((prev) => !prev);
    };

    const handleClickItem = (item = null) => {
        setItem(item);
        setIsClickItem((prev) => !prev);
    };

    const useItem = (item) => {
        if (item.name === "Letter") {
            setIsClickItem(false);
            setIsClickInventory(false);
            setLetterView(true);
            return;
        }

        setIsClickItem(false);
        setIsClickInventory(false);
        store.set(usingUI, false);
        const sfx = new Audio("/assets/effect/useItemSfx.mp3");
        sfx.play();
        playEatAnimation(playerAnim);
        const updatedInventory = inventory
            .map((element) => {
                if (element.name === item.name) element.count--;
                return element;
            })
            .filter((element) => {
                if (element.count === 0) setIsClickItem();
                return element.count !== 0;
            });

        let playerStatsCopy;
        switch (item.type) {
            case "hunger":
                playerStatsCopy = {
                    ...player,
                    hunger: player.hunger + item.stats,
                };
                break;
            case "happiness":
                playerStatsCopy = {
                    ...player,
                    happiness: player.happiness + item.stats,
                };
                break;
            case "energy":
                playerStatsCopy = {
                    ...player,
                    energy: player.energy + item.stats,
                };
                break;
            case "experience":
                playerStatsCopy = {
                    ...player,
                    experience: player.experience + item.stats,
                };
                break;
        }

        setItemUseCount((prev) => prev + 1);
        setPlayer(playerStatsCopy);
        store.set(inventoryAtom, updatedInventory);
    };

    return (
        <>
            <button className="cursor-pointer">
                <img
                    id="backpackInventory"
                    onClick={handleClickInventory}
                    src="/assets/buttons/inventory.png"
                    alt="Backpack Icon"
                    className="w-full h-6 sm:h-8 md:h-10 lg:h-12 hover:scale-105 mb-2"
                />
            </button>
            {isClickInventory && (
                <div className="fixed inset-0 flex justify-center items-center z-25 textbox">
                    <div className="help-content bg-[#482508e7] p-5 rounded-lg relative max-w-md shadow-lg border-2 border-[#ffa600]">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-[#ffa600] hover:text-white cursor-pointer"
                            onClick={handleClickInventory}
                        >
                            ×
                        </button>
                        <h1 className="text-center gameboy text-[#ffa600]">
                            Inventory
                        </h1>
                        <hr className="mb-2 border-[#ffa600]" />
                        <div className="overflow-auto sm:w-sm h-auto max-h-[300px]">
                            <div className="flex flex-wrap justify-center gap-2 sm:w-sm">
                                {inventory.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col justify-center items-center border-2 border-[#ffa600] rounded-md w-14 h-14 lg:w-16 lg:h-16 cursor-pointer"
                                        onClick={() => handleClickItem(item)}
                                    >
                                        <img
                                            src={item.imageURL}
                                            alt={item.name}
                                            className="self-center object-contain w-full md:h-8 lg:h-10"
                                        />
                                        <p className="text-center text-sm text-[#fe0]">
                                            {item.count > 1
                                                ? item.count + "x"
                                                : " "}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isClickItem && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#ffb515fd] p-5 rounded-xl max-w-sm relative shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-black-600 hover:text-white cursor-pointer"
                            onClick={handleClickItem}
                        >
                            ×
                        </button>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-center">{item.name}</h1>
                            <img
                                src={item.imageURL}
                                alt={item.name}
                                className="w-12 lg:w-14"
                            />
                            <p className="text-center">
                                {item.count > 1 ? item.count + "x" : " "}
                            </p>
                            {(item.type === "hunger" ||
                                item.type === "experience" ||
                                item.type === "happiness" ||
                                item.type === "energy") && (
                                <p className="text-center">{`+${item.stats} ${item.type}`}</p>
                            )}
                            <p className="text-center">{item.info}</p>
                            {(item.type === "hunger" ||
                                item.type === "experience" ||
                                item.type === "happiness" ||
                                item.type === "energy" ||
                                item.type === "letter") && (
                                <button
                                    className="bg-green-500 rounded-lg p-1 cursor-pointer"
                                    onClick={() => useItem(item)}
                                >
                                    Use Item
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {letterView && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#d36e16] border-[#492505] border-8 p-5 rounded-xl max-w-md relative shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-black-600 hover:text-white cursor-pointer"
                            onClick={() => {
                                setLetterView(false);
                                store.set(usingUI, false);
                            }}
                        >
                            ×
                        </button>
                        <h1>{`Dear ${store.get(playerUsernameAtom)}`}</h1>
                        <p>
                            All of my shards are scattered across the world, and
                            I need your help to piece it all back together. Here
                            are some hints to help ease your search of each
                            shard:
                        </p>
                        <hr />
                        <ol>
                            <li>
                                1. There is a shop in the volcano, I heard the
                                merchant sells a special seed of your needs.
                            </li>
                            <li>
                                2. A piece of me is lost somewhere in the snowy
                                field, keep exploring it and you might stumble
                                upon it.
                            </li>
                            <li>
                                3. Someone in the tavern has what you need, but
                                you probably need something to exchange it with.
                            </li>
                            <li>
                                4. Many monsters lies within the cave, hunt them
                                down and maybe if you are lucky. One shall drop
                                a piece of me.
                            </li>
                        </ol>
                        <hr />
                        <p>
                            That is all I know to help you, find every piece of
                            me! But don't forget to have fun and explore the
                            world in its entirity
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Inventory;
