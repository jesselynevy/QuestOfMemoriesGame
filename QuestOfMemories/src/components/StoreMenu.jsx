import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
    playerAtom,
    inventoryAtom,
    activityStoreAtom,
    activityMenuPopUpAtom,
    store,
} from "../js/gameManager";
import itemData from "../js/itemData";

const StoreMenu = ({ location }) => {
    const [player, setPlayer] = useAtom(playerAtom);
    const [storeMenu, setStoreMenu] = useAtom(activityStoreAtom);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        setErrorText("");
    }, [storeMenu]);

    const closeStoreMenu = () => {
        setStoreMenu(false);
        store.set(activityMenuPopUpAtom, true);
    };

    const buyItem = (item) => {
        if (player.coins < item.cost) {
            setErrorText("Insufficient Coins");
            return;
        }
        const inventory = store.get(inventoryAtom);
        const sfx = new Audio("/assets/effect/buySfx.mp3");
        sfx.play();

        setPlayer((prev) => {
            return {
                ...prev,
                coins: prev.coins - item.cost,
            };
        });

        for (const invItem of inventory) {
            if (invItem.name === item.name) {
                invItem.count++;
                store.set(inventoryAtom, inventory);
                return;
            }
        }

        setErrorText(`${item.name} Successfully Purchased`);
        inventory.push({ ...item, count: 1 });
        store.set(inventoryAtom, inventory);
    };

    return (
        <>
            {storeMenu && (
                <div className="fixed inset-0 flex justify-center items-center z-25 textbox">
                    <div className="help-content bg-[#4f350ee7] p-5 rounded-lg relative max-w-md shadow-lg border-2 border-[#fe0]">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-[#fe0] hover:text-black cursor-pointer"
                            onClick={closeStoreMenu}
                        >
                            ×
                        </button>
                        <h1 className="text-center gameboy text-[#fff]">{location.store}</h1>
                        <hr className="mb-2 border-[#fff]" />
                        <div className="overflow-auto sm:w-sm h-auto max-h-[300px]">
                            <div className="flex flex-wrap justify-center gap-2 sm:w-sm">
                                {Object.entries(itemData).map(
                                    ([, item], index) => {
                                        if (item.store === location.store)
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col justify-center items-center border-2 border-[#fff] rounded-md w-14 h-14 lg:w-16 lg:h-16"
                                                    onClick={() =>
                                                        buyItem(item)
                                                    }
                                                >
                                                    <img
                                                        src={item.imageURL}
                                                        alt={item.name}
                                                        className="self-center object-contain w-full h-8 lg:h-10 cursor-pointer"
                                                    />
                                                    <p className="text-center text-sm text-[#fe0]">
                                                        {item.cost}
                                                    </p>
                                                </div>
                                            );
                                    }
                                )}
                            </div>
                        </div>
                        <p
                            style={{
                                color:
                                    errorText === "Insufficient Coins"
                                        ? "red"
                                        : "green",
                                textAlign: "center",
                            }}
                        >
                            {errorText}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default StoreMenu;
