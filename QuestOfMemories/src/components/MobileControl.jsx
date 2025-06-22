import React, { useRef } from "react";
import { mobileStartMove, mobileStopMove } from "../js/entities/player";

const useHoldButton = (direction) => {
    const startMoving = () => {
        mobileStartMove(direction);
    };

    const stopMoving = () => {
        mobileStopMove(direction);
    };

    return { startMoving, stopMoving };
};

const MobileControls = () => {
    const up = useHoldButton("up");
    const down = useHoldButton("down");
    const left = useHoldButton("left");
    const right = useHoldButton("right");

    const buttonProps = (controls) => ({
        onMouseDown: controls.startMoving,
        onMouseUp: controls.stopMoving,
        onMouseLeave: controls.stopMoving,
        onTouchStartCapture: () => {
            controls.startMoving();
        },
        onTouchEnd: controls.stopMoving,
        onTouchCancel: controls.stopMoving,
    });

    return (
        <div className="absolute bottom-8 left-8 flex flex-col items-center gap-2 z-50 touch-none">
            <button
                {...buttonProps(up)}
                onContextMenu={(e) => e.preventDefault()}
                className="p-0 w-12 h-12 active:scale-90"
            >
                <img
                    src="/assets/buttons/up-move.png"
                    alt="up"
                    className="w-full h-full pointer-events-none"
                    draggable="false"
                />
            </button>
            <div className="flex gap-2">
                <button
                    {...buttonProps(left)}
                    onContextMenu={(e) => e.preventDefault()}
                    className="p-0 w-12 h-12 active:scale-90"
                >
                    <img
                        src="/assets/buttons/left-move.png"
                        alt="left"
                        className="w-full h-full pointer-events-none"
                        draggable="false"
                    />
                </button>
                <button
                    {...buttonProps(down)}
                    onContextMenu={(e) => e.preventDefault()}
                    className="p-0 w-12 h-12 active:scale-90"
                >
                    <img
                        src="/assets/buttons/down-move.png"
                        alt="down"
                        className="w-full h-full pointer-events-none"
                        draggable="false"
                    />
                </button>
                <button
                    {...buttonProps(right)}
                    onContextMenu={(e) => e.preventDefault()}
                    className="p-0 w-12 h-12 active:scale-90"
                >
                    <img
                        src="/assets/buttons/right-move.png"
                        alt="right"
                        className="w-full h-full pointer-events-none"
                        draggable="false"
                    />
                </button>
            </div>
        </div>
    );
};

export default MobileControls;
