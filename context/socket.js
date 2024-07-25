import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket =()=>{
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider =({children})=>{
    const [socket, setSocket] = useState();

    useEffect(() => {
        const socket = io('https://video-meet-amber.vercel.app/api/socket', {
          path: '/api/socket',
        });
    
        socket.on('connect', () => {
          console.log('connected to socket server');
        });
    
        socket.on('connect_error', (err) => {
          console.log('Error connecting to socket server:', err);
        });
    
        setSocket(socket);
    
        return () => {
          socket.disconnect();
        };
      }, []);

    socket?.on('connect_error', async(err)=>{
        console.log("Error extablishing socket", err)
        await fetch('/api/socket')
    })

    return <SocketContext.Provider value={socket}>
        {socket ? children : <div>Connecting...</div>}
    </SocketContext.Provider>
}

