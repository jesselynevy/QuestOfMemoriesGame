import { atom, createStore } from "jotai";
import dialogue from "./dialogue";

// Player stats
const playerDiedAtom = atom(false);
const playerAtom = atom({
    hunger: 70,
    happiness: 70,
    energy: 70,
    experience: 70,
    coins: 100,
});

// User interaction stats
const itemUsedAtom = atom(0);
const activityDoneAtom = atom(0);
const itemsCookedAtom = atom(0);
const itemsCraftAtom = atom(0);

// Activity states
const activityInteractionAtom = atom(false);
const activityMenuPopUpAtom = atom(false);
const activityList = atom([]);
const activityStoreAtom = atom(false);
const activityCookCraftAtom = atom(false);
const activityDoing = atom(false);
const activityGardening = atom(false);
const activityMining = atom(false);

// Textbox and UI visibility and functionality
const isTextBoxVisibleAtom = atom(true);
const usingUI = atom(true);
const playerUsernameAtom = atom("Guest");
const choosenCharacterAtom = atom("Finn");
const inventoryAtom = atom([]);
const characterToTalkAtom = atom("intro");
const characterToInteractAtom = atom(dialogue["intro"][0]);
const playerTalkingAtom = atom(dialogue["intro"][0][0].player);
const characterDialogueAtom = atom("I've never seen that mirror before...");
const firstInteraction = atom(true);
const legendarySandwichFound = atom(false);
const theXiaoConvo = atom(false);
const finalInteraction = atom(false);
const gameEnd = atom(false);
const glassShardsFound = atom(0);
const shard1found = atom(false);
const shard2found = atom(false);
const shard3found = atom(false);
const shard4found = atom(false);
const slimesKilled = atom(0);
const shardFromSlime = atom(false);
const store = createStore();

//sound
const soundMutedAtom = atom(true);
const soundVolumeAtom = atom(0.15);

export {
    playerDiedAtom,
    playerAtom,
    itemUsedAtom,
    activityDoneAtom,
    itemsCookedAtom,
    itemsCraftAtom,
    activityInteractionAtom,
    activityMenuPopUpAtom,
    activityList,
    activityStoreAtom,
    activityCookCraftAtom,
    activityDoing,
    activityGardening,
    activityMining,
    isTextBoxVisibleAtom,
    usingUI,
    playerUsernameAtom,
    choosenCharacterAtom,
    inventoryAtom,
    characterToTalkAtom,
    characterToInteractAtom,
    firstInteraction,
    legendarySandwichFound,
    theXiaoConvo,
    finalInteraction,
    gameEnd,
    playerTalkingAtom,
    characterDialogueAtom,
    glassShardsFound,
    shard1found,
    shard2found,
    shard3found,
    shard4found,
    slimesKilled,
    shardFromSlime,
    store,
    soundMutedAtom,
    soundVolumeAtom,
};
