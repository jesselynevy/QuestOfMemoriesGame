import React, { useEffect, useState } from "react";

// Updated check: Android only, exclude iOS
const isAndroidMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = /mobile/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    return isAndroid && isMobile && !isIOS;
};

const FullscreenButton = () => {
    const [show, setShow] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (isAndroidMobile()) {
            setShow(true);
        }

        // Listen for fullscreen change
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);
        document.addEventListener("webkitfullscreenchange", handleChange); // Safari
        document.addEventListener("mozfullscreenchange", handleChange); // Older Firefox

        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
            document.removeEventListener(
                "webkitfullscreenchange",
                handleChange
            );
            document.removeEventListener("mozfullscreenchange", handleChange);
        };
    }, []);

    const handleFullscreen = () => {
        if (!isAndroidMobile()) return;

        if (!document.fullscreenElement) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    if (!show) return null;

    return (
        <button onClick={handleFullscreen} className="cursor-pointer">
            <img
                src={"/assets/buttons/fullscreen.png"}
                className="w-full h-6 sm:h-8 md:h-10 lg:h-12"
            />
        </button>
    );
};

export default FullscreenButton;
