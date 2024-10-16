import React, { useState } from "react";

const SendOrder = ({
	createOrder,
	username,
	assets,
	orderSide,
	handleSetOrderSide,
}) => {
	const [asset, setAsset] = useState(assets[0]);
	const [price, setPrice] = useState("");
	const [qty, setQty] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const orderData = {
			order_type: "limit",
			side: orderSide,
			qty: parseFloat(qty),
			price: parseFloat(price),
			lifespan: 30000,
		};
		await createOrder(username, orderData, asset);
		setPrice("");
		setQty("");
	};

	return (
		<div className="send-order">
			<h3>Send Order</h3>
			<div className="tabs">
				<button
					className={orderSide === "bid" ? "active" : ""}
					onClick={() => handleSetOrderSide("bid")}
				>
					Bid
				</button>
				<button
					className={orderSide === "ask" ? "active" : ""}
					onClick={() => handleSetOrderSide("ask")}
				>
					Ask
				</button>
			</div>
			<form onSubmit={handleSubmit}>
				<label>Asset</label>
				<select
					value={asset}
					onChange={(e) => setAsset(e.target.value)}
				>
					{assets.map((asset) => (
						<option key={asset} value={asset}>
							{asset}
						</option>
					))}
				</select>

				<label>Price</label>
				<input
					type="number"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
				/>
				<label>Qty</label>
				<input
					type="number"
					value={qty}
					onChange={(e) => setQty(e.target.value)}
				/>
				<button type="submit" className="send-button">
					Send
				</button>
			</form>
		</div>
	);
};

export default SendOrder;
