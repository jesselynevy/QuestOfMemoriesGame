import dialogue from "./../dialogue";
import itemData from "./../itemData";
import characterData from "./../characterData";
import {
    store,
    choosenCharacterAtom,
    inventoryAtom,
    usingUI,
    isTextBoxVisibleAtom,
    characterToInteractAtom,
    playerTalkingAtom,
    characterDialogueAtom,
    activityInteractionAtom,
    activityList,
    activityMenuPopUpAtom,
    glassShardsFound,
    firstInteraction,
    finalInteraction,
    shard1found,
    shard2found,
    shard3found,
    shard4found,
    legendarySandwichFound,
    theXiaoConvo,
} from "./../gameManager";
import { rectsIntersect } from "./../utils";
import activityData from "./../activityData";
const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 48;
const SPRITE_COLS = 9;

const frameIndex = (row, col) => row * SPRITE_COLS + col;

const animations = {
    idleDown: [frameIndex(0, 0)],
    idleUp: [frameIndex(0, 1)],
    idleRight: [frameIndex(0, 2)],
    idleLeft: [frameIndex(0, 3)],
    walkRight: [frameIndex(0, 4), frameIndex(0, 5)],
    walkLeft: [frameIndex(0, 6), frameIndex(0, 7)],
    collect: [frameIndex(0, 8)],
    walkDown: [frameIndex(1, 0), frameIndex(1, 1)],
    walkUp: [frameIndex(1, 2), frameIndex(1, 3)],
    attackDown: [frameIndex(1, 4)],
    attackUp: [frameIndex(1, 5)],
    attackRight: [frameIndex(1, 6)],
    attackLeft: [frameIndex(1, 7)],
    eat: [frameIndex(1, 8)],
};

export const player = {
    position: { x: 830, y: 832 },
    speed: 1.25,
    direction: "down",
    flipX: false,
    currentAnimation: "idleDown",
    animationFrameIndex: 0,
    frameTimer: 0,
    isCollecting: false,
    collectAnimationTime: 0,
    isEating: false,
    eatAnimationTime: 0,
    img: new Image(),
    isAttacking: false,
};

export async function updatePlayerImage() {
    const characterName = store.get(choosenCharacterAtom);
    const character = characterData[characterName];
    if (!character) return console.warn("Character not found:", characterName);
    return new Promise((resolve, reject) => {
        player.img.onload = () => resolve(player.img);
        player.img.onerror = reject;
        player.img.src = character.display;
    });
}

export function drawPlayer(ctx, player) {
    // Determine which animation to use
    const animationKey = player.isEating
        ? "eat"
        : player.isCollecting
        ? "collect"
        : player.currentAnimation;
    const animFrames = animations[animationKey];
    const frame = animFrames[player.animationFrameIndex % animFrames.length];
    const sx = (frame % SPRITE_COLS) * SPRITE_WIDTH;
    const sy = Math.floor(frame / SPRITE_COLS) * SPRITE_HEIGHT;

    ctx.save();
    if (player.flipX) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            player.img,
            sx,
            sy,
            SPRITE_WIDTH,
            SPRITE_HEIGHT,
            -player.position.x - SPRITE_WIDTH,
            player.position.y,
            SPRITE_WIDTH,
            SPRITE_HEIGHT
        );
    } else {
        ctx.drawImage(
            player.img,
            sx,
            sy,
            SPRITE_WIDTH,
            SPRITE_HEIGHT,
            player.position.x,
            player.position.y,
            SPRITE_WIDTH,
            SPRITE_HEIGHT
        );
    }
    ctx.restore();
}

export function updateAnimation(player, deltaTime) {
    if (player.isCollecting) {
        player.collectAnimationTime -= deltaTime;
        if (player.collectAnimationTime <= 0) {
            player.isCollecting = false;
            player.collectAnimationTime = 0;
        }
    }
    if (player.isEating) {
        player.eatAnimationTime -= deltaTime;
        if (player.eatAnimationTime <= 0) {
            player.isEating = false;
            player.eatAnimationTime = 0;
        }
    }
    player.frameTimer += deltaTime;
    const frameDuration = 200;
    if (player.frameTimer >= frameDuration) {
        player.frameTimer -= frameDuration;
        player.animationFrameIndex =
            (player.animationFrameIndex + 1) %
            animations[player.currentAnimation].length;
    }
}

function playAnimIfNotPlaying(player, animName) {
    if (player.currentAnimation !== animName) {
        player.currentAnimation = animName;
        player.animationFrameIndex = 0;
    }
}

let listenersAdded = false;
const inputState = {
    keys: new Set(),
    mobile: new Set(),
};

let mobileAttackButton = false;
export function mobileAttackTrigger() {
    mobileAttackButton = true;
}
export function consumeMobileAttackFlag() {
    const wasPressed = mobileAttackButton;
    mobileAttackButton = false;
    return wasPressed;
}

function handleKeyDown(e) {
    inputState.keys.add(e.key.toLowerCase());
}

function handleKeyUp(e) {
    inputState.keys.delete(e.key.toLowerCase());
}

export function mobileStartMove(dir) {
    inputState.mobile.add(dir);
}

export function mobileStopMove(dir) {
    inputState.mobile.delete(dir);
}

let activities = [];

export function setupPlayerControls(
    player,
    boundaries = [],
    items = [],
    gameState,
    setPickupItem
) {
    if (!listenersAdded) {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        listenersAdded = true;
    }

    for (const activity in activityData) {
        const exist = boundaries.find(
            (b) => b.tag === activityData[activity].place
        );

        if (activities.find((a) => a.tag === activity)) {
            continue;
        }

        if (activityData[activity].place === exist?.tag) {
            activities.push(activityData[activity]);
        }
    }

    function willCollide(x, y) {
        const testRect = { x, y, width: 32, height: 42 };
        return boundaries.some((b) => rectsIntersect(testRect, b));
    }

    function getDirectionInput() {
        const dirs = [];
        const keys = inputState.keys;
        if (keys.has("w") || keys.has("arrowup")) dirs.push("up");
        if (keys.has("s") || keys.has("arrowdown")) dirs.push("down");
        if (keys.has("a") || keys.has("arrowleft")) dirs.push("left");
        if (keys.has("d") || keys.has("arrowright")) dirs.push("right");
        inputState.mobile.forEach((d) => {
            if (!dirs.includes(d)) dirs.push(d);
        });
        return dirs;
    }

    function nearbyItem(x, y) {
        const testRect = { x, y, width: 32, height: 42 };
        return items.find((item) => rectsIntersect(testRect, item));
    }

    function setIdleAnimation(player) {
        const dir = player.direction;
        playAnimIfNotPlaying(
            player,
            `idle${dir.charAt(0).toUpperCase() + dir.slice(1)}`
        );
    }

    function updatePlayer(deltaTime) {
        if (store.get(usingUI) || gameState?.getFreezePlayer?.()) {
            setIdleAnimation(player);
            return;
        }

        const dirs = getDirectionInput();
        const space = inputState.keys.has(" ") || consumeMobileAttackFlag();
        const speed = player.speed;

        if (space && !player.isAttacking && !player.attackCooldown) {
            player.isAttacking = true;
            playAnimIfNotPlaying(
                player,
                `attack${capitalize(player.direction)}`
            );
            setTimeout(() => {
                player.isAttacking = false;
            }, 100);
            return;
        }

        let dx = 0,
            dy = 0;
        if (dirs.includes("left")) dx -= speed;
        if (dirs.includes("right")) dx += speed;
        if (dirs.includes("up")) dy -= speed;
        if (dirs.includes("down")) dy += speed;

        const nextX = player.position.x + dx;
        const nextY = player.position.y + dy;
        const foundItem = nearbyItem(nextX, nextY);
        if (setPickupItem) setPickupItem(foundItem);

        // Collision for conversation
        if (willCollide(nextX, nextY)) {
            const testRect = {
                x: nextX,
                y: nextY,
                width: 32,
                height: 42,
            };
            const hit = boundaries.find((b) => rectsIntersect(testRect, b));

            if (hit.tag === "mirror") {
                let foundShard = 0;
                let inventory = store.get(inventoryAtom);
                const shard1 = store.get(shard1found);
                const shard2 = store.get(shard2found);
                const shard3 = store.get(shard3found);
                const shard4 = store.get(shard4found);
                const firstTime = store.get(firstInteraction);
                for (const item of inventory) {
                    if (item.type === "shard1" && !shard1 && !firstTime) {
                        store.set(shard1found, true);
                        foundShard = 1;
                        item.count--;
                        break;
                    }

                    if (item.type === "shard2" && !shard2 && !firstTime) {
                        store.set(shard2found, true);
                        foundShard = 1;
                        item.count--;
                        break;
                    }

                    if (item.type === "shard3" && !shard3 && !firstTime) {
                        store.set(shard3found, true);
                        foundShard = 1;
                        item.count--;
                        break;
                    }

                    if (item.type === "shard4" && !shard4 && !firstTime) {
                        store.set(shard4found, true);
                        foundShard = 1;
                        item.count--;
                        break;
                    }
                }

                inventory = inventory.filter((element) => element.count !== 0);
                store.set(inventoryAtom, inventory);

                let conversation = hit.tag;
                if (firstTime) {
                    conversation = "firstinteraction";
                    inventory.push({ ...itemData["Letter"], count: 1 });
                    store.set(inventoryAtom, inventory);
                    store.set(firstInteraction, false);
                }

                const dialoguePhase = store.get(glassShardsFound);
                const last = store.get(finalInteraction);
                let choosenDialogue;
                if (last) {
                    choosenDialogue = dialoguePhase + 1;
                } else if ((!firstTime && foundShard) || dialoguePhase === 4) {
                    if (dialoguePhase === 4) store.set(finalInteraction, true);

                    choosenDialogue = dialoguePhase;
                    if (dialoguePhase < 4)
                        store.set(glassShardsFound, dialoguePhase + 1);
                } else choosenDialogue = dialogue[conversation].length - 1;

                store.set(
                    characterToInteractAtom,
                    dialogue[conversation][choosenDialogue]
                );
                const convo = store.get(characterToInteractAtom);
                store.set(playerTalkingAtom, convo[0].player);
                store.set(characterDialogueAtom, convo[0].sentence);
                store.set(usingUI, true);
                store.set(isTextBoxVisibleAtom, true);
            } else if (hit.tag === "buy" || hit.tag === "store") {
                store.set(characterToInteractAtom, dialogue[hit.tag][0]);
                const convo = store.get(characterToInteractAtom);
                const random = Math.floor(Math.random() * convo.length);
                store.set(playerTalkingAtom, convo[random].player);
                store.set(characterDialogueAtom, convo[random].sentence);
                store.set(usingUI, true);
                store.set(isTextBoxVisibleAtom, true);
            } else if (hit.tag === "craft") {
                store.set(characterToInteractAtom, dialogue["store"][1]);
                const convo = store.get(characterToInteractAtom);
                const random = Math.floor(Math.random() * convo.length);
                store.set(playerTalkingAtom, convo[random].player);
                store.set(characterDialogueAtom, convo[random].sentence);
                store.set(usingUI, true);
                store.set(isTextBoxVisibleAtom, true);
            } else if (hit.tag === "talk") {
                let inventory = store.get(inventoryAtom);
                let foundSandwich = store.get(legendarySandwichFound);
                for (const item of inventory) {
                    if (item.name === "Legendary Sandwich" && !foundSandwich) {
                        item.count--;
                        store.set(legendarySandwichFound, true);
                        store.set(theXiaoConvo, true);
                        inventory.push({
                            ...itemData["GlassShard1"],
                            count: 1,
                        });
                    }
                }

                inventory = inventory.filter((element) => element.count !== 0);
                store.set(inventoryAtom, inventory);

                foundSandwich = store.get(legendarySandwichFound);
                const xiaoConvo = store.get(theXiaoConvo);
                if (foundSandwich && xiaoConvo)
                    store.set(characterToInteractAtom, dialogue[hit.tag][1]);
                else if (foundSandwich && !xiaoConvo)
                    store.set(characterToInteractAtom, dialogue[hit.tag][2]);
                else store.set(characterToInteractAtom, dialogue[hit.tag][0]);
                const convo = store.get(characterToInteractAtom);
                const random =
                    foundSandwich && xiaoConvo
                        ? 0
                        : Math.floor(Math.random() * convo.length);
                store.set(playerTalkingAtom, convo[random].player);
                store.set(characterDialogueAtom, convo[random].sentence);
                store.set(usingUI, true);
                store.set(isTextBoxVisibleAtom, true);
            }
        }

        // Collision for activities
        if (willCollide(nextX, nextY)) {
            const testRect = {
                x: nextX,
                y: nextY,
                width: 32,
                height: 42,
            };
            const hit = boundaries.find((b) => rectsIntersect(testRect, b));

            const activity = activities.filter((a) => a.place === hit.tag);

            if (activity.length > 0) {
                store.set(usingUI, true);
                store.set(activityInteractionAtom, true);
                store.set(activityMenuPopUpAtom, true);
            } else {
                store.set(activityInteractionAtom, false);
            }

            store.set(activityList, activity);
        }

        if ((dx !== 0 || dy !== 0) && !willCollide(nextX, nextY)) {
            player.position.x = nextX;
            player.position.y = nextY;
            const dir = dirs[0] || player.direction;
            player.direction = dir;
            player.flipX = false;
            playAnimIfNotPlaying(player, `walk${capitalize(dir)}`);
        } else {
            setIdleAnimation(player);
        }

        updateAnimation(player, deltaTime);
    }
    return updatePlayer;
}

export function resetPlayerControls() {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    listenersAdded = false;
    inputState.keys.clear();
    inputState.mobile.clear();
}

export function collectItem(item) {
    if (!item?.tag) return;
    let inventory = store.get(inventoryAtom);
    const existing = inventory.find(
        (i) => i.name.split(" ").join("") === item.tag
    );
    if (existing) existing.count++;
    else inventory.push({ ...itemData[item.tag], count: 1 });
    store.set(
        inventoryAtom,
        inventory.filter((i) => i.name)
    );
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function playCollectAnimation(player) {
    player.isCollecting = true;
    player.collectAnimationTime = 700;
    player.animationFrameIndex = 0;
    player.animationTimer = 0;
}

export function playEatAnimation(player) {
    player.isEating = true;
    player.eatAnimationTime = 2000;
    player.animationFrameIndex = 0;
    player.animationTimer = 0;
}

//hitbox for attacking
export function getPlayerAttackHitbox(player) {
    const x = player.position.x;
    const y = player.position.y;
    const width = 20;
    const height = 20;

    switch (player.direction) {
        case "up":
            return { x: x, y: y - height, width, height };
        case "down":
            return { x: x, y: y + SPRITE_HEIGHT, width, height };
        case "left":
            return { x: x - width, y: y, width, height };
        case "right":
            return { x: x + SPRITE_WIDTH, y: y, width, height };
        default:
            return { x, y, width, height };
    }
}
