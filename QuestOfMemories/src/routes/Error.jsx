import React from "react";
import { useNavigate } from "react-router-dom";
import {
    activityDoneAtom,
    characterDialogueAtom,
    characterToInteractAtom,
    characterToTalkAtom,
    finalInteraction,
    firstInteraction,
    glassShardsFound,
    inventoryAtom,
    isTextBoxVisibleAtom,
    itemsCookedAtom,
    itemsCraftAtom,
    itemUsedAtom,
    legendarySandwichFound,
    playerAtom,
    playerTalkingAtom,
    shard1found,
    shard2found,
    shard3found,
    shard4found,
    shardFromSlime,
    slimesKilled,
    store,
    theXiaoConvo,
    usingUI,
} from "../js/gameManager";
import dialogue from "../js/dialogue";

const Error = () => {
    const navigate = useNavigate();

    const resetGame = (path) => {
        store.set(itemUsedAtom, 0);
        store.set(activityDoneAtom, 0);
        store.set(itemsCraftAtom, 0);
        store.set(itemsCookedAtom, 0);
        store.set(playerAtom, {
            hunger: 70,
            happiness: 70,
            energy: 70,
            experience: 70,
            coins: 100,
        });
        store.set(inventoryAtom, []);
        store.set(isTextBoxVisibleAtom, true);
        store.set(usingUI, true);
        store.set(characterToTalkAtom, "intro");
        store.set(characterToInteractAtom, dialogue["intro"][0]);
        store.set(playerTalkingAtom, dialogue["intro"][0][0]);
        store.set(
            characterDialogueAtom,
            "I've never seen that mirror before..."
        );
        store.set(firstInteraction, true);
        store.set(finalInteraction, false);
        store.set(glassShardsFound, 0);
        store.set(shard1found, false);
        store.set(shard2found, false);
        store.set(shard3found, false);
        store.set(shard4found, false);
        store.set(legendarySandwichFound, false);
        store.set(theXiaoConvo, false);
        store.set(slimesKilled, 0);
        store.set(shardFromSlime, false);
        navigate(path);
    };

    return (
        <>
            <div className="flex justify-center items-center mx-auto min-h-screen flex-col animate-pulse">
                <img src="/assets/demon.png" className="w-32" />
                <h1
                    className="gameboy"
                    style={{
                        color: "white",
                        fontSize: "32px",
                        backgroundColor: "black",
                    }}
                >
                    You are in the wrong page loser
                </h1>
                <button
                    className="text-white cursor-pointer hover:scale-105 border-white rounded-md border-2 p-2"
                    onClick={() => resetGame("/")}
                >
                    Back To Main Menu
                </button>
            </div>
        </>
    );
};

export default Error;
