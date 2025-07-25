const itemData = {
    TomatoSeed: {
        type: "seed",
        name: "Tomato Seed",
        imageURL: "/assets/items/TomatoSeed.png",
        info: "Just your ordinary tomato seed",
        store: "Shop",
        cost: 3,
    },
    Bread: {
        type: "hunger",
        name: "Bread",
        imageURL: "/assets/items/Bread.png",
        info: "A piece of bread, I don't know what else you need to know",
        store: "Shop",
        cost: 5,
        stats: 5,
    },
    Milk: {
        type: "hunger",
        name: "Milk",
        imageURL: "/assets/items/Milk.png",
        info: "You need some milk",
        store: "Shop",
        cost: 3,
        stats: 3,
    },
    Cheese: {
        type: "hunger",
        name: "Cheese",
        imageURL: "/assets/items/Cheese.png",
        info: "Cheese Yum!",
        store: "Shop",
        cost: 2,
        stats: 3,
    },
    CoffeeBeans: {
        type: "misc",
        name: "Coffee Beans",
        imageURL: "/assets/items/CoffeeBean.png",
        info: "Could be grinded to be coffee",
        store: "Shop",
        cost: 5,
    },
    Meat: {
        type: "hunger",
        name: "Meat",
        imageURL: "/assets/items/Meat.png",
        info: "Some juicy meat, wonder if you can cook it.",
        store: "Shop",
        cost: 5,
        stats: 7,
    },
    LettuceSeed: {
        type: "seed",
        name: "Lettuce Seed",
        imageURL: "/assets/items/LettuceSeed.png",
        info: "A lettuce seed, plant it maybe?",
        store: "Shop",
        cost: 3,
    },
    CornSeed: {
        type: "seed",
        name: "Corn Seed",
        imageURL: "/assets/items/CornSeed.png",
        info: "A corn seed, who doesn't love corn.",
        store: "Shop",
        cost: 2,
    },
    SeedOfFlowerGlass: {
        type: "seed",
        name: "Seed of Flower Glass",
        imageURL: "/assets/items/SeedOfFlowerGlass.png",
        info: "A seed of a mystical flower, interesting ain't it.",
        store: "Fire Store",
        cost: 50,
    },
    BrickOfFire: {
        type: "misc",
        name: "Brick of Fire",
        imageURL: "/assets/items/BrickOfFire.png",
        info: "A flaming brick, sick",
        store: "Fire Store",
        cost: 10,
    },
    BlueOre: {
        type: "misc",
        name: "Blue Ore",
        imageURL: "/assets/items/BlueOre.png",
        info: "IT'S A DIAMON-... Oh nevermind, just a normal blue ore",
        store: "Fire Store",
        cost: 5,
    },
    EmeraldStone: {
        type: "misc",
        name: "Emerald Stone",
        imageURL: "/assets/items/EmeraldStone.png",
        info: "Fancy stone oooooohhhhhh",
        store: "Fire Store",
        cost: 10,
    },
    SwordOfHope: {
        type: "weapon",
        name: "Sword of Hope",
        imageURL: "/assets/items/SwordOfHope.png",
        info: "When all hope is lost, there is still hope",
        store: "Fire Store",
        act: "craft",
        need: ["Singing Wood", "Heavenly Omniscient Eyes", "Skull of Midas"],
        cost: 200,
    },
    SwordOfSamadhiFlame: {
        type: "weapon",
        name: "Sword of Samadhi Flame",
        imageURL: "/assets/items/SwordOfSamadhiFlame.png",
        info: "Fancy sword with fancy name",
        store: "Fire Store",
        act: "craft",
        need: [
            "Skull of Midas",
            "Heart of Ogre",
            "Gem of Hell",
            "Gold Crystal",
        ],
        cost: 500,
    },
    HeavenlyOmniscientEye: {
        type: "experience",
        name: "Heavenly Omniscient Eye",
        imageURL: "/assets/items/HeavenlyOmniscientEye.png",
        info: "IT'S THE ALL SEEING EYE!!!",
        store: "Fire Store",
        cost: 50,
        stats: 100,
    },
    HeartOfOgre: {
        type: "happiness",
        name: "Heart of Ogre",
        imageURL: "/assets/items/HeartOfOgre.png",
        info: "It is both disgusting and cool",
        store: "Fire Store",
        cost: 60,
        stats: 50,
    },
    SkullOfMidas: {
        type: "misc",
        name: "Skull of Midas",
        imageURL: "/assets/items/SkullOfMidas.png",
        info: "The skull of king midas, legends says that it still has the power to turn things into gold",
        store: "Fire Store",
        cost: 30,
    },
    LegendarySandwich: {
        type: "hunger",
        name: "Legendary Sandwich",
        imageURL: "/assets/items/LegendarySandwich.png",
        info: "IT IS THE LEGENDARY SANDWICH",
        act: "cook",
        need: ["Lettuce", "Bread", "Tomato", "Meat"],
        stats: 50,
    },
    IceCream: {
        type: "hunger",
        name: "Ice Cream",
        imageURL: "/assets/items/IceCream.png",
        info: "Can't go wrong with good old plain vanilla ice cream",
        act: "cook",
        need: ["Milk", "Cheese"],
        stats: 15,
    },
    Pizza: {
        type: "hunger",
        name: "Pizza",
        imageURL: "/assets/items/Pizza.png",
        info: "There's no pineapple on it",
        act: "cook",
        need: ["Tomato", "Meat", "Cheese"],
        stats: 30,
    },
    Coffee: {
        type: "hunger",
        name: "Coffee",
        imageURL: "/assets/items/Coffee.png",
        info: "NEED MORE CAFFEINE!!!",
        act: "cook",
        need: ["Coffee Beans", "Milk"],
        stats: 15,
    },
    Pudding: {
        type: "hunger",
        name: "Pudding",
        imageURL: "/assets/items/Pudding.png",
        info: "Sweet sweet pudding",
        act: "cook",
        need: ["Corn", "Honeycomb"],
        stats: 20,
    },
    Tomato: {
        type: "hunger",
        name: "Tomato",
        imageURL: "/assets/items/Tomato.png",
        info: "Fun fact, tomato is a fruit",
        stats: 1,
    },
    Lettuce: {
        type: "hunger",
        name: "Lettuce",
        imageURL: "/assets/items/Lettuce.png",
        info: "Eat your veggies",
        stats: 1,
    },
    Corn: {
        type: "hunger",
        name: "Corn",
        imageURL: "/assets/items/Corn.png",
        info: "A cobb of corn... nice",
        stats: 1,
    },
    Honeycomb: {
        type: "misc",
        name: "Honeycomb",
        imageURL: "/assets/items/Honeycomb.png",
        info: "Don't be fooled, you can't eat this",
    },
    GemOfHell: {
        type: "misc",
        name: "Gem of Hell",
        imageURL: "/assets/items/GemOfHell.png",
        info: "MINE! MINE! MINE!",
    },
    Log: {
        type: "misc",
        name: "Log",
        imageURL: "/assets/items/Log.png",
        info: "Just a wooden log, I don't know what you are expecting",
    },
    GoldCrystal: {
        type: "misc",
        name: "Gold Crystal",
        imageURL: "/assets/items/GoldCrystal.png",
        info: "Fancy crystal. Cool",
    },
    Burger: {
        type: "hunger",
        name: "Burger",
        imageURL: "/assets/items/Burger.png",
        info: "A good old fashion burger",
        store: "Tavern Cafe",
        cost: 10,
        stats: 10,
    },
    GlazeDonut: {
        type: "hunger",
        name: "Glaze Donut",
        imageURL: "/assets/items/GlazeDonut.png",
        info: "We always have room for dessert",
        store: "Tavern Cafe",
        cost: 5,
        stats: 8,
    },
    Cupcake: {
        type: "hunger",
        name: "Cupcake",
        imageURL: "/assets/items/Cupcake.png",
        info: "It's a fancy cupcake, you should eat it!",
        store: "Tavern Cafe",
        cost: 12,
        stats: 15,
    },
    Hotdog: {
        type: "hunger",
        name: "Hotdog",
        imageURL: "/assets/items/Hotdog.png",
        info: "Who doesn't love a hotdog. You?",
        store: "Tavern Cafe",
        cost: 15,
        stats: 20,
    },
    VanillaCake: {
        type: "hunger",
        name: "Vanilla Cake",
        imageURL: "/assets/items/VanillaCake.png",
        info: "It's a yummy cake, trust",
        store: "Tavern Cafe",
        cost: 20,
        stats: 50,
    },
    SingingWood: {
        type: "misc",
        name: "Singing Wood",
        imageURL: "/assets/items/SingingWood.png",
        info: "It's a wood that can sing... surprising",
        act: "craft",
        need: ["Log", "Blue Ore"],
    },
    GoldenBell: {
        type: "energy",
        name: "Golden Bell",
        imageURL: "/assets/items/GoldenBell.png",
        info: "It's a golden bell. I heard it makes quite a nice ring",
        act: "craft",
        need: ["Gold Crystal", "Brick of Fire"],
        stats: 100,
    },
    BrownMushroomOfUnderworld: {
        type: "hunger",
        name: "Brown Mushroom of Underworld",
        imageURL: "/assets/items/BrownMushroom.png",
        info: "It's a very very very brown mushroom... I heard it taste very good though",
        act: "craft",
        need: ["Bread", "Honeycomb", "Emerald Stone"],
        stats: 100,
    },
    GlassShard: {
        type: "shard1",
        name: "Glass Shard",
        imageURL: "/assets/items/shard1.png",
        info: "A fragment that was once lost",
    },
    GlassShard1: {
        type: "shard2",
        name: "Glass Shard",
        imageURL: "/assets/items/shard2.png",
        info: "A fragment that was once lost",
    },
    GlassShard2: {
        type: "shard3",
        name: "Glass Shard",
        imageURL: "/assets/items/shard3.png",
        info: "A fragment that was once lost",
    },
    GlassShard3: {
        type: "shard4",
        name: "Glass Shard",
        imageURL: "/assets/items/shard4.png",
        info: "A fragment that was once lost",
    },
    Letter: {
        type: "letter",
        name: "Letter",
        imageURL: "/assets/items/Letter.png",
        info: "Letter with some usefull information",
    },
};

/* ALL ITEMS TYPES = seed, misc, weapon, experience, happiness, hunger, energy, shard1, shard2, shard3, shard4 (If there are any types that are miss, please fill it in) */

export default itemData;
