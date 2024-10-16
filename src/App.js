import React, { useState, useEffect } from 'react';
import OrderBook from './OrderBook';
import OutgoingOrders from './OutgoingOrders';
import SendOrder from './SendOrder';
import NewsTab from './NewsTab';
import TabbedLayout from './TabbedLayout';
import LoginPage from './LoginPage';
import { getSymbols, getOrderBook, getOrders, createOrder, cancelOrder, fetchNews, getPnL } from './api';
import './App.css';

function App() {
  const [symbols, setSymbols] = useState([]);
  const [username, setUsername] = useState(null);

  // Fetch symbols on component mount
  useEffect(() => {
    const fetchSymbols = async () => {
      const symbolList = await getSymbols();
      setSymbols(symbolList);
    };

    fetchSymbols();
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
  };

  if (!username) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (symbols.length === 0) {
    return <div>Loading symbols...</div>;
  }

  // Show the trading tabs after login
  return (
    <div className="App">
      <TabbedLayout>
        <div label="Order Book">
          <OrderBook getOrderBook={getOrderBook} symbols={symbols} />
        </div>
        <div label="Outgoing Orders">
          <OutgoingOrders
            username={username}
            getOrders={getOrders}
            cancelOrder={cancelOrder}
            getPnL={getPnL}
          />
        </div>
        <div label="Send Order">
          <SendOrder
            createOrder={createOrder}
            username={username}
            symbols={symbols}
          />
        </div>
        <div label="News">
          <NewsTab fetchNews={fetchNews} />
        </div>
      </TabbedLayout>
    </div>
  );
}

export default App;
