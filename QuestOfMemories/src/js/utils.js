export const preloadAssets = (assets) => {
    return Promise.all(
        assets.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        })
    );
};

export async function loadGameAssets() {
    const mapResponse = await fetch(
        "/assets/Map/adventureTimeMapRevision.json"
    );
    const mapData = await mapResponse.json();

    const tilesetImage = new Image();
    tilesetImage.src = "/assets/Map/images/actual-map-asset.png";

    await new Promise((res) => (tilesetImage.onload = res));

    return { mapData, tilesetImage };
}

export async function loadTreehouseAssets() {
    const mapResponse = await fetch("/assets/Map/treehouse-inside.json");
    const mapData = await mapResponse.json();

    const tilesetImage = new Image();
    tilesetImage.src = "/assets/Map/images/inner-workings.png";

    await new Promise((res) => (tilesetImage.onload = res));

    return { mapData, tilesetImage };
}

export async function loadTavernAssets() {
    const mapResponse = await fetch("/assets/Map/tavern.json");
    const mapData = await mapResponse.json();

    const tilesetImage = new Image();
    tilesetImage.src = "/assets/Map/images/inner-workings.png";

    await new Promise((res) => (tilesetImage.onload = res));

    return { mapData, tilesetImage };
}

export async function loadVolcanoAssets() {
    const mapResponse = await fetch("/assets/Map/volcano.json");
    const mapData = await mapResponse.json();

    const tilesetImage = new Image();
    tilesetImage.src = "/assets/Map/images/cave-interior-asset.png";

    await new Promise((res) => (tilesetImage.onload = res));

    return { mapData, tilesetImage };
}

export async function loadCaveAssets() {
    const mapResponse = await fetch("/assets/Map/cave.json");
    const mapData = await mapResponse.json();

    const tilesetImage = new Image();
    tilesetImage.src = "/assets/Map/images/cave-interior-asset.png";

    await new Promise((res) => (tilesetImage.onload = res));

    return { mapData, tilesetImage };
}

export function drawBoundaries(ctx, layer, draw = false) {
    const boundaries = [];

    for (const object of layer.objects) {
        // Use object.name if present, else default to "door-entrance-tree"
        const tag = object.name && object.name.trim() !== "" ? object.name : "";

        const boundary = {
            x: object.x,
            y: object.y,
            width: object.width,
            height: object.height,
            tag,
        };

        if (draw) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            // Color doors blue, other borders red for visualization
            ctx.fillStyle = tag.startsWith("door-") ? "blue" : "red";
            ctx.fillRect(
                boundary.x,
                boundary.y,
                boundary.width,
                boundary.height
            );
            ctx.restore();
        }

        boundaries.push(boundary);
    }

    return boundaries;
}

export function rectsIntersect(r1, r2) {
    return !(
        r1.x + r1.width < r2.x ||
        r1.x > r2.x + r2.width ||
        r1.y + r1.height < r2.y ||
        r1.y > r2.y + r2.height
    );
}

export let lastPlayerPosition = { x: 900, y: 900 };

export function setLastPlayerPosition(pos) {
    lastPlayerPosition = { ...pos };
}

export function getLastPlayerPosition() {
    return { ...lastPlayerPosition };
}
