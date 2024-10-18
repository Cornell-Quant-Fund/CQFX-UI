import React, { useState, useEffect } from "react";
import { eventEmitter } from "./api"; // Import the event emitter
import Notification from "./Notification";
import OrderBook from "./OrderBook";
import OutgoingOrders from "./OutgoingOrders";
import SendOrder from "./SendOrder";
import NewsTab from "./NewsTab";
import TabbedLayout from "./TabbedLayout";
import LoginPage from "./LoginPage";
import {
	getAssets,
	getPosition,
	getOrderBook,
	getTrades,
	getOrders,
	createOrder,
	cancelOrder,
	fetchNews,
	submitAnswer,
	getPnL,
} from "./api";
import "./App.css";

function App() {
	const [assets, setAssets] = useState([]);
	const [username, setUsername] = useState(null);
	const [orderSide, setOrderSide] = useState("bid");
	const [notification, setNotification] = useState({ message: "", type: "" });

	// Fetch assets on component mount
	useEffect(() => {
		const fetchAssets = async () => {
			const assetList = await getAssets();
			setAssets(assetList);
		};

		fetchAssets();
	}, []);

	const handleLogin = (username) => {
		setUsername(username);
	};

	useEffect(() => {
		const handleNotification = ({ message, type }) => {
		  setNotification({ message, type });
		  setTimeout(() => {
			setNotification({ message: "", type: "" });
		  }, 3000);  // Dismiss after 3 seconds
		};
	
		eventEmitter.on('notification', handleNotification);
	
		return () => {
		  eventEmitter.off('notification', handleNotification); // Cleanup
		};
	  }, []);

	if (!username) {
		return <LoginPage onLogin={handleLogin} />;
	}

	if (assets.length === 0) {
		return <div>Loading assets...</div>;
	}

	// Show the trading tabs after login
	return (
		<div className="App">
			<Notification 
				message={notification.message}
				type={notification.type}
				onClose={() => setNotification({ message: "", type: "" })}
			/>
			<TabbedLayout>
				<div label="Order Book">
					<OrderBook
						username={username}
						getOrderBook={getOrderBook}
						getPosition={getPosition}
						getTrades={getTrades}
						getPnL={getPnL}
						assets={assets}
					/>
				</div>
				<div label="Outgoing Orders">
					<OutgoingOrders
						username={username}
						getOrders={getOrders}
						cancelOrder={cancelOrder}
					/>
				</div>
				<div label="Send Order">
					<SendOrder
						createOrder={createOrder}
						username={username}
						assets={assets}
						orderSide={orderSide}
						handleSetOrderSide={setOrderSide}
					/>
				</div>
				<div label="News">
					<NewsTab 
						fetchNews={fetchNews}
						username={username}
						submitAnswer={submitAnswer}
					/>
				</div>
			</TabbedLayout>
		</div>
	);
}

export default App;
