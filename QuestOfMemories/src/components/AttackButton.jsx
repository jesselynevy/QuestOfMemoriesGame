import React from "react";
const  AttackButton = ({onAttack}) => {
    return (
        <button
            className="absolute bottom-8 right-8 flex justify-center items-center w-[100px] h-[100px] rounded-full bg-white/10 border-3 border-red-600 backdrop-blur z-1000 cursor-pointer active:border-red-600 active:scale-105"
            onTouchStart={onAttack}
            onClick={onAttack}
            draggable="false"
        >
            <p className="text-center gameboy text-white text-sm">Attack</p>
        </button>
    )
}
export default AttackButton;