import { useEffect, useState } from "react";
import fetch from "cross-fetch";
import logo from "./logo.svg";
import "./App.css";
import { NasaApiResponseData } from "./interfaces";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

function App() {
	const [count, setCount] = useState(0);
	const [wildfires, setWildfires] = useState<NasaApiResponseData["events"]>([]);

	useEffect(() => {
		fetch("https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires", {
			method: "GET",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json() as Promise<NasaApiResponseData>;
			})
			.then((data) => setWildfires(data.events))
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h1>Hello Vite + React!</h1>
				<p>
					<button type="button" onClick={() => setCount((count) => count + 1)}>
						count is: {count}
					</button>
				</p>
				<p>
					Edit <code>App.tsx</code> and save to test HMR updates.
				</p>
				<p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
					{" | "}
					<a
						className="App-link"
						href="https://vitejs.dev/guide/features.html"
						target="_blank"
						rel="noopener noreferrer"
					>
						Vite Docs
					</a>
				</p>
			</header>
			<main>
				<h2>All wildfires:</h2>
				<ul>
					{wildfires.map((wildfire) => (
						<li key={wildfire.id}>{wildfire.title}</li>
					))}
				</ul>
			</main>
			<MapContainer
				center={[0, 0]}
				zoom={2}
				scrollWheelZoom={false}
				className="h-screen"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{wildfires.map((wildfire) => (
					<Marker
						key={wildfire.id}
						position={
							wildfire?.geometry[0].coordinates
								? [
										wildfire.geometry[0].coordinates[1],
										wildfire.geometry[0].coordinates[0],
								  ]
								: [0, 0]
						}
					></Marker>
				))}
			</MapContainer>
		</div>
	);
}

export default App;
