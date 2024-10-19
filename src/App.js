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
	getCompletedOrders,
	createOrder,
	cancelOrder,
	fetchNews,
	submitAnswer,
	getPnL,
} from "./api";
import "./App.css";

function App() {
	const [assets, setAssets] = useState([]);
	const [newsList, setNewsList] = useState([]);
	const [answerList, setAnswerList] = useState([]);
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

		const handleNews = ({ message, type }) => {
			setNotification({ message, type });
			setTimeout(() => {
			  setNotification({ message: "", type: "" });
			}, 8);  // Dismiss after 3 seconds
		  };
	
		eventEmitter.on('notification', handleNotification);
		eventEmitter.on('news', handleNews);

		return () => {
		  eventEmitter.off('notification', handleNotification); // Cleanup
		};
	  }, []);

	  useEffect(() => {
		if (!username) return;
	
		const fetchNewsData = async () => {
		  const data = await fetchNews(username);
		  const newNews = data["news"];
		  const answers = data["answers"];
	
		  // Compare the new news list with the current one and trigger notification if there's a difference
		  if (newNews.length > newsList.length) {
			const latestNews = newNews[newNews.length-1];  // Assuming new news is added to the beginning of the array
			eventEmitter.emit('notification', {
			  message: `New news: ${latestNews}`,
			  type: 'info',
			});
			setNewsList(newNews);  // Update the news list
		  }
		  setAnswerList(answers);
		};
  
	  const intervalId = setInterval(fetchNewsData, 1000);  // Check for new news every 10 seconds
  
	  return () => clearInterval(intervalId);  // Clean up on component unmount
	}, [username, newsList, answerList]);


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
						getCompletedOrders={getCompletedOrders}
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
						username={username}
						newsList={newsList}
						answerList={answerList}
						submitAnswer={submitAnswer}
					/>
				</div>
			</TabbedLayout>
		</div>
	);
}

export default App;
