// import React, { useEffect, useState } from "react";
// import { dummyStocks } from "./dummyStock";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// export default function StockMain() {
//   const [stocks, setStocks] = useState([
//     { name: "종목1", data: [] },
//     { name: "종목2", data: [] },
//     { name: "종목3", data: [] },
//     { name: "종목4", data: [] },
//     { name: "종목5", data: [] },
//     { name: "종목6", data: [] },
//   ]);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/ws/stocks");

//     ws.onopen = () => {
//       console.log("WebSocket 연결됨");
//     };

//     ws.onmessage = (event) => {
//       const incomingData = JSON.parse(event.data);
//       /**
//        * 서버에서 오는 데이터 예시:
//        * {
//        *   "종목명": "두산에너빌리티",
//        *   "time": "10:00",
//        *   "price": 40350
//        * }
//        */
//       setStocks((prev) => {
//         return prev.map((stock) =>
//           stock.name === incomingData.종목명
//             ? {
//                 ...stock,
//                 data: [...stock.data, { time: incomingData.time, price: incomingData.price }].slice(-30), // 최근 30개만 유지
//               }
//             : stock
//         );
//       });
//     };

//     ws.onclose = () => {
//       console.log("WebSocket 연결 종료됨");
//     };

//     return () => ws.close();
//   }, []);

//   return (
//     <div>
//       <h1>실시간 주식 차트</h1>
//       <div style={{ display: "flex", flexWrap: "wrap" }}>
//         {stocks.map((stock, idx) => (
//           <div key={idx} style={{ margin: "10px" }}>
//             <h3>{stock.name}</h3>
//             <LineChart width={300} height={200} data={stock.data}>
//               <XAxis dataKey="time" />
//               <YAxis domain={["auto", "auto"]} />
//               <CartesianGrid stroke="#ccc" />
//               <Tooltip />
//               <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
//             </LineChart>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { dummyStocks } from "./dummyStock";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Sidebar from "./components/Sidebar";

export default function StockMain() {
  const [stocks, setStocks] = useState(dummyStocks);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ 클릭된 종목명을 서버로 전송
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
    const ws = new WebSocket("ws://localhost:8000/ws/stocks");

    ws.onopen = () => {
      console.log("WebSocket 연결됨");
    };

    ws.onmessage = (event) => {
      const incomingData = JSON.parse(event.data);
      setStocks((prev) =>
        prev.map((stock) =>
          stock.name === incomingData.종목명
            ? {
                ...stock,
                data: [
                  ...stock.data,
                  { time: incomingData.time, price: incomingData.price },
                ].slice(-30),
              }
            : stock
        )
      );
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료됨");
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex">
      {/* ✅ Sidebar에 props 넘기기 */}
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        stockList={stocks}
        onSelectStock={handleSelectStock}
      />

      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">📈 실시간 주식 차트</h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {stocks.map((stock, idx) => (
            <div key={idx} style={{ margin: "10px" }}>
              <h3>{stock.name}</h3>
              <LineChart width={300} height={200} data={stock.data}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
