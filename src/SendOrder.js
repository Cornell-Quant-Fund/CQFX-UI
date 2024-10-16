import React, { useState } from 'react';

const SendOrder = ({ createOrder, username, symbols }) => {
  const [symbol, setSymbol] = useState(symbols[0]);
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [orderType, setOrderType] = useState('bid');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { order_type: "limit", side: orderType, qty: parseFloat(qty), price: parseFloat(price), lifespan: 30000 };
    await createOrder(username, orderData, symbol);
    setPrice('');
    setQty('');
  };

  return (
    <div className="send-order">
      <h3>Send Order</h3>
      <div className="tabs">
        <button
          className={orderType === 'bid' ? 'active' : ''}
          onClick={() => setOrderType('bid')}
        >
          Bid
        </button>
        <button
          className={orderType === 'ask' ? 'active' : ''}
          onClick={() => setOrderType('ask')}
        >
          Ask
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
        
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label>Qty</label>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default SendOrder;
