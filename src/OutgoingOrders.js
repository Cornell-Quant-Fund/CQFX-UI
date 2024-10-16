import React, { useState, useEffect } from 'react';

const OutgoingOrders = ({ username, getOrders, cancelOrder, getPnL }) => {
  const [orders, setOrders] = useState([]);
  const [pnl, setPnl] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders(username);
      setOrders(data);
    };

    const fetchPnL = async () => {
      const pnlData = await getPnL(username);
      setPnl(pnlData.pnl);  // Assuming response is { pnl }
    };

    fetchOrders();
    fetchPnL();

    // Set up periodic fetching of orders and PnL every 10 seconds
    const intervalId = setInterval(() => {
      fetchOrders();
      fetchPnL();
    }, 10000);  // 10 seconds interval

    return () => clearInterval(intervalId);
  }, [getOrders, getPnL, username]);

  const handleCancel = async (orderId) => {
    const success = await cancelOrder(username, orderId);
    if (success) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div className="outgoing-orders">
      <h3>Outgoing Orders & Current PnL</h3>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order">
            <span>{order.symbol} - {order.size}@{order.price}</span>
            <button onClick={() => handleCancel(order.id)} className="cancel-button">
              Cancel
            </button>
          </div>
        ))}
      </div>
      <div className="pnl">
        <h4>Current PnL: ${pnl.toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default OutgoingOrders;
