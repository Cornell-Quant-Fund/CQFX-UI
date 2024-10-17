const BASE_URL = 'https://7wpwid5j49.execute-api.us-east-2.amazonaws.com/default';  // Replace with API URL

// assets array
const assets = ['AUTO', 'SEMI', 'OIL', 'RENEW', 'TECH', 'FIN'];

// Function to fetch available assets (in case it's dynamic later)
export const getAssets = async () => {
  return assets;
};

// Function to fetch user's outgoing orders
export const getOrders = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/order/outgoing/`, {
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
        return result["orders"];  // Assuming the response format is [{ id, asset, qty, price, side }]
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getPosition = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/position/`, {
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
        return result["position"];  // Assuming the response format is [{ id, asset, qty, price, side }]
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getTrades = async (asset) => {
    try {
        const response = await fetch(`${BASE_URL}/trades/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                asset: asset
            }),
        });
        if (!response.ok) {
            throw new Error('Error fetching orders');
        }
        const result = await response.json();
        return result["trades"];
    } catch (error) {
        console.error(error);
        return [];
    }
};
  
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
        return result["order_id"];
    } catch (error) {
        console.error(error);
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
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Function to fetch current PnL for the user
export const getPnL = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/pnl/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: username
            }),
        });
        if (!response.ok) {
            throw new Error('Error fetching PnL');
        }
        const result = await response.json();
        return result["pnl"];  // Assuming the response is { pnl }
    } catch (error) {
        console.error(error);
        return 0;  // Return 0 if there's an error
    }
};

// Function to fetch the order book for a specific asset
export const getOrderBook = async (asset) => {
    try {
        const response = await fetch(`${BASE_URL}/smallview/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ asset: asset }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching order book for ${asset}`);
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