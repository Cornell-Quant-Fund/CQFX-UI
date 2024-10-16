import React, { useState, useEffect } from "react";
import { IconArrowNarrowRight } from "@tabler/icons-react";

const OrderBook = ({ getOrderBook, assets }) => {
	const [activeAsset, setActiveAsset] = useState(assets[0]);
	const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

	useEffect(() => {
		const fetchOrderBook = async () => {
			const data = await getOrderBook(activeAsset);
			if (data) {
				setOrderBook({ bids: data["bids"], asks: data["asks"] });
			}
		};

		fetchOrderBook();
	}, [activeAsset, getOrderBook]);

	return (
		<div className="order-book">
			<div className="tabs">
				{assets.map((asset) => (
					<button
						key={asset}
						onClick={() => setActiveAsset(asset)}
						className={activeAsset === asset ? "active" : ""}
					>
						{asset}
					</button>
				))}
			</div>
			<div className="orders">
				<h3 className="font-bold pt-2 pb-2">
					{activeAsset} Order Book
				</h3>
				<div className="bids-asks">
					<div>
						<div className="flex flex-row gap-4">
							<div className="flex flex-row justify-start items-center w-16">
								<h4 className="font-medium">Bids</h4>
								<IconArrowNarrowRight
									size={20}
									stroke={1.5}
									className="mb-2 ml-2"
								/>
							</div>

							<ul>
								{Object.entries(orderBook.bids)
									.sort(
										([priceA], [priceB]) => priceB - priceA
									)
									.slice(0, 5)
									.map(([price, quantity]) => (
										<li key={price}>
											<div className="flex flex-row justify-start items-center">
												<div className="text-red-600 font-semibold w-24">
													{price}
												</div>
												<div className="flex flex-row justify-start items-center gap-1">
													<div className="font-semibold">
														{quantity}
													</div>
												</div>
											</div>
										</li>
									))}
							</ul>
						</div>
					</div>
					<div>
						<div className="flex flex-row gap-4">
							<div className="flex flex-row justify-start items-center w-16">
								<h4 className="font-medium">Asks</h4>
								<IconArrowNarrowRight
									size={20}
									stroke={1.5}
									className="mb-2 ml-2"
								/>
							</div>
							<ul>
								{Object.entries(orderBook.asks)
									.sort(
										([priceA], [priceB]) => priceA - priceB
									)
									.slice(0, 5)
									.map(([price, quantity]) => (
										<li key={price}>
											<div className="flex flex-row justify-start items-center">
												<div className="text-green-600 font-semibold w-24">
													{price}
												</div>
												<div className="flex flex-row justify-start items-center gap-1">
													<div className="font-semibold">
														{quantity}
													</div>
												</div>
											</div>
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderBook;
