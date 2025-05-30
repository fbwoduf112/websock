import { useState, useEffect, useRef } from 'react';

export const useStockWebSocket = (stockCode) => {
  const [stockData, setStockData] = useState({
    symbol: '034020',
    name: '두산에너빌리티',
    currentPrice: 40650,
    change: -1550,
    changePercent: -3.67,
    volume: 40700,
    volumeChange: 1500,
    volumeChangePercent: -3.55,
    lastUpdate: '05.30 10:07'
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectStockWS = () => {
      wsRef.current = new WebSocket(`ws://localhost:8000/ws/stock/${stockCode}`);
      
      wsRef.current.onopen = () => {
        console.log('주식 웹소켓 연결됨');
        setIsConnected(true);
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setStockData(prevData => ({
          ...prevData,
          ...data,
          lastUpdate: new Date().toLocaleTimeString('ko-KR', { 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));
      };
      
      wsRef.current.onclose = () => {
        console.log('주식 웹소켓 연결 끊김');
        setIsConnected(false);
        setTimeout(connectStockWS, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('주식 웹소켓 에러:', error);
      };
    };

    connectStockWS();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stockCode]);

  return { stockData, isConnected };
};

export const useChatWebSocket = (stockCode) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      username: 'solo****',
      content: '찐이냐...뽑이냐...그것이 문제로다',
      time: '1분 전',
      likes: 0,
      dislikes: 0
    },
    {
      id: 2,
      username: 'gd******',
      content: '100평 오르고',
      time: '1분 전',
      likes: 0,
      dislikes: 0
    }
  ]);
  const chatWsRef = useRef(null);

  useEffect(() => {
    const connectChatWS = () => {
      chatWsRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${stockCode}`);
      
      chatWsRef.current.onopen = () => {
        console.log('채팅 웹소켓 연결됨');
      };
      
      chatWsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: message.username,
          content: message.content,
          time: '방금 전',
          likes: 0,
          dislikes: 0
        }]);
      };
      
      chatWsRef.current.onclose = () => {
        console.log('채팅 웹소켓 연결 끊김');
        setTimeout(connectChatWS, 3000);
      };
    };

    connectChatWS();

    return () => {
      if (chatWsRef.current) {
        chatWsRef.current.close();
      }
    };
  }, [stockCode]);

  const sendMessage = (content) => {
    if (content.trim() && chatWsRef.current) {
      const message = {
        username: 'user****',
        content,
        timestamp: new Date().toISOString()
      };
      
      chatWsRef.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
};

