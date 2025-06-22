import { rectsIntersect } from "../utils";
import { player, getPlayerAttackHitbox } from "./player";
import { store, playerAtom } from "./../gameManager";

const SLIME_WIDTH = 16;
const SLIME_HEIGHT = 16;
const SLIME_COLS = 4;
const frameIndex = (row, col) => row * SLIME_COLS + col;

const animations = {
    idleDown: [frameIndex(0, 0), frameIndex(0, 1)],
    idleRight: [frameIndex(0, 2), frameIndex(0, 3)],
    idleUp: [frameIndex(1, 0), frameIndex(1, 1)],
    idleLeft: [frameIndex(1, 2), frameIndex(1, 3)],
};
const directions = ["idle", "up", "down", "left", "right"];
function getRandomDirection() {
    return directions[Math.floor(Math.random() * directions.length)];
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export const slimes = [];

function createSlime(x, y) {
    return {
        position: { x, y },
        speed: 0.5,
        direction: "down",
        flipX: false,
        currentAnimation: "idleDown",
        animationFrameIndex: 0,
        frameTimer: 0,
        img: null,
        attackPower: 30,
        state: "idle",
        stateTimer: 0,
        aiCooldown: 2000,
        hp: 3,
        isDead: false,
    };
}

export async function loadSlimeImage() {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            slimes.forEach((slime) => (slime.img = img));
            resolve(img);
        };
        img.onerror = reject;
        img.src = "./assets/slime-spritesheet.png";
    });
}

export function spawnSlimesFromMap(mapData) {
    const spawnLayer = mapData.layers.find(
        (layer) => layer.name === "spawn point"
    );
    if (!spawnLayer || !spawnLayer.objects) return;
    const slimeSpawns = spawnLayer.objects.filter(
        (obj) => obj.name === "slime"
    );
    slimes.length = 0;
    for (let i = 0; i < Math.min(8, slimeSpawns.length); i++) {
        const spawn = slimeSpawns[i];
        slimes.push(createSlime(spawn.x, spawn.y));
    }
}

export function drawAllSlimes(ctx) {
    for (const slime of slimes) {
        if (!slime.isDead) drawSlime(ctx, slime);
    }
}

function isCollidingWithBoundaries(x, y, boundaries) {
    for (const boundary of boundaries) {
        if (
            x < boundary.x + boundary.width &&
            x + SLIME_WIDTH > boundary.x &&
            y < boundary.y + boundary.height &&
            y + SLIME_HEIGHT > boundary.y
        ) {
            return true;
        }
    }
    return false;
}

function separateSlimes(slime, allSlimes) {
    const separationDistance = 16;
    let moveX = 0;
    let moveY = 0;

    for (const other of allSlimes) {
        if (other === slime) continue;

        const dx = slime.position.x - other.position.x;
        const dy = slime.position.y - other.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < separationDistance && dist > 0) {
            moveX += dx / dist;
            moveY += dy / dist;
        }
    }

    slime.position.x += moveX * 0.1;
    slime.position.y += moveY * 0.1;
}

const slime_damage_radius = 20;
let lastPlayerPos = { x: player.position.x, y: player.position.y };
let energyReductionTime = 0;

export function updateSlimes(deltaTime, boundaries = [], player) {
    const now = performance.now();
    for (const slime of slimes) {
        if (slime.isDead) continue;
        slime.frameTimer += deltaTime;
        slime.stateTimer += deltaTime;
        if (slime.frameTimer > 300) {
            slime.animationFrameIndex = (slime.animationFrameIndex + 1) % 2;
            slime.frameTimer = 0;
        }
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        const dx = player.position.x + offsetX - slime.position.x;
        const dy = player.position.y + offsetY - slime.position.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        const chaseRadius = 100;

        if (distanceToPlayer < chaseRadius) {
            slime.state = "chase";
        } else if (slime.stateTimer >= slime.aiCooldown) {
            slime.state = getRandomDirection();
            slime.stateTimer = 0;
        }
        let newX = slime.position.x;
        let newY = slime.position.y;
        switch (slime.state) {
            case "idle":
                slime.currentAnimation = `idle${capitalize(slime.direction)}`;
                break;
            case "up":
                newY -= slime.speed;
                slime.direction = "up";
                slime.currentAnimation = "idleUp";
                break;
            case "down":
                newY += slime.speed;
                slime.direction = "down";
                slime.currentAnimation = "idleDown";
                break;
            case "left":
                newX -= slime.speed;
                slime.direction = "left";
                slime.currentAnimation = "idleLeft";
                slime.flipX = true;
                break;
            case "right":
                newX += slime.speed;
                slime.direction = "right";
                slime.currentAnimation = "idleRight";
                slime.flipX = false;
                break;
            case "chase": {
                const dx = player.position.x - slime.position.x;
                const dy = player.position.y - slime.position.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                if (length > 0) {
                    const vx = (dx / length) * slime.speed;
                    const vy = (dy / length) * slime.speed;
                    newX = slime.position.x + vx;
                    newY = slime.position.y + vy;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        slime.direction = dx > 0 ? "right" : "left";
                    } else {
                        slime.direction = dy > 0 ? "down" : "up";
                    }
                    slime.currentAnimation = `idle${capitalize(
                        slime.direction
                    )}`;
                }
                break;
            }
        }
        if (!isCollidingWithBoundaries(newX, newY, boundaries)) {
            slime.position.x = newX;
            slime.position.y = newY;
        } else {
            slime.state = "idle";
        }
        if (distanceToPlayer < slime_damage_radius) {
            const didPlayerMove =
                Math.abs(player.position.x - lastPlayerPos.x) >= 1 ||
                Math.abs(player.position.y - lastPlayerPos.y) >= 1;
            if (!didPlayerMove) {
                if (now - energyReductionTime > 3000) {
                    store.set(playerAtom, (prev) => ({
                        ...prev,
                        energy: Math.max(0, prev.energy - 1),
                    }));
                    energyReductionTime = now; // update timestamp
                }
            }
        }
        separateSlimes(slime, slimes);
    }
    lastPlayerPos = { ...player.position };
}

function drawSlime(ctx, slime) {
    if (!slime.img) return;

    const animationFrames = animations[slime.currentAnimation];
    const frame =
        animationFrames[slime.animationFrameIndex % animationFrames.length];

    const sx = (frame % SLIME_COLS) * SLIME_WIDTH;
    const sy = Math.floor(frame / SLIME_COLS) * SLIME_HEIGHT;

    ctx.save();
    if (slime.flipX) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            slime.img,
            sx,
            sy,
            SLIME_WIDTH,
            SLIME_HEIGHT,
            -slime.position.x - SLIME_WIDTH,
            slime.position.y,
            SLIME_WIDTH,
            SLIME_HEIGHT
        );
    } else {
        ctx.drawImage(
            slime.img,
            sx,
            sy,
            SLIME_WIDTH,
            SLIME_HEIGHT,
            slime.position.x,
            slime.position.y,
            SLIME_WIDTH,
            SLIME_HEIGHT
        );
    }
    ctx.restore();
}

export function handleSlimeCollision(player, slime, onSlimeDeath) {
    if (slime.isDead) return;
    if (player.isAttacking) {
        const attackHitbox = getPlayerAttackHitbox(player);
        const slimeRect = {
            x: slime.position.x,
            y: slime.position.y,
            width: SLIME_WIDTH,
            height: SLIME_HEIGHT,
        };
        if (rectsIntersect(attackHitbox, slimeRect)) {
            slime.hp -= 1;
            if (slime.hp <= 0) {
                slime.isDead = true;
                onSlimeDeath(slime);
            }
        }
    }
}
