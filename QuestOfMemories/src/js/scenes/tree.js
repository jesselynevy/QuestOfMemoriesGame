import { loadTreehouseAssets, drawBoundaries } from "../utils";
import {
    setupPlayerControls,
    updateAnimation,
    drawPlayer,
    player,
    resetPlayerControls,
    updatePlayerImage,
} from "../entities/player";
import { playSceneMusic } from "../soundManager";

resetPlayerControls();
let animationFrameId = null;

export default async function treehouse(canvas, onChange) {
    playSceneMusic("/assets/bgSound/treehouseSound.mp3");
    if (!canvas) return;
    await updatePlayerImage();
    const ctx = canvas.getContext("2d");
    const zoom = 1.5;

    const { mapData, tilesetImage } = await loadTreehouseAssets();

    const tileWidth = mapData.tilewidth;
    const tileHeight = mapData.tileheight;
    const mapWidth = mapData.width;
    const mapHeight = mapData.height;
    const tilesetCols = Math.floor(tilesetImage.width / tileWidth);

    const spawnPoint = { x: 767, y: 860 };
    player.position = { ...spawnPoint };

    let boundaries = [];
    for (const layer of mapData.layers) {
        if (layer.name === "border" && layer.type === "objectgroup") {
            boundaries = drawBoundaries(ctx, layer, true);
            //break;
        }
    }

    const updatePlayer = setupPlayerControls(player, boundaries);

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = mapWidth * tileWidth;
    offscreenCanvas.height = mapHeight * tileHeight;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    for (const layer of mapData.layers) {
        if (
            layer.type !== "tilelayer" ||
            layer.name.toLowerCase().includes("upmost") ||
            layer.name.toLowerCase().includes("upmost++")
        )
            continue;

        for (let i = 0; i < layer.data.length; i++) {
            const tileId = layer.data[i];
            if (tileId === 0) continue;

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
        }
    }

    const upmostLayers = mapData.layers.filter(
        (layer) =>
            layer.type === "tilelayer" &&
            (layer.name.toLowerCase().includes("upmost") ||
                layer.name.toLowerCase().includes("upmost++"))
    );

    function drawLayer(ctx, layer) {
        for (let i = 0; i < layer.data.length; i++) {
            const tileId = layer.data[i];
            if (tileId === 0) continue;

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
        }
    }

    async function renderFrame(deltaTime) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(zoom, 0, 0, zoom, 0, 0);

        const cameraX = Math.max(
            0,
            Math.min(
                player.position.x - canvas.width / (2 * zoom),
                mapWidth * tileWidth - canvas.width / zoom
            )
        );
        const cameraY = Math.max(
            0,
            Math.min(
                player.position.y - canvas.height / (2 * zoom),
                mapHeight * tileHeight - canvas.height / zoom
            )
        );
        ctx.translate(-cameraX, -cameraY);

        ctx.drawImage(offscreenCanvas, 0, 0);

        updatePlayer(deltaTime);
        updateAnimation(player, deltaTime);
        drawPlayer(ctx, player);

        const exitY = spawnPoint.y + 40; // 40px buffer (tweak this as needed)
        if (player.position.y > exitY) {
            if (onChange) {
                await onChange("mapRender");
                return true;
            }
        }

        for (const layer of upmostLayers) {
            drawLayer(ctx, layer);
        }
        return false;
    }
    let lastTime = performance.now();
    async function gameLoop(now = performance.now()) {
        const deltaTime = now - lastTime;
        lastTime = now;

        const shouldStop = await renderFrame(deltaTime);
        if (!shouldStop) {
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }

    gameLoop();
    return {
        ctx,
        getNearbyDoor() {
            return null; // always return null so button disappears inside
        },
        cleanup() {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            resetPlayerControls();
        },
    };
}
