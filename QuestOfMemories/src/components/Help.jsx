import React, { useState } from "react";
import { store, usingUI } from "./../js/gameManager";
import "./../css/helpOverlay.css";

const Help = () => {
    const [isOpen, setIsOpen] = useState(false);

    const helpOverlay = () => {
        const ui = store.get(usingUI);
        store.set(usingUI, !ui);
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button onClick={helpOverlay} className="cursor-pointer">
                <img
                    src="/assets/buttons/help.png"
                    className="w-full h-6 sm:h-8 md:h-10 lg:h-12"
                />
            </button>

            {isOpen && (
                <div className="help-overlay fixed inset-0 bg-opacity-60 flex justify-center items-center z-50 textbox">
                    <div className="help-content bg-[rgb(170,235,130)] p-6 rounded-lg max-w-sm lg:max-w-md w-full relative shadow-lg border-4 border-[#4f4219]">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black cursor-pointer"
                            onClick={helpOverlay}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold text-[#644709]">How to Play ?</h2>
                        <hr className="mb-2" />
                        <ul className="list-disc list-inside text-md font-semibold space-y-2 text-[#402e07]">
                            <li>Use arrow keys or WASD or buttons to move.</li>
                            <li>Use space bar or attack button to attack.</li>
                            <li>Click on objects to interact.</li>
                            <li>Click the textbox to continue the dialogue.</li>
                            <li>Check your inventory after doing activities</li>
                            <li>Make sure to take care of your status.</li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Help;
