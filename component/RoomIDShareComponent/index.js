import { CopyIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "@/component/RoomIDShareComponent/index.module.css";

const ShareRoomID = () => {
  const router = useRouter();
  const { roomId } = router.query;
  // console.log(roomId);
  const [tooltipText, setTooltipText] = useState("Copy Text");

  const handleCopyRoomID = () => {
    // Copy the text inside the text field
    navigator.clipboard.writeText(roomId).then(() => {
      setTooltipText(`Copied: ${roomId}`);
    });
  };

  const handleMouseLeave = () => {
    setTooltipText("Copy Text");
  };
  return (
    <div className={styles.shareContainer}>
      <p>Share the Room id with Others that you want in this meeting</p>
      <div className="">
        <p className="">{roomId}</p>

        <div className={styles.tooltip}>
          <p className={styles.tooltiptext}>{tooltipText}</p>
          <CopyIcon
            onClick={handleCopyRoomID}
            onMouseLeave={handleMouseLeave}
            className={styles.copyIcon}
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default ShareRoomID;
