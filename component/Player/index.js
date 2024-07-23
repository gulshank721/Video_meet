import React from "react";
import ReactPlayer from "react-player";
import styles from "./index.module.css";
import { Mic, MicOff, UserSquare2 } from "lucide-react";
const Player = (props) => {
  const { playerId, url, muted, playing, isActive } = props;
  // console.log(props);
  return (
    <div
      className={`${styles.playerContainer} ${
        isActive ? styles.active : styles.notActive
      } ${!playing ? styles.notPlaying : ""}`}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width={"100%"}
          height={"100%"}
          style={{ borderRadius: "10px", overflow: "hidden" }}
        ></ReactPlayer>
      ) : (
        <>
          <UserSquare2 className={styles.user} size={isActive ? 400 : 150} />
        </>
      )}

      {!isActive ? (
        muted ? (
          <MicOff className={styles.icon} size={20} />
        ) : (
          <Mic className={styles.icon} size={20} />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Player;
