import React, { useState, useEffect } from 'react';

const OrderBook = ({ getOrderBook, symbols }) => {
  const [activeSymbol, setActiveSymbol] = useState(symbols[0]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchOrderBook = async () => {
      const data = await getOrderBook(activeSymbol);
      if (data) {
        setOrderBook({ bids: data["bids"], asks: data["asks"] });
      }
    };

    fetchOrderBook();
  }, [activeSymbol, getOrderBook]);

  return (
    <div className="order-book">
      <div className="tabs">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            onClick={() => setActiveSymbol(symbol)}
            className={activeSymbol === symbol ? 'active' : ''}
          >
            {symbol}
          </button>
        ))}
      </div>
      <div className="orders">
        <h3>{activeSymbol} Order Book</h3>
        <div className="bids-asks">
          <div>
            <h4>Bids</h4>
            <ul>
              {Object.entries(orderBook.bids)
                .sort(([priceA], [priceB]) => priceB - priceA)
                .slice(0, 5)
                .map(([price, quantity]) => (
                  <li key={price}>
                    {price}: {quantity}
                  </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Asks</h4>
            <ul>
              {Object.entries(orderBook.asks)
                .sort(([priceA], [priceB]) => priceA - priceB)
                .slice(0, 5)
                .map(([price, quantity]) => (
                  <li key={price}>
                    {price}: {quantity}
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
