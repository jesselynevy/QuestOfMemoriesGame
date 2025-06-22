import React from "react";

const LoadingScreen = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-black text-white text-2xl textbox">
            <p className="animate-pulse">Loading assets...</p>
        </div>
    );
};

export default LoadingScreen;
