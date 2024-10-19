import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter();

const BASE_URL = 'https://cqf-exchange.com';  // Replace with API URL

// assets array
const assets = ['AUTO', 'SEMI', 'OIL', 'RENEW', 'TECH', 'FIN'];

let news = [];

// Function to fetch and update global news
export const updateNews = async (username) => {
    try {
        const latestNews = await fetchNews(username);  // Fetch the latest news
        // Compare with the current news
        if (JSON.stringify(latestNews) !== JSON.stringify(news)) {
            news = latestNews;  // Update the global news variable

            // Emit an event notifying that news has changed
            eventEmitter.emit('news', {
                message: 'News has been updated!',
                news: latestNews
            });
        }
    } catch (error) {
        console.error('Error updating news:', error);
    }
};

// Function to fetch available assets (in case it's dynamic later)
export const getAssets = async () => {
  return assets;
};

export const getAllSentOrders = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/order/all/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: username
            }),
        });
        if (!response.ok) {
            throw new Error('Error fetching orders');
        }
        const result = await response.json();
        return result["orders"];  // Assuming the response format is {outgoing:, completed: }
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getOrderBookInfo = async (asset, username) => {
    try {
        const response = await fetch(`${BASE_URL}/orderbook/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                asset: asset,
                user: username
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching order book for ${asset}`);
        }
        const result = await response.json();
        return result["data"];  // Assuming the response format is { bids: [...], asks: [...], pnl:, cash:, position:, trades }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to create a new order
export const createOrder = async (username, order, asset) => {
    try {
        const response = await fetch(`${BASE_URL}/order/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: username,
                order: order,
                asset: asset
            }),
        });
        if (!response.ok) {
            throw new Error('Error creating order');
        }
        const result = await response.json();
        eventEmitter.emit('notification', {
            message: 'Order created successfully!',
            type: 'success',
        });
        return result["order_id"];
    } catch (error) {
        console.error(error);
        eventEmitter.emit('notification', {
            message: 'Failed to create order.',
            type: 'error',
        });
        return null;
    }
};

// Function to cancel an existing order by ID
export const cancelOrder = async (username, orderId) => {
    try {
        const response = await fetch(`${BASE_URL}/order/cancel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user: username,
                order_id: orderId 
            }),
        });
        if (!response.ok) {
        throw new Error('Error canceling order');
        }
        eventEmitter.emit('notification', {
            message: 'Order cancelled successfully!',
            type: 'success',
        });
        return true;
    } catch (error) {
        console.error(error);
        eventEmitter.emit('notification', {
            message: 'Failed to cancel order.',
            type: 'error',
        });
        return false;
    }
};



// Function to fetch market news
export const fetchNews = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/news/get/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: username }),
        });
        if (!response.ok) {
            throw new Error('Error fetching news');
        }
        const data = await response.json();
        return data; // Assuming the response format is [{ headline, timestamp, source }]
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Function to fetch market news
export const submitAnswer = async (username, question_id, answer) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user: username,
                question_id: question_id,
                answer: answer
             }),
        });
        if (!response.ok) {
        throw new Error('Error fetching news');
        }
        return true;
    } catch (error) {
        console.error(error);
        return [];
    }
};