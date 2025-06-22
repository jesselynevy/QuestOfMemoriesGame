import React from "react";

function Rotate({ platform, onEnterFullScreen }) {
    const enterFullScreen = () => {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen().then(onEnterFullScreen);
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
            onEnterFullScreen();
        } else if (docElm.webkitRequestFullscreen) {
            docElm.webkitRequestFullscreen();
            onEnterFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
            onEnterFullScreen();
        } else {
            onEnterFullScreen();
        }
    };
    return (
        <div className="rotate-screen flex flex-col items-center justify-center h-screen bg-black text-white text-center p-4">
            <style>
                {`
                    @keyframes rotatePhone{
                        0% {
                            transform: rotate(0deg);
                        }
                        25% {
                            transform: rotate(-90deg);
                        }
                        50% {
                            transform: rotate(-90deg);
                        }
                        75% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(0deg);
                        }
                }
              `}
            </style>
            <img
                src="/assets/mobile.png"
                alt="Please rotate your device"
                className="mb-6 w-20"
                style={{ animation: "rotatePhone 3s ease-in-out infinite" }}
            />
            <p className="mb-4 text-lg">
                Please rotate your device for a better experience.
            </p>
            {platform === "android" && (
                <button
                    onClick={enterFullScreen}
                    className="bg-white text-black px-4 py-2 rounded shadow"
                >
                    Enter Fullscreen
                </button>
            )}
            {platform === "ios" && (
                <button
                    onClick={onEnterFullScreen}
                    className="bg-white text-black px-4 py-2 rounded shadow"
                >
                    Continue to Homepage
                </button>
            )}
        </div>
    );
}

export default Rotate;
