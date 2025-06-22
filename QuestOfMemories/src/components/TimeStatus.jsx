import { useState, useEffect } from "react";

const TimeStatus = () =>{
    const now = new Date();
    const [minutes, setMinutes] = useState(now.getMinutes());
    const [hours, setHours] = useState(now.getHours());

     useEffect(() => {

        const timeInterval = setInterval (() =>{
            setMinutes(prev => {
                if (prev + 1 >= 60) {
                    setHours(h => (h + 1) %24);
                    return 0;  
                }
                return prev + 1;
            });
        }, 1000)
        return () => clearInterval(timeInterval); 
     }, []);

     return (
        <>
        <div>
            <h2 className="text-white text-2xl">{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}</h2>
        </div>
        </>
     )
}
export default TimeStatus;