import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { stopSceneMusic, updateVolumeOrMute } from "../js/soundManager";
import {
    activityDoneAtom,
    characterDialogueAtom,
    characterToInteractAtom,
    characterToTalkAtom,
    finalInteraction,
    firstInteraction,
    gameEnd,
    glassShardsFound,
    inventoryAtom,
    isTextBoxVisibleAtom,
    itemsCookedAtom,
    itemsCraftAtom,
    itemUsedAtom,
    legendarySandwichFound,
    playerAtom,
    playerDiedAtom,
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
    soundMutedAtom,
} from "../js/gameManager";
import dialogue from "../js/dialogue";
import { useAtom } from "jotai";

const GameOver = () => {
    const [itemUsed, setItemUsed] = useAtom(itemUsedAtom);
    const [activityCount, setActivityCount] = useAtom(activityDoneAtom);
    const [itemsCooked, setItemsCooked] = useAtom(itemsCookedAtom);
    const [itemsCrafted, setItemsCrafted] = useAtom(itemsCraftAtom);
    const [shardsCollected, setShardsCollected] = useAtom(glassShardsFound);
    const [player, setPlayer] = useAtom(playerAtom);
    const [playerDied, setPlayerDied] = useAtom(playerDiedAtom);
    const [playerInventory, setPlayerInventory] = useAtom(inventoryAtom);
    const [finishGame, setFinishGame] = useAtom(finalInteraction);
    const [finalScore, setFinalScore] = useState(0);
    const [finalText, setFinalText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let score = 0;

        score =
            activityCount * 50 +
            itemUsed * 100 +
            itemsCooked * 250 +
            itemsCrafted * 250 +
            shardsCollected * 1000;

        setFinalScore(score);

        let text;

        if (finishGame) {
            if (score <= 5000) text = "Finished it, but at what cost";
            else if (score <= 7000)
                text = "The world can still offer you so much more";
            else if (score <= 10000)
                text = "Curiosity is the only way to grow in this world";
            else if (score <= 12500)
                text =
                    "When you can admire the little things in life, you can appreciate the bigger things as well";
            else text = "Time well spent";
        } else {
            if (score <= 1000)
                text =
                    "Died without nothing much, what a pathethic way to live";
            else if (score <= 2500)
                text = "Not bad, but you still died in the end";
            else if (score <= 5000)
                text = "You can still do better than that, so stop dying.";
            else if (score <= 8000)
                text = "So close yet so far, how do you keep doing this";
            else
                text =
                    "Was it all worth it? All you went through just to die in the end";
        }

        setFinalText(text);

        return;
    }, [playerDied, finishGame]);

    const resetGame = (path) => {
        stopSceneMusic();
        store.set(soundMutedAtom, true);
        updateVolumeOrMute();
        setItemUsed(0);
        setActivityCount(0);
        setItemsCrafted(0);
        setItemsCooked(0);
        setPlayerDied(false);
        setPlayer({
            hunger: 70,
            happiness: 70,
            energy: 70,
            experience: 70,
            coins: 100,
        });
        setPlayerInventory([]);
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
        store.set(gameEnd, false);
        setFinishGame(false);
        setShardsCollected(0);
        store.set(shard1found, false);
        store.set(shard2found, false);
        store.set(shard3found, false);
        store.set(shard4found, false);
        store.set(legendarySandwichFound, false);
        store.set(theXiaoConvo, false);
        store.set(slimesKilled, 0);
        store.set(shardFromSlime, false);
        navigate(path, { state: { showAlert: true } });
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen mx-auto flex-col animate-pulse gameboy">
                <img
                    src={
                        finishGame
                            ? "/assets/treasure.png"
                            : "/assets/demon.png"
                    }
                    className="w-32"
                />
                {finishGame && !playerDied && (
                    <h1
                        className="mb-4"
                        style={{
                            color: "green",
                            fontSize: "32px",
                            backgroundColor: "black",
                        }}
                    >
                        You Won
                    </h1>
                )}
                {playerDied && (
                    <h1
                        className="mb-4"
                        style={{
                            color: finishGame ? "green" : "red",
                            fontSize: "32px",
                            backgroundColor: "black",
                        }}
                    >
                        You Died
                    </h1>
                )}
                <h1
                    style={{
                        color: "white",
                        fontSize: "28px",
                        backgroundColor: "black",
                    }}
                >
                    Final Score:
                </h1>
                <h1
                    style={{
                        color: "white",
                        fontSize: "28px",
                        backgroundColor: "black",
                    }}
                >
                    {finalScore}
                </h1>
                <h1
                    className="mb-4"
                    style={{
                        color: "white",
                        fontSize: "24px",
                        backgroundColor: "black",
                    }}
                >
                    {finalText}
                </h1>
                <h1
                    style={{
                        color: "white",
                        fontSize: "20px",
                        backgroundColor: "black",
                    }}
                >
                    Final Stats:
                </h1>
                <h1
                    style={{
                        color: "white",
                        fontSize: "16px",
                        backgroundColor: "black",
                    }}
                >
                    {`Items Used: ${itemUsed}`}
                </h1>
                <h1
                    style={{
                        color: "white",
                        fontSize: "16px",
                        backgroundColor: "black",
                    }}
                >
                    {`Items Crafted: ${itemsCrafted}`}
                </h1>
                <h1
                    style={{
                        color: "white",
                        fontSize: "16px",
                        backgroundColor: "black",
                    }}
                >
                    {`Items Cooked: ${itemsCooked}`}
                </h1>
                <h1
                    style={{
                        color: "white",
                        fontSize: "16px",
                        backgroundColor: "black",
                    }}
                >
                    {`Activities Done: ${activityCount}`}
                </h1>
                <h1
                    className="mb-4"
                    style={{
                        color: "white",
                        fontSize: "16px",
                        backgroundColor: "black",
                    }}
                >
                    {`Shards Collected: ${shardsCollected}`}
                </h1>
                <div className="flex flex-col gap-3 justify-center">
                    <button
                        className="text-white cursor-pointer hover:scale-105 border-white rounded-md border-2 p-2"
                        onClick={() => resetGame("/", {showAlert:true})}
                    >
                        Back To Main Menu
                    </button>
                </div>
            </div>
        </>
    );
};

export default GameOver;
