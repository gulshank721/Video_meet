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
        const connection = io({
          transports: ['websocket'],
          // Add any additional options you need here
        });
    
        setSocket(connection);
    
        // connection.on('connect_error', async (err) => {
        //   console.log("Error establishing socket", err);
        //   await fetch('/api/socket'); // Adjust this endpoint as needed
        // });
    
        return () => {
          connection.close();
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

