import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useSocket } from "@/context/socket";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

export const usePeer = () => {
  const router = useRouter();
  const socket = useSocket();
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState("");
  const { roomId } = router.query;
  //   console.log(roomId);
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;
    let myPeer = new Peer();
    setPeer(myPeer);

    myPeer.on("open", (id) => {
      console.log(`Your Peer Id is ${id}`);
      setMyId(id);
      socket?.emit("join-room", roomId, id);
    });
  
  }, [roomId, socket]);

  return { peer, myId };
};
