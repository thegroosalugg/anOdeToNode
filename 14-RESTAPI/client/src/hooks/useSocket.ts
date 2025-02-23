import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/util/fetchData";
import { captainsLog } from "@/util/captainsLog";

export default function useSocket(msg: string) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
      socketRef.current = io(BASE_URL);

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          captainsLog([-100, 360], [`SOCKET ${msg} disconnect`]); // **LOGDATA
        }
      };
    }, [msg]);

    return socketRef.current;
}
