import { preloadAssets } from "./js/utils";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "jotai";
import { store } from "./js/gameManager";

// Components Import
import Homepage from "./routes/Homepage";
import MainGame from "./routes/MainGame";
import Intro from "./routes/Intro";
import Error from "./routes/Error";
import Rotate from "./routes/Rotate";
import GameOver from "./routes/GameOver";
import LoadingScreen from "./routes/LoadingScreen";

const App = () => {
    const [platform, setPlatform] = useState(null);
    const [fullScreenEntered, setFullScreenEntered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userAgent =
            navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            setPlatform("android");
        } else if (/iPad|iPhone|iPod/.test(userAgent)) {
            setPlatform("ios");
        }
    }, []);

    useEffect(() => {
        const assetsToPreload = [
            "/assets/backgrounds/morningBg.png",
            "/assets/backgrounds/dayBg.png",
            "/assets/backgrounds/afternoonBg.png",
            "/assets/backgrounds/nightBg.png",
            "/assets/title.png",
            "/assets/legacy/finn_legacy.png",
            "/assets/legacy/jake_legacy.png",
            "/assets/legacy/princess-bubblegum_legacy.png",
            "/assets/legacy/marceline_legacy.png",
            "/assets/legacy/ice-king_legacy.png",
            "/assets/backgrounds/textbox.png",
            "/assets/buttons/left.png",
            "/assets/buttons/right.png",
            "/assets/buttons/back.png",
            "/assets/buttons/start.png",
            "/assets/buttons/input.png",
        ];

        preloadAssets(assetsToPreload).then(() => {
            setLoading(false);
        });
    }, []);

    if (platform && !fullScreenEntered) {
        return (
            <Rotate
                platform={platform}
                onEnterFullScreen={() => setFullScreenEntered(true)}
            />
        );
    }

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/Intro" element={<Intro />} />
                    <Route
                        path="/Main"
                        element={
                            <Provider store={store}>
                                <MainGame />
                            </Provider>
                        }
                    />
                    <Route
                        path="/GameOver"
                        element={
                            <Provider store={store}>
                                <GameOver />
                            </Provider>
                        }
                    />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
