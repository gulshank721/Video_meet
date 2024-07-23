import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import styles from "@/styles/home.module.css";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState();
  const router = useRouter();

  const createAndJoin = () => {
    const roomId = uuid();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) {
      router.push(`/${roomId}`);
    } else {
      alert("please enter a valid room id");
    }
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.h1}>Video Meet Room</h1>
      <div className={styles.enterRoom}>
        <input
          className=""
          placeholder="Enter Room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="" onClick={joinRoom}>
          Join Room
        </button>
        <span className={styles.seperatorText}></span>
      <button onClick={createAndJoin} className={styles.btnCreateRoom}>
        Create a New room
      </button>
      </div>
      
    </div>
  );
}
