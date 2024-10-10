import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import apiRoutes from './apiRoutes';

const useSocket = (userId: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<InstanceType<typeof SockJS> | null>(null);

  useEffect(() => {
    socket.current = new SockJS(apiRoutes.socket.staff);

    socket.current.onopen = () => {
      const userInfo = { id: userId };
      socket.current?.send(JSON.stringify(userInfo));
    };

    socket.current.onmessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data);
        setMessages((prev) => [...prev, parsedData]);
      } catch (error) {}
    };

    socket.current.onclose = (event: CloseEvent) => {};

    return () => {
      socket.current?.close();
    };
  }, [userId]);

  const sendMessage = (message: string) => {
    if (socket.current && socket.current.readyState === SockJS.OPEN) {
      socket.current.send(message);
    }
  };

  return { messages, sendMessage };
};

export default useSocket;
