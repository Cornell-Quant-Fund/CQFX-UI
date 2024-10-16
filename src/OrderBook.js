import React, { useState, useEffect } from 'react';

const OrderBook = ({ getOrderBook, assets }) => {
  const [activeAsset, setActiveAsset] = useState(assets[0]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchOrderBook = async () => {
      const data = await getOrderBook(activeAsset);
      if (data) {
        setOrderBook({ bids: data["bids"], asks: data["asks"] });
      }
    };

    fetchOrderBook();
  }, [activeAsset, getOrderBook]);

  return (
    <div className="order-book">
      <div className="tabs">
        {assets.map((asset) => (
          <button
            key={asset}
            onClick={() => setActiveAsset(asset)}
            className={activeAsset === asset ? 'active' : ''}
          >
            {asset}
          </button>
        ))}
      </div>
      <div className="orders">
        <h3>{activeAsset} Order Book</h3>
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
