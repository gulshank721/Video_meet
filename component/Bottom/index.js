import { Mic, Video, PhoneOff, MicOff, VideoOff } from "lucide-react";
import styles from "@/component/Bottom/index.module.css";

const Bottom = (props) => {
  const { muted, playing, toggleAudio, toggleVideo, leaveRoom } = props;

  return (
    <div className={styles.Bottom}>
      {muted ? (
        <MicOff
          className={`${styles.icon} ${styles.active}`}
          size={50}
          onClick={toggleAudio}
        />
      ) : (
        <Mic className={`${styles.icon}`} size={50} onClick={toggleAudio}/>
      )}
      {playing ? <Video className={`${styles.icon}`} size={50} onClick={toggleVideo} /> : <VideoOff className={`${styles.icon} ${styles.active}`} size={50} onClick={toggleVideo}/>}
      <PhoneOff onClick={leaveRoom} className={`${styles.icon} `} size={50} />
    </div>
  );
};

export default Bottom;
