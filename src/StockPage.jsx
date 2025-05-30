import React from 'react';
import NotificationBanner from './components/NotificationBanner';
import StockInfoPanel from './components/StockInfoPanel';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';

// 더미 주식 데이터 (노란 박스용)
const dummyStockData = {
  name: "두산에너빌리티",
  c: 150.75,   // 현재가
  d: 2.25,     // 변동폭
  dp: 1.52,    // 변동률(%)
  h: 152.3,    // 고가
  l: 149.1,    // 저가
  o: 149.5,    // 시가
  pc: 148.5,   // 전일 종가
};

// 더미 차트 데이터 (그래프용)
const dummyPriceHistory = [
  { time: "10:00", price: 149.5 },
  { time: "10:01", price: 150.1 },
  { time: "10:02", price: 150.3 },
  { time: "10:03", price: 150.7 },
  { time: "10:04", price: 150.75 },
];

// ✅ 수정된 채팅 메시지 (빨간 박스용)
const dummyMessages = [
  {
    nickname: "재열",
    content: "오늘 두산에너빌리티 잘 가네!",
  },
  {
    nickname: "소영",
    content: "차트 상 저항선 돌파한 듯?",
  },
  {
    nickname: "홍길동",
    content: "150원 넘으면 진입할게요",
  },
];

const StockPage = () => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      {/* 상단 알림 */}
      <NotificationBanner />

      {/* 주식 정보 + 그래프 (노란 박스) */}
      <StockInfoPanel
        stockData={dummyStockData}
        priceHistory={dummyPriceHistory}
      />

      {/* 채팅 내역 (빨간 박스) */}
      <ChatMessageList messages={dummyMessages} />

      {/* ✅ 채팅 입력창 추가 (빨간 박스 아래) */}
      <ChatInput
        onSend={(msg) => {
          console.log('보낸 메시지:', msg);
          // 나중에 WebSocket으로 연결 시 sendMessage(msg)로 교체
        }}
      />
    </div>
  );
};

export default StockPage;
