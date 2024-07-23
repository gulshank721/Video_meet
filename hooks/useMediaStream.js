import { useEffect, useRef, useState } from "react";

const useMediaStream = () => {
  const [media, setMedia] = useState(null);
  const isStreamSet = useRef(false);
  const streamRef = useRef(null);

  useEffect(() => {
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("Setting your stream");
        setMedia(stream);
        streamRef.current = stream;
      } catch (error) {
        console.error("Error accessing media devices", error);
      }
    };

    if (!isStreamSet.current) {
      isStreamSet.current = true;
      initStream();
    }

    return () => {
      console.log("Cleanup function called");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          console.log(`Stopping track kind: ${track.kind}`);
          track.stop();
        });
        streamRef.current = null;
        setMedia(null); // Clear the media state
        console.log("Stopping your stream");
      }
    };
  }, []);

  return { stream: media };
};

export default useMediaStream;
