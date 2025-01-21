import React from "react";
import ReactLoading from "react-loading";


const Loading = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="w-25 h-25 flex flex-col items-center justify-center">
                <ReactLoading type="spinningBubbles" color="#ee7724" width={70} />
                <span className="text-xl font-bold text-gray-500 mt-4">
                    Cargando...
                </span>
            </div>
        </div>         
    );
}



export default Loading;