import { useEffect, useState } from "react";
import { LeafletMouseEvent } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import fetch from "cross-fetch";
import { NasaApiResponseData, TransactionData } from "./interfaces";
import { SourceWallets } from "./types";
import WildfireMarker from "./WildfireMarker";
import Modal from "./Modal";
import Navbar from "./Navbar";
import "./App.css";

interface MarkerClickHandlerEvent extends LeafletMouseEvent {
	sourceTarget: {
		options: {
			data: NasaApiResponseData["events"][0];
		};
	};
}

function App() {
	const [wildfires, setWildfires] = useState<NasaApiResponseData["events"]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedWildfire, setSelectedWildfire] = useState<
		NasaApiResponseData["events"][0] | null
	>(null);
	const [sourceWallets, setSourceWallets] = useState<SourceWallets>([]);
	const [destinationPreferredAsset, setDestinationPreferredAsset] = useState<
		SourceWallets[0]["preferred_asset"] | null
	>(null);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal(event: MarkerClickHandlerEvent) {
		const { data: wildfireData } = event.sourceTarget.options;
		setIsOpen(true);
		setSelectedWildfire(wildfireData);
		setDestinationPreferredAsset(
			sourceWallets.find(
				(sourceWallet) => sourceWallet.source === wildfireData.sources[0].id,
			)?.preferred_asset ?? null,
		);
	}

	function handleDonate(transactionData: TransactionData) {
		console.log(transactionData);
	}

	useEffect(() => {
		const abortNasaApiController = new AbortController();
		const abortSourceWalletsController = new AbortController();
		fetch(
			"https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&source=InciWeb",
			{
				method: "GET",
				signal: abortNasaApiController.signal,
			},
		)
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

		fetch("source_wallets.json", {
			method: "GET",
			signal: abortSourceWalletsController.signal,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json() as Promise<SourceWallets>;
			})
			.then((data) => {
				setSourceWallets(data);
			})
			.catch((error) => {
				console.error(error);
			});

		return () => {
			abortNasaApiController.abort();
			abortSourceWalletsController.abort();
		};
	}, []);

	return (
		<main>
			<Navbar />
			<Modal
				isOpen={isOpen}
				closeModal={closeModal}
				handleDonate={handleDonate}
				title={selectedWildfire?.title}
				subtitle={`${selectedWildfire?.sources[0]?.id ?? "Unknown source"} ${
					selectedWildfire?.sources[0]?.url ?? "URL not found"
				}`}
				destinationPreferredAsset={destinationPreferredAsset}
			/>
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
					<WildfireMarker
						onClick={openModal}
						key={wildfire.id}
						position={{
							lat: wildfire.geometry[0].coordinates[1],
							lng: wildfire.geometry[0].coordinates[0],
						}}
						data={wildfire}
					/>
				))}
			</MapContainer>
		</main>
	);
}

export default App;
