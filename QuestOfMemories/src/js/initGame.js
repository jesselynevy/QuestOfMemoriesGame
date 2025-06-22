import mapRender from "./scenes/mapRender"; 
import treehouse from "./scenes/tree";
import tavern from "./scenes/tavern";
import volcano from "./scenes/volcano";
import cave from "./scenes/cave";
import { updatePlayerImage } from "./entities/player";
import { stopSceneMusic } from "./soundManager";

export default function initGame(canvas) {
  if (!canvas) throw new Error("Canvas is required");

  let currentScene = null;
  let currentSceneCleanup = null; 
  let currentSceneInstance = null;

  const scenes = {
    mapRender: async () => {
      await updatePlayerImage();
      return await mapRender(canvas, go); 
    },
    tree: async () => { 
      return await treehouse(canvas, go);
    },
    tavern: async () => {
      return await tavern(canvas, go);
    },
    volcano: async ()=>{
      return await volcano(canvas, go);
    },
    cave: async () => {
      return await cave(canvas, go);
    },
  };

  async function go(sceneName) {
    if (!scenes[sceneName]) {
      console.warn(`Scene "${sceneName}" not found`);
      return;
    }

    stopSceneMusic();
    if (currentSceneCleanup) {
      currentSceneCleanup();
      currentSceneCleanup = null;
    }

    currentScene = scenes[sceneName];
    //const sceneResult = await currentScene();
    currentSceneInstance = await currentScene();

    if (currentSceneInstance && typeof currentSceneInstance.cleanup === "function") {
      currentSceneCleanup = currentSceneInstance.cleanup;
    }
  }

  return {
    go,
    getCurrentSceneInstance: () => currentSceneInstance
  };
}
