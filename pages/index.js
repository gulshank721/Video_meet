import { useSocket } from "@/context/socket";
import { useEffect } from "react";

export default function Home() {
  const socket = useSocket();

  useEffect(()=>{
    socket?.on("connect",()=>{
      console.log("server Connected Hogya")
    })
  },[])
  
  return (
    <div>Hello Socket Hua bro</div>
  )
}
