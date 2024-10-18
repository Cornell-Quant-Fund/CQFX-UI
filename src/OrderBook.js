import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { IconArrowNarrowRight } from "@tabler/icons-react";

const OrderBook = ({ username, getOrderBook, getPosition, getTrades, getPnL, assets }) => {
	const [activeAsset, setActiveAsset] = useState(assets[0]);
	const [positions, setPositions] = useState({});
	const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
	const [tradeHistory, setTradeHistory] = useState([]);
	const [pnl, setPnl] = useState(0);
	const chartRef = useRef(null);

	useEffect(() => {
		const fetchPnLPos = async () => {
			const pnl = await getPnL(username);
			setPnl(pnl); // Assuming response is { pnl }
			const userPositions = await getPosition(username);
        	setPositions(userPositions);
		};

		fetchPnLPos();

		// Set up periodic fetching of orders and PnL every 10 seconds
		const intervalId = setInterval(() => {
			fetchPnLPos();
		}, 1000); // 1 seconds interval

		return () => clearInterval(intervalId);
	}, [getPnL, getPosition, username]);

	useEffect(() => {
		const fetchOrderBook = async () => {
			const data = await getOrderBook(activeAsset);
			if (data) {
				setOrderBook({ bids: data["bids"], asks: data["asks"] });
			}
		};

		const fetchAndPlotTradeHistory = async () => {
			const trades = await getTrades(activeAsset);
			if (trades) {
				const lastTrades = trades.slice(-1000);
				setTradeHistory(lastTrades);
				plotTrades(lastTrades);
			}
		};

		fetchOrderBook();
		fetchAndPlotTradeHistory();

		const interval = setInterval(() => {
			fetchOrderBook();
			fetchAndPlotTradeHistory();
		}, 1000); // refresh every second

		return () => clearInterval(interval);
	}, [activeAsset, getOrderBook, getTrades]);

	const plotTrades = (trades) => {
		const svg = d3.select(chartRef.current);
		svg.selectAll("*").remove();

		if (!trades || trades.length === 0) {
			console.warn("no trades");
			return;
		}

		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		const width = 400 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		// x is just index, y is trade price
		const x = d3
			.scaleLinear()
			.domain([0, trades.length - 1])
			.range([0, width]);
		const y = d3
			.scaleLinear()
			.domain([d3.min(trades), d3.max(trades)])
			.nice()
			.range([height, 0]);

		const line = d3
			.line()
			.x((d, i) => x(i))
			.y((d) => y(d))
			.curve(d3.curveBasis);

		const svgContainer = svg
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		svgContainer
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x));

		svgContainer.append("g").call(d3.axisLeft(y));

		svgContainer
			.append("path")
			.datum(trades)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 2)
			.attr("d", line);
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
										.sort(
											([priceA], [priceB]) =>
												priceA - priceB
										)
										.slice(0, 5)
										.reverse()
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
											([priceA], [priceB]) =>
												priceB - priceA
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
					</div>
					<div className="chart-container">
						<svg ref={chartRef}></svg>
					</div>
					<div className="border-2 p-2 rounded-md">
						{assets.map(asset => (
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
