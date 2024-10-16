import React, { useState, useEffect } from "react";

const OutgoingOrders = ({ username, getOrders, cancelOrder }) => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const data = await getOrders(username);
			setOrders(data);
		};

		fetchOrders();

		// Set up periodic fetching of orders and PnL every 10 seconds
		const intervalId = setInterval(() => {
			fetchOrders();
		}, 1000); // 1 seconds interval

		return () => clearInterval(intervalId);
	}, [getOrders, username]);

	const handleCancel = async (orderId) => {
		const success = await cancelOrder(username, orderId);
		if (success) {
			setOrders((prevOrders) =>
				prevOrders.filter((order) => order.id !== orderId)
			);
		}
	};
	console.log(orders);

	return (
		<div className="outgoing-orders">
			<h3>Outgoing Orders</h3>
			<div className="orders-list">
				{orders.map((order) => (
					<div key={order.id} className="order">
						<span>
							{order.asset} - {order.side} {order.qty}@
							{order.price}
						</span>
						<button
							onClick={() => handleCancel(order.id)}
							className="cancel-button"
						>
							Cancel
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default OutgoingOrders;
