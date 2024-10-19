import React, { useState, useEffect } from "react";

const SentOrders = ({ username, getAllSentOrders, cancelOrder }) => {
  const [outgoingOrders, setOutgoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { outgoing, completed } = await getAllSentOrders(username);
      setOutgoingOrders(outgoing || []);
      setCompletedOrders(completed || []);
    };

    fetchOrders();

    // Periodic fetching every 3 seconds to refresh orders
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [getAllSentOrders, username]);

  const handleCancel = async (orderId) => {
    const success = await cancelOrder(username, orderId);
    if (success) {
      setOutgoingOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    }
  };

  return (
    <div className="orders-container">
      <h3>Outgoing Orders</h3>
      <div className="orders-list">
        {outgoingOrders.length === 0 ? (
          <p>No outgoing orders.</p>
        ) : (
          outgoingOrders.map((order) => (
            <div key={order.id} className="order">
              <span>
                {order.asset} - {order.side} {order.qty}@{order.price}
              </span>
              <button
                onClick={() => handleCancel(order.id)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          ))
        )}
      </div>

      <h3>Completed Orders</h3>
      <div className="completed-orders-list">
        {completedOrders.length === 0 ? (
          <p>No completed orders.</p>
        ) : (
          completedOrders.slice().reverse().map((order) => (
            <div key={order.id} className="order">
              <span>
                {order.asset} - {order.side} {order.qty}@{order.price} (Completed)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentOrders;
