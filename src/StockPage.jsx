// StockPage.jsx (메인 컴포넌트)
import React, { useState } from 'react';
import { useStockWebSocket, useChatWebSocket } from './hooks/useWebSocket';
import NotificationBanner from './components/NotificationBanner';
import StockHeader from './components/StockHeader';
import TabNavigation from './components/TabNavigation';
import CompanyInfo from './components/CompanyInfo';
import ChatSection from './components/ChatSection';
import FloatingButton from './components/FloationButton';

const StockPage = () => {
  const [activeTab, setActiveTab] = useState('토론');
  const stockCode = '034020';
  
  // 커스텀 훅 사용
  const { stockData, isConnected } = useStockWebSocket(stockCode);
  const { messages, sendMessage } = useChatWebSocket(stockCode);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <NotificationBanner />
      <StockHeader stockData={stockData} isConnected={isConnected} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <CompanyInfo stockData={stockData} />
      <ChatSection messages={messages} sendMessage={sendMessage} />
      <FloatingButton />
    </div>
  );
};

export default StockPage;