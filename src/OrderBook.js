import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { IconArrowNarrowRight } from "@tabler/icons-react";

const OrderBook = ({ username, getOrderBookInfo, assets }) => {
	const [activeAsset, setActiveAsset] = useState(assets[0]);
	const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
	const [tradeHistory, setTradeHistory] = useState([]);
	const [pnl, setPnl] = useState(0);
	const [cash, setCash] = useState(0);
	const [positions, setPositions] = useState({});
	const chartRef = useRef(null);

	useEffect(() => {
		const fetchOrderBookData = async () => {
			const data = await getOrderBookInfo(activeAsset, username);
			if (data) {
				setOrderBook({ bids: data.bids, asks: data.asks });
				setTradeHistory(data.trades.slice(-1000));  // Keep only the last 1000 trades
				setPnl(data.pnl);  // Assuming the data contains pnl
				setCash(data.cash);  // Assuming the data contains pnl
				setPositions(data.position);  // Assuming the data contains user positions
				plotTrades(data.trades.slice(-1000));
			}
		};

		fetchOrderBookData();

		const intervalId = setInterval(fetchOrderBookData, 3000); // Refresh every 3 seconds

		return () => clearInterval(intervalId);
	}, [activeAsset, getOrderBookInfo, username]);

	const plotTrades = (trades) => {
		const svg = d3.select(chartRef.current);
		svg.selectAll("*").remove();

		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		const width = 400 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		const x = d3.scaleLinear().domain([0, trades.length - 1]).range([0, width]);
		const y = d3.scaleLinear().domain([d3.min(trades), d3.max(trades)]).nice().range([height, 0]);

		const line = d3.line()
			.x((d, i) => x(i))
			.y((d) => y(d))
			.curve(d3.curveBasis);

		const svgContainer = svg
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		svgContainer.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
		svgContainer.append("g").call(d3.axisLeft(y));
		svgContainer.append("path").datum(trades).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2).attr("d", line);
	};

	return (
		<div className="order-book">
			<div className="flex flex-row justify-between items-center">
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
				<div className="border-2 p-2 rounded-md">
					Current Cash: ${cash.toFixed(2)}
				</div>
				<div className="border-2 p-2 rounded-md">
					Current PnL: ${pnl.toFixed(2)}
				</div>
			</div>
			<div className="orders">
				<h3 className="font-bold pt-2 pb-2">
					{activeAsset} Order Book
				</h3>
				<div className="flex flex-row justify-start items-center gap-24">
					<div className="bids-asks">
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
										.sort(([priceA], [priceB]) => priceA - priceB)
										.slice(0, 5)
										.reverse()
										.map(([price, quantity]) => (
											<li key={price}>
												<div className="flex flex-row justify-start items-center">
													<div className="text-green-600 font-semibold w-24">
														{price}
													</div>
													<div className="font-semibold">
														{quantity}
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
									<h4 className="font-medium">Bids</h4>
									<IconArrowNarrowRight
										size={20}
										stroke={1.5}
										className="mb-2 ml-2"
									/>
								</div>
								<ul>
									{Object.entries(orderBook.bids)
										.sort(([priceA], [priceB]) => priceB - priceA)
										.slice(0, 5)
										.map(([price, quantity]) => (
											<li key={price}>
												<div className="flex flex-row justify-start items-center">
													<div className="text-red-600 font-semibold w-24">
														{price}
													</div>
													<div className="font-semibold">
														{quantity}
													</div>
												</div>
											</li>
										))}
								</ul>
							</div>
						</div>
					</div>
					<div className="chart-container">
						<svg ref={chartRef}></svg>
					</div>
					<div className="border-2 p-2 rounded-md">
						{assets.map((asset) => (
							<div key={asset}>
								{asset}: {positions[asset]}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderBook;
