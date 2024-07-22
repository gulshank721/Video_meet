import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket =()=>{
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider =({children})=>{
    const [socket, setSocket] = useState();

    useEffect(()=>{
     const connection  = io();
     setSocket(connection)   
    },[]);

    socket?.on('connect_error', async(err)=>{
        console.log("Error extablishing socket", err)
        await fetch('/api/socket')
    })

    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}

