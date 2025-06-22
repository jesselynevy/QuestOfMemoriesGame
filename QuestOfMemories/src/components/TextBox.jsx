import React, { useEffect, useState } from "react";
import {
    isTextBoxVisibleAtom,
    playerUsernameAtom,
    choosenCharacterAtom,
    characterToInteractAtom,
    usingUI,
    characterDialogueAtom,
    playerTalkingAtom,
    store,
    finalInteraction,
    theXiaoConvo,
    gameEnd,
} from "./../js/gameManager";
import { useAtom, useAtomValue } from "jotai";
import characterData from "./../js/characterData";
import { useNavigate } from "react-router-dom";

const TextBox = () => {
    const [isVisible, setIsVisible] = useAtom(isTextBoxVisibleAtom);
    const [playerTalking, setPlayerTalking] = useAtom(playerTalkingAtom);
    const [characterDialogue, setCharacterDialogue] = useAtom(
        characterDialogueAtom
    );
    const dialogueInfo = useAtomValue(characterToInteractAtom);
    const character = useAtomValue(choosenCharacterAtom);
    const username = useAtomValue(playerUsernameAtom);
    const [next, setNext] = useState(1);
    const [text, setText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        const typeText = async () => {
            setText("");
            for (let i = 0; i < characterDialogue.length; i++) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        if (!cancelled) {
                            setText(
                                (prevText) => prevText + characterDialogue[i]
                            );
                        }
                        resolve();
                    }, 10);
                });
            }
        };

        typeText();

        return () => {
            cancelled = true;
        };
    }, [characterDialogue]);

    const handleTalking = async () => {
        setCharacterDialogue("");

        if (
            dialogueInfo[0].npcName === "Diluc" ||
            dialogueInfo[0].npcName === "Haru"
        ) {
            setNext(1);
            setCharacterDialogue("");
            setIsVisible(false);

            return;
        }

        const xiaoConvo = store.get(theXiaoConvo);
        if (
            next === dialogueInfo.length ||
            (dialogueInfo[0].npcName === "Xiao" && !xiaoConvo)
        ) {
            store.set(theXiaoConvo, false);
            setNext(1);
            setIsVisible(false);
            store.set(usingUI, false);

            let final = store.get(finalInteraction);
            let end = store.get(gameEnd);
            if (final && !end) {
                store.set(gameEnd, true);
                navigate("/GameOver");
            }
            return;
        }

        setPlayerTalking(dialogueInfo[next].player);
        setCharacterDialogue(dialogueInfo[next].sentence);
        setNext((prevNext) => prevNext + 1);
    };

    return (
        <>
            {isVisible && (
                <div
                    onClick={handleTalking}
                    className="textbox text-lg h-[150px] text-white bg-black border-5 border-[#ffffff] flex absolute inset-x-0 bottom-0 p-4 rounded-lg mb-8"
                    style={{
                        justifyContent: playerTalking
                            ? "flex-start"
                            : dialogueInfo[next - 1].npcName === "System"
                            ? "center"
                            : "flex-end",
                        textAlign: playerTalking
                            ? "left"
                            : dialogueInfo[next - 1].npcName === "System"
                            ? "center"
                            : "right",
                    }}
                >
                    {playerTalking && (
                        <img
                            className="w-auto h-[120px]"
                            src={characterData[character].imageUrl}
                            alt="Main Character"
                        />
                    )}
                    <div className="w-full">
                        <h1>
                            {playerTalking
                                ? username
                                : dialogueInfo[next - 1].npcName}
                        </h1>
                        <hr />
                        <p>{text}</p>
                    </div>
                    {!playerTalking &&
                        dialogueInfo[next - 1].npcName !== "System" && (
                            <img
                                className="w-auto h-[120px]"
                                src={dialogueInfo[next - 1].npcImage}
                                alt="Other Character"
                            />
                        )}
                </div>
            )}
        </>
    );
};

export default TextBox;
