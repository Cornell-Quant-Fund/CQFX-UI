import React, { useState, useEffect } from "react";
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

	if (!username) {
		return <LoginPage onLogin={handleLogin} />;
	}

	if (assets.length === 0) {
		return <div>Loading assets...</div>;
	}

	// Show the trading tabs after login
	return (
		<div className="App">
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
