import kaplay from "kaplay";

let k = null;

const initKaplay = () => {
  if (k) return k;
  k = kaplay({
    width: innerWidth,
    height: innerHeight,
    letterbox: false, //for fullscreen false
    global: false,
    debug: true,
    debugKey: "f2",
    canvas: document.querySelector("#game"),
    pixel: devicePixelRatio,
  });
  return k;
};

export default initKaplay;