import {
    loadGameAssets,
    drawBoundaries,
    rectsIntersect,
    setLastPlayerPosition,
    getLastPlayerPosition,
} from "./../utils";
import { playSceneMusic } from "../soundManager";
import {
    setupPlayerControls,
    updateAnimation,
    drawPlayer,
    player,
    resetPlayerControls,
    collectItem,
} from "./../entities/player";
import { drawItems, itemRandomizer, preloadItems } from "./../entities/items";

resetPlayerControls();
let animationFrameId = null;

export default async function mapRender(
    canvas,
    onChange,
    { onItemPickup } = {}
) {
    if (!canvas) return;
    playSceneMusic("/assets/bgSound/mainSound.mp3");
    const ctx = canvas.getContext("2d");
    const zoom = 1.5;
    const { mapData, tilesetImage } = await loadGameAssets();
    preloadItems();
    const tileWidth = mapData.tilewidth;
    const tileHeight = mapData.tileheight;
    const mapWidth = mapData.width;
    const mapHeight = mapData.height;
    const tilesetCols = Math.floor(tilesetImage.width / tileWidth);

    const spawnPoint = getLastPlayerPosition();
    player.position = { ...spawnPoint };

    // === Map Objects ===
    let boundaries = [];
    let doors = [];
    let items = [];

    mapData.layers.forEach((layer) => {
        if (layer.type === "objectgroup") {
            if (layer.name === "border") {
                const objects = drawBoundaries(ctx, layer, true);
                boundaries = objects;
                doors = objects.filter((obj) =>
                    obj.tag?.startsWith("door-entrance-")
                );
            }

            if (layer.name === "item-spawnpoint") {
                items = drawBoundaries(ctx, layer);
            }
        }
    });

    // Randomize item types
    items.forEach((item) => {
        if (item.x === 1392 && item.y === 80) return (item.tag = "GlassShard3");

        return (item.tag = itemRandomizer());
    });

    const updatePlayer = setupPlayerControls(player, boundaries, items);

    // === Offscreen Canvas for Base Tile Layers ===
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = mapWidth * tileWidth;
    offscreenCanvas.height = mapHeight * tileHeight;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    mapData.layers.forEach((layer) => {
        if (
            layer.type === "tilelayer" &&
            !["night", "upmost", "upmost++"].some((s) =>
                layer.name.toLowerCase().includes(s)
            )
        ) {
            layer.data.forEach((tileId, i) => {
                if (tileId === 0) return;
                const tileIndex = tileId - 1;
                const sx = (tileIndex % tilesetCols) * tileWidth;
                const sy = Math.floor(tileIndex / tilesetCols) * tileHeight;
                const dx = (i % mapWidth) * tileWidth;
                const dy = Math.floor(i / mapWidth) * tileHeight;
                offscreenCtx.drawImage(
                    tilesetImage,
                    sx,
                    sy,
                    tileWidth,
                    tileHeight,
                    dx,
                    dy,
                    tileWidth,
                    tileHeight
                );
            });
        }
    });

    const upmostLayers = mapData.layers.filter(
        (layer) =>
            layer.type === "tilelayer" &&
            ["upmost", "upmost++"].some((s) =>
                layer.name.toLowerCase().includes(s)
            )
    );

    function drawLayer(ctx, layer) {
        layer.data.forEach((tileId, i) => {
            if (tileId === 0) return;
            const tileIndex = tileId - 1;
            const sx = (tileIndex % tilesetCols) * tileWidth;
            const sy = Math.floor(tileIndex / tilesetCols) * tileHeight;
            const dx = (i % mapWidth) * tileWidth;
            const dy = Math.floor(i / mapWidth) * tileHeight;
            ctx.drawImage(
                tilesetImage,
                sx,
                sy,
                tileWidth,
                tileHeight,
                dx,
                dy,
                tileWidth,
                tileHeight
            );
        });
    }

    // === Game State ===
    let nearbyPickupItem = null;
    let pickupItemScreenPos = null;
    let nearDoorDestination = null;
    let cameraX = 0;
    let cameraY = 0;

    function updateNearbyPickupItem() {
        nearbyPickupItem = null;
        pickupItemScreenPos = null;

        const playerRect = {
            x: player.position.x + 8,
            y: player.position.y + 32,
            width: 16,
            height: 16,
        };

        for (const item of items) {
            const itemRect = {
                x: item.x,
                y: item.y,
                width: item.width || 16,
                height: item.height || 16,
            };

            if (rectsIntersect(playerRect, itemRect)) {
                nearbyPickupItem = item;
                pickupItemScreenPos = {
                    x: item.x - cameraX,
                    y: item.y - cameraY,
                };
                break;
            }
        }
    }

    function pickupItem(item) {
        if (!item) return;
        collectItem(item);
        setTimeout(() => {
            items.splice(items.indexOf(item), 1);
            nearbyPickupItem = null;
            pickupItemScreenPos = null;
            if (onItemPickup) onItemPickup();
        }, 400);
    }

    async function renderFrame(deltaTime) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
        cameraX = Math.max(
            0,
            Math.min(
                player.position.x - canvas.width / (2 * zoom),
                mapWidth * tileWidth - canvas.width / zoom
            )
        );
        cameraY = Math.max(
            0,
            Math.min(
                player.position.y - canvas.height / (2 * zoom),
                mapHeight * tileHeight - canvas.height / zoom
            )
        );
        ctx.translate(-cameraX, -cameraY);

        ctx.drawImage(offscreenCanvas, 0, 0);

        items.forEach((item) => drawItems(ctx, mapData, item));

        updatePlayer(deltaTime);
        updateAnimation(player, deltaTime);
        drawPlayer(ctx, player);
        updateNearbyPickupItem();

        const playerRect = {
            x: player.position.x,
            y: player.position.y - 10,
            width: 10,
            height: 20,
        };
        nearDoorDestination = null;

        doors.forEach((door) => {
            if (rectsIntersect(playerRect, door)) {
                const destination = door.tag.replace("door-entrance-", "");
                if (
                    ["tree", "cave", "tavern", "volcano"].includes(destination)
                ) {
                    nearDoorDestination = {
                        name: destination,
                        x: door.x,
                        y: door.y,
                    };
                }
            }
        });

        upmostLayers.forEach((layer) => drawLayer(ctx, layer));

        return false;
    }

    let lastTime = performance.now();

    async function gameLoop(now = performance.now()) {
        const deltaTime = now - lastTime;
        lastTime = now;
        const shouldStop = await renderFrame(deltaTime);
        if (!shouldStop) animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return {
        ctx,
        player,
        getNearbyDoor: () => nearDoorDestination,
        getPlayerScreenPosition: () => ({
            x: player.position.x - cameraX,
            y: player.position.y - cameraY,
        }),
        getNearbyPickupItem: () => nearbyPickupItem,
        getPickupItemScreenPosition: () => pickupItemScreenPos,
        async enterNearbyDoor() {
            if (nearDoorDestination) {
                setLastPlayerPosition(player.position);
                if (onChange) await onChange(nearDoorDestination.name);
            }
        },
        pickupItem,
        cleanup() {
            cancelAnimationFrame(animationFrameId);
            resetPlayerControls();
        },
    };
}
