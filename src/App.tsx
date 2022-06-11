import { useEffect, useState } from "react";
import { LeafletMouseEventHandlerFn } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import fetch from "cross-fetch";
import { NasaApiResponseData } from "./interfaces";
import Markers from "./Markers";
import Modal from "./Modal";
import "./App.css";

function App() {
	const [wildfires, setWildfires] = useState<NasaApiResponseData["events"]>([]);
	const [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	const openModal: LeafletMouseEventHandlerFn = () => {
		setIsOpen(true);
	};

	useEffect(() => {
		const abortController = new AbortController();
		fetch("https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires", {
			method: "GET",
			signal: abortController.signal,
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

		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<div className="App">
			<Modal isOpen={isOpen} closeModal={closeModal} />
			<MapContainer
				center={[31.608, -109.001]}
				zoom={5}
				className="h-screen"
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{wildfires.map((wildfire) => (
					<Markers
						onClick={openModal}
						key={wildfire.id}
						position={wildfire?.geometry[0].coordinates || [0, 0]}
					></Markers>
				))}
			</MapContainer>
		</div>
	);
}

export default App;
