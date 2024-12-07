import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import apiRoutes from './apiRoutes';
import httpClient from './httpClient';

const useSocket = (userId: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<InstanceType<typeof SockJS> | null>(null);

  useEffect(() => {
    const fetchSocketUrl = async () => {
      try {
        const response = await httpClient.get(apiRoutes.socket.staff);
        const socketUrl = response.data.url;
        socket.current = new SockJS(socketUrl);

        socket.current.onopen = () => {
          const userInfo = { id: userId };
          socket.current?.send(JSON.stringify(userInfo));
        };

        socket.current.onmessage = (event: MessageEvent) => {
          try {
            const parsedData = JSON.parse(event.data);
            setMessages((prev) => [...prev, parsedData]);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        socket.current.onclose = (event: CloseEvent) => {
          console.log('Socket closed:', event);
        };
      } catch (error) {
        console.error('Error fetching socket URL:', error);
      }
    };

    fetchSocketUrl();

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
