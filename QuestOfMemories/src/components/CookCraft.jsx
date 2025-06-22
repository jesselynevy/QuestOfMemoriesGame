import { useAtom } from "jotai";
import React, { useState } from "react";
import {
    activityCookCraftAtom,
    activityMenuPopUpAtom,
    inventoryAtom,
    itemsCookedAtom,
    itemsCraftAtom,
    store,
} from "../js/gameManager";
import itemData from "../js/itemData";

const CookCraft = ({ location }) => {
    const [playerInv, setPlayerInv] = useAtom(inventoryAtom);
    const [cookCraftMenu, setCookCraftMenu] = useAtom(activityCookCraftAtom);
    const [cookCount, setCookCount] = useAtom(itemsCookedAtom);
    const [craftCount, setCraftCount] = useAtom(itemsCraftAtom);
    const [closeUp, setCloseUp] = useState(false);
    const [currItem, setCurrItem] = useState(null);
    const [errorText, setErrorText] = useState("");
    const [inventoryMsg, setInventoryMsg] = useState("");
    const craftSfx = new Audio("/assets/effect/collectItemSfx.mp3");
    const cookSfx = new Audio("/assets/effect/collectItemSfx.mp3");

    const closeCookCraftMenu = () => {
        setCookCraftMenu(false);
        store.set(activityMenuPopUpAtom, true);
    };

    const itemCloseUp = (item = null) => {
        setErrorText("");
        setCloseUp((prev) => !prev);
        setCurrItem(item);
    };

    const craftItem = (item) => {
        const ingredientsNeeded = item.need.length;

        let ingredientsHave = 0;
        for (const itemNeeded of item.need) {
            for (const itemHave of playerInv) {
                if (itemHave.name === itemNeeded) {
                    ingredientsHave++;
                    break;
                }
            }
        }

        if (ingredientsHave === ingredientsNeeded) {
            setInventoryMsg("");
            let inventoryCopy = playerInv;

            for (const itemNeeded of item.need) {
                for (const itemHave of inventoryCopy) {
                    if (itemHave.name === itemNeeded) {
                        itemHave.count--;
                        break;
                    }
                }
            }

            inventoryCopy = inventoryCopy.filter(
                (element) => element.count !== 0
            );

            for (const itemHave of inventoryCopy) {
                if (itemHave.name === item.name) {
                    itemHave.count++;
                    setPlayerInv(inventoryCopy);
                    return;
                }
            }

            if (location.place === "craft") setCraftCount((prev) => prev + 1);
            else setCookCount((prev) => prev + 1);

            setErrorText("Item Successfully Crafted");
            setInventoryMsg("The item is now in your inventory");
            inventoryCopy.push({ ...item, count: 1 });
            setPlayerInv(inventoryCopy);
            if (location.place === "craft") {
                setCraftCount((prev) => prev + 1);
                craftSfx.play();
            } else {
                setCookCount((prev) => prev + 1);
                cookSfx.play();
            }
        } else {
            setErrorText("Insufficient Ingredients");
            setInventoryMsg("");
        }
    };

    return (
        <>
            {cookCraftMenu && (
                <div className="fixed inset-0 flex justify-center items-center z-25 textbox">
                    <div className="help-content bg-[#5a3d0ce7] p-5 border-2 border-[#fe0] rounded-lg relative max-w-md shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-[#fff] hover:text-black cursor-pointer"
                            onClick={closeCookCraftMenu}
                        >
                            ×
                        </button>
                        <h1 className="text-center gameboy text-white">
                            {location.name}
                        </h1>
                        <hr className="mb-2 border-[#fe0]" />
                        <div className="overflow-auto sm:w-sm h-auto max-h-[300px]">
                            <div className="flex flex-wrap justify-center gap-2 sm:w-sm">
                                {Object.entries(itemData).map(
                                    ([, item], index) => {
                                        if (item.act === location.place)
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col justify-center items-center border-2 border-white rounded-md w-14 h-14 lg:w-16 lg:h-16"
                                                    onClick={() =>
                                                        itemCloseUp(item)
                                                    }
                                                >
                                                    <img
                                                        src={item.imageURL}
                                                        alt={item.name}
                                                        className="self-center object-contain w-full h-10 cursor-pointer"
                                                    />
                                                </div>
                                            );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {closeUp && (
                <div className="fixed inset-0 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[#fbc041fd] p-6 rounded-lg max-w-md relative shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-[#3f3110] hover:text-black cursor-pointer"
                            onClick={itemCloseUp}
                        >
                            ×
                        </button>
                        <div className="flex flex-col justify-center items-center gap-2 text-[#4d3c18]">
                            <h1 className="text-center gameboy">
                                {currItem.name}
                            </h1>
                            <img
                                src={currItem.imageURL}
                                alt={currItem.name}
                                className="w-12 lg:w-14"
                            />
                            <ul style={{ textAlign: "center" }}>
                                Ingredients Needed:
                                {currItem.need.map((ingredients, index) => {
                                    return <li key={index}>{ingredients}</li>;
                                })}
                            </ul>
                            <button
                                className="bg-green-500 rounded-md p-1 cursor-pointer hover:scale-105"
                                onClick={() => craftItem(currItem)}
                            >
                                {currItem.act === "craft"
                                    ? "Craft Item"
                                    : "Cook Item"}
                            </button>
                            <p
                                style={{
                                    color:
                                        errorText === "Insufficient Ingredients"
                                            ? "red"
                                            : "green",
                                }}
                            >
                                {errorText}
                            </p>
                            {inventoryMsg && (
                                <p style={{ color: "green" }}>{inventoryMsg}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookCraft;
