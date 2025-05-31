import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Sidebar from "./components/Sidebar";

// 초기 상태: 종목 60개
const createInitialStocks = () => {
  const symbols = Array.from({ length: 60 }, (_, i) => `종목${i + 1}`);
  return symbols.map((symbol) => ({ name: symbol, data: [], isStock: false }));
};

export default function StockMain() {
  const [stocks, setStocks] = useState(createInitialStocks());
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectStock = (selectedStockName) => {
    console.log("선택된 종목:", selectedStockName);

    fetch("http://localhost:8000/api/selectStock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockName: selectedStockName }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("서버 응답:", data);
      })
      .catch((err) => console.error("서버 전송 에러:", err));
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/main");

    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updates = Array.isArray(data) ? data : [data];

      setStocks((prev) => {
        const updatedStocks = [...prev];

        updates.forEach((quote) => {
          const idx = updatedStocks.findIndex((s) => s.name === quote.symbol);

          if (idx !== -1) {
            // 👉 코인 vs 주식: price 값, isStock 플래그
            const isStock = quote.hasOwnProperty("c");
            const price = isStock ? quote.c : parseFloat(quote.p);

            const time =
              quote.time ||
              new Date(quote.created_at || Date.now()).toLocaleTimeString();

            updatedStocks[idx] = {
              ...updatedStocks[idx],
              data: [
                ...updatedStocks[idx].data,
                { time, price },
              ].slice(-30),
              isStock: isStock, // ✅ isStock 여부 업데이트
            };
          }
        });

        return updatedStocks;
      });
    };

    ws.onclose = () => {
      console.log("❌ WebSocket 연결 종료됨");
    };

    return () => ws.close();
  }, []);

  // 👉 코인과 주식을 분리
  const coinStocks = stocks.filter((stock) => !stock.isStock && stock.name.includes(searchTerm));
  const stockStocks = stocks.filter((stock) => stock.isStock && stock.name.includes(searchTerm));

  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        stockList={stocks}
        onSelectStock={handleSelectStock}
      />

      {/* ✅ 차트 영역 */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">📈 실시간 주식/코인 차트</h1>

        {/* ✅ 코인 차트 */}
        <h2 className="text-lg font-semibold mb-2">🪙 코인 차트</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {coinStocks.map((stock, idx) => (
            <div
              key={idx}
              className="border p-2 rounded shadow bg-white flex flex-col items-center"
            >
              <h3 className="text-sm font-semibold mb-1">{stock.name}</h3>
              <LineChart width={300} height={150} data={stock.data}>
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
              <div className="mt-1 text-xs text-gray-700">
                <span className="font-semibold">현재가:</span>{" "}
                {stock.data.length
                  ? stock.data[stock.data.length - 1].price
                  : "-"}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ 주식 차트 */}
        <h2 className="text-lg font-semibold mb-2">📈 주식 차트</h2>
        <div className="grid grid-cols-2 gap-4">
          {stockStocks.map((stock, idx) => (
            <div
              key={idx}
              className="border p-2 rounded shadow bg-white flex flex-col items-center"
            >
              <h3 className="text-sm font-semibold mb-1">{stock.name}</h3>
              <LineChart width={300} height={150} data={stock.data}>
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#82ca9d"
                  dot={false}
                />
              </LineChart>
              <div className="mt-1 text-xs text-gray-700">
                <span className="font-semibold">현재가:</span>{" "}
                {stock.data.length
                  ? stock.data[stock.data.length - 1].price
                  : "-"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
