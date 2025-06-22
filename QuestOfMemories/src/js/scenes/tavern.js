import { loadTavernAssets, drawBoundaries } from "../utils";
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

export default async function tavern(canvas, onChange) {
    playSceneMusic("/assets/bgSound/tavernSound.mp3");
    if (!canvas) return;
    await updatePlayerImage();
    const ctx = canvas.getContext("2d");
    const zoom = 1.5;

    const { mapData, tilesetImage } = await loadTavernAssets();

    const tileWidth = mapData.tilewidth;
    const tileHeight = mapData.tileheight;
    const mapWidth = mapData.width;
    const mapHeight = mapData.height;
    const tilesetCols = Math.floor(tilesetImage.width / tileWidth);

    const spawnPoint = { x: 820, y: 660 };
    player.position = { ...spawnPoint };

    let boundaries = [];
    for (const layer of mapData.layers) {
        if (layer.name === "boundaries" && layer.type === "objectgroup") {
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
            (layer.type === "tilelayer" &&
                layer.name.toLowerCase().includes("upmost")) ||
            layer.name.toLowerCase().includes("upmost++")
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
    const npc1 = new Image();
    npc1.src = "/assets/npc/diluc.png";
    const npc2 = new Image();
    npc2.src = "/assets/npc/xiao.png";

    await Promise.all([
        new Promise((res) => (npc1.onload = res)),
        new Promise((res) => (npc2.onload = res)),
    ]);

    function drawNPCs(ctx) {
        ctx.drawImage(npc1, 890, 564, 32, 48);
        ctx.drawImage(npc2, 785, 610, 32, 48);
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
        drawNPCs(ctx);

        updatePlayer(deltaTime);
        updateAnimation(player, deltaTime);
        drawPlayer(ctx, player);

        const exitY = spawnPoint.y + 30; // 40px buffer (tweak this as needed)
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
