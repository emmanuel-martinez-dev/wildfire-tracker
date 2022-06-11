import { useEffect, useState } from "react";
import fetch from "cross-fetch";
import "./App.css";
import { NasaApiResponseData } from "./interfaces";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import Markers from "./Markers";

function App() {
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
			<MapContainer
				center={[0, 0]}
				zoom={2}
				scrollWheelZoom={false}
				className="h-screen"
			>
			<MapContainer center={[0, 0]} zoom={2} className="h-screen">
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{wildfires.map((wildfire) => (
					<Marker
					<Markers
						onClick={openModal}
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
						position={wildfire?.geometry[0].coordinates || [0, 0]}
					></Markers>
				))}
			</MapContainer>
		</div>
	);
}

export default App;
