import React, { useState } from 'react';

const SendOrder = ({ createOrder, username, symbols }) => {
  const [symbol, setSymbol] = useState(symbols[0]);
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('buy');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { symbol, size, price, type: orderType };
    await createOrder(username, orderData);
    setSize('');
    setPrice('');
  };

  return (
    <div className="send-order">
      <h3>Send Order</h3>
      <div className="tabs">
        <button
          className={orderType === 'buy' ? 'active' : ''}
          onClick={() => setOrderType('buy')}
        >
          Buy
        </button>
        <button
          className={orderType === 'sell' ? 'active' : ''}
          onClick={() => setOrderType('sell')}
        >
          Sell
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Symbol</label>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
        <label>Size</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default SendOrder;
