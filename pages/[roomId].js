import Player from "@/component/Player";
import { useSocket } from "@/context/socket";
import useMediaStream from "@/hooks/useMediaStream";
import { usePeer } from "@/hooks/usePeer";
import usePlayer from "@/hooks/usePlayer";
import { useParams } from "next/navigation";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/room.module.css";
import Bottom from "@/component/Bottom";
import { cloneDeep } from "lodash";
import ShareRoomID from "@/component/RoomIDShareComponent";

const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const { roomId } = useRouter().query;
  const {
    players,
    setPlayers,
    highlightedPlayer,
    nonHighlightedPlayers,
    toggleVideo,
    toggleAudio,
    leaveRoom,
  } = usePlayer(myId, roomId, peer);

  const [users, setUsers] = useState([]);

  //   console.log(params);

  useEffect(() => {
   
    if (!socket || !peer || !stream) return;

    const handleUserConnected = (newUser) => {
      console.log(`user connected in room with userId ${newUser}`);

      const call = peer.call(newUser, stream);
      call.on("stream", (incomingStream) => {
        console.log("incoming Stream from ", newUser);
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
        setUsers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
      });
    };
    socket.on("user-connected", handleUserConnected);
    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

  //dealing with control pannels
  useEffect(() => {
    const handleToggleAudio = (userId) => {
      console.log(`${userId} toggled Audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };
    const handleToggleVideo = (userId) => {
      console.log(`${userId} toggled Video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };
    const handleToggleLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const copy = cloneDeep(players);
      delete copy[userId];
      setPlayers(copy);
    };
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleToggleLeave);

    return () => {
      socket.off("user-leave", handleToggleLeave);
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
    };
  }, [setPlayers, socket, users]);

  useEffect(() => {
    if (!peer) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      //sending self stream
      call.answer(stream);
      //recieving others stream
      call.on("stream", (incomingStream) => {
        console.log("Incoming Stream from", callerId);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log("setting my stream", myId);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {highlightedPlayer && (
          <>
            <Player
              key={highlightedPlayer.playerId}
              playerId={highlightedPlayer.playerId}
              url={highlightedPlayer.url}
              muted={highlightedPlayer.muted}
              playing={highlightedPlayer.playing}
              isActive={true}
            />
          </>
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId, index) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              playerId={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      {highlightedPlayer && (
        <Bottom
          muted={highlightedPlayer.muted}
          playing={highlightedPlayer.playing}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveRoom={leaveRoom}
        />
      )}
      <ShareRoomID/>
    </>
  );
};

export default Room;
