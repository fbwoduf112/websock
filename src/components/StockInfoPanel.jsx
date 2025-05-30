import StockChart from './StockChart';

function StockInfoPanel({ stockData, priceHistory }) {
  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="text-xl font-bold">{stockData.name}</h2>
      <p className="text-3xl font-semibold">{stockData.c}원</p>
      <p className={stockData.d >= 0 ? "text-red-600" : "text-blue-600"}>
        {stockData.d >= 0 ? '▲' : '▼'} {stockData.d} ({stockData.dp}%)
      </p>
      <p className="text-sm text-gray-500">
        시가 {stockData.o} / 고가 {stockData.h} / 저가 {stockData.l} / 전일 {stockData.pc}
      </p>

      <StockChart data={priceHistory} />
    </div>
  );
}

export default StockInfoPanel;
