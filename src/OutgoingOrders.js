import React, { useState, useEffect } from "react";
import { getCompletedOrders } from "./api";

const OutgoingOrders = ({ username, getOrders, cancelOrder }) => {
	const [outgoingOrders, setOutgoingOrders] = useState([]);
	const [completedOrders, setCompletedOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const data = await getOrders(username);  // Fetch outgoing orders
			const completed = await getCompletedOrders(username);  // Fetch completed orders
			setOutgoingOrders(data);
			setCompletedOrders(completed);
		};

		fetchOrders();

		const intervalId = setInterval(() => {
			fetchOrders();
		}, 3000); // 3-second interval to refresh orders

		return () => clearInterval(intervalId);
	}, [getOrders, username]);

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
				{outgoingOrders.map((order) => (
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
				))}
			</div>

			<h3>Completed Orders</h3>
			<div className="completed-orders-list">
				{completedOrders.slice().reverse().map((order) => (
					<div key={order.id} className="order">
						<span>
							{order.asset} - {order.side} {order.qty}@{order.price} (Completed)
						</span>
						{/* Completed orders can't be canceled, so no cancel button */}
					</div>
				))}
			</div>
			</div>
	);
};

export default OutgoingOrders;
