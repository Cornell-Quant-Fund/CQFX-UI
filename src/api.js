const BASE_URL = 'http://3.141.103.158';  // Replace with API URL

// Symbols array
const symbols = ['AUTO', 'SEMI', 'OIL', 'RENEW', 'TECH', 'FIN'];

// Function to fetch available symbols (in case it's dynamic later)
export const getSymbols = async () => {
  return symbols;
};

// Function to fetch user's outgoing orders
export const getOrders = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/${username}/getOrders`);
        if (!response.ok) {
            throw new Error('Error fetching orders');
        }
        const data = await response.json();
        return data;  // Assuming the response format is [{ id, symbol, size, price, type }]
    } catch (error) {
        console.error(error);
        return [];
    }
};
  
// Function to create a new order
export const createOrder = async (username, order, symbol) => {
    try {
        const response = await fetch(`${BASE_URL}/order/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: username,
            order: order,
            asset: symbol
        }),
        });
        if (!response.ok) {
            throw new Error('Error creating order');
        }
        const result = await response.json();
        return result["order_id"];
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Function to cancel an existing order by ID
export const cancelOrder = async (username, orderId) => {
    try {
        const response = await fetch(`${BASE_URL}/${username}/cancelOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),  // Wrap orderId in an object
        });
        if (!response.ok) {
        throw new Error('Error canceling order');
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Function to fetch current PnL for the user
export const getPnL = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/${username}/pnl`);
        if (!response.ok) {
            throw new Error('Error fetching PnL');
        }
        const data = await response.json();
        return data;  // Assuming the response is { pnl }
    } catch (error) {
        console.error(error);
        return 0;  // Return 0 if there's an error
    }
};

// Function to fetch the order book for a specific symbol
export const getOrderBook = async (symbol) => {
    try {
        const response = await fetch(`${BASE_URL}/smallview/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ asset: symbol }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching order book for ${symbol}`);
        }
        const result = await response.json();
        return result["data"];  // Assuming the response format is { bids: [...], asks: [...] }
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Function to fetch market news
export const fetchNews = async () => {
    try {
        const response = await fetch(`${BASE_URL}/news`);
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