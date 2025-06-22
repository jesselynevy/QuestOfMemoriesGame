import { useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";
import {
    activityInteractionAtom,
    activityList,
    activityMenuPopUpAtom,
    activityStoreAtom,
    activityCookCraftAtom,
    activityDoing,
    store,
    usingUI,
    activityGardening,
    activityMining,
    isTextBoxVisibleAtom,
} from "./../js/gameManager";

// Components
import StoreMenu from "./StoreMenu";
import CookCraft from "./CookCraft";
import DoingActivity from "./DoingActivity";

const ActivityMenu = () => {
    const [activityMenuPopUp, setActivityMenuPopup] = useAtom(
        activityMenuPopUpAtom
    );
    const textBoxVisible = useAtomValue(isTextBoxVisibleAtom);
    const activities = useAtomValue(activityList);
    const [location, setLocation] = useState("");

    const handleCloseActivityMenu = () => {
        setActivityMenuPopup(false);
        store.set(activityInteractionAtom, false);
        store.set(usingUI, false);
    };

    const handleActivity = async (activity) => {
        setLocation(activity);
        setActivityMenuPopup(false);
        if (activity.store !== undefined) {
            store.set(activityStoreAtom, true);
        } else if (activity.place === "cook" || activity.place === "craft") {
            store.set(activityCookCraftAtom, true);
        } else {
            if (activity.place === "garden") store.set(activityGardening, true);
            else if (activity.place === "mining")
                store.set(activityMining, true);
            else store.set(activityDoing, true);
        }
    };

    return (
        <>
            {activityMenuPopUp && !textBoxVisible && (
                <div className="fixed inset-0 flex justify-center items-center z-25 textbox">
                    <div className="help-content bg-transparent p-5 rounded-lg relative max-w-md shadow-lg">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black cursor-pointer"
                            onClick={handleCloseActivityMenu}
                        >
                            ×
                        </button>
                        <div className="flex flex-col justify-center items-center gap-2">
                            {activities.map((activity, index) => (
                                <button
                                    key={index}
                                    className="bg-[#75b3ffc9] hover:bg-[#7fe67fc9] text-white px-4 py-2 rounded cursor-pointer focus:border-none"
                                    onClick={() => handleActivity(activity)}
                                >
                                    {activity.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {!textBoxVisible && <StoreMenu location={location} />}
            {!textBoxVisible && <CookCraft location={location} />}
            {!textBoxVisible && <DoingActivity location={location} />}
        </>
    );
};

export default ActivityMenu;
