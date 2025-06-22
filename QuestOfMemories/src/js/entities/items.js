import itemData from "../itemData";

function itemRandomizer() {
    const percentage = Math.floor(Math.random() * 100) + 1;
    let item = "";
    if (percentage <= 25) item = "";
    else if (percentage <= 50) item = "Log";
    else if (percentage <= 60) item = "Tomato";
    else if (percentage <= 70) item = "Lettuce";
    else if (percentage <= 80) item = "Corn";
    else if (percentage <= 90) item = "Honeycomb";
    else if (percentage <= 98) item = "BlueOre";
    else item = percentage % 2 == 0 ? "GemOfHell" : "GoldCrystal";

    return item;
}

const loadedImages = {};

function preloadItems() {
    for (const key in itemData) {
        const img = new Image();
        img.src = itemData[key].imageURL;
        loadedImages[key] = img;
    }
}

function drawItems(ctx, mapData, item) {
    if (item.tag === "") return;

    const itemIcon = loadedImages[item.tag];
    if (!itemIcon || !itemIcon.complete || itemIcon.naturalWidth === 0) return;// skip if not loaded yet

    ctx.drawImage(
        itemIcon,
        0, 0, 512, 512,
        item.x, item.y,
        mapData.tilewidth, mapData.tileheight
    );
}


export { drawItems, itemRandomizer, preloadItems };
