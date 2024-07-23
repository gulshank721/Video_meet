import { useSocket } from '@/context/socket';
import { cloneDeep } from 'lodash';
import { Router, useRouter } from 'next/router';
import React, { useState } from 'react'

 const usePlayer = (myId, roomId, peer) => {
    const router = useRouter();
    const socket=  useSocket();
    const [players, setPlayers] = useState([]);
    const playersCopy = cloneDeep(players)

    const highlightedPlayer = playersCopy[myId];
    delete playersCopy[myId];

    const nonHighlightedPlayers = playersCopy;

    const toggleAudio = ()=>{
        
        setPlayers((prev)=>{
            const copy = cloneDeep(prev)
            copy[myId].muted = !copy[myId].muted ;
            return {...copy}
        })
        socket.emit('user-toggle-audio', myId, roomId);
    }
    const toggleVideo = ()=>{
        setPlayers((prev)=>{
            const copy = cloneDeep(prev)
            console.log(copy);
            copy[myId].playing = !copy[myId].playing ;
            return {...copy}
        })
        socket.emit('user-toggle-video', myId, roomId);
    }

    const leaveRoom = ()=>{
        socket.emit('user-leave', myId, roomId);
        console.log("leaving room", roomId);
        peer?.disconnect();
        router.push('/')
        
    }

  return {players, setPlayers, highlightedPlayer, nonHighlightedPlayers, toggleAudio, toggleVideo,leaveRoom }
}

export default usePlayer;