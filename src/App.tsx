import { useCallback, useEffect, useState } from "react";
import { LeafletMouseEvent } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import fetch from "cross-fetch";
import { NasaApiResponseData, TransactionData } from "./interfaces";
import { SourceWallets } from "./types";
import WalletModal from "./WalletModal";
import WildfireMarker from "./WildfireMarker";
import WildfireModal from "./WildfireModal";
import Navbar from "./Navbar";
import "./App.css";

interface MarkerClickHandlerEvent extends LeafletMouseEvent {
	sourceTarget: {
		options: {
			data: NasaApiResponseData["events"][0];
		};
	};
}

const server = new window.StellarSdk.Server(
	"https://horizon-testnet.stellar.org",
);

function App() {
	const [publicKey, setPublicKey] = useState("");
	const [balance, setBalance] = useState("0");
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const [wildfires, setWildfires] = useState<NasaApiResponseData["events"]>([]);
	const [isOpenWildfireModal, setIsOpenWildfireModal] = useState(false);
	const [isOpenWalletModal, setIsOpenWalletModal] = useState(false);
	const [selectedWildfire, setSelectedWildfire] = useState<
		NasaApiResponseData["events"][0] | null
	>(null);
	const [sourceWallets, setSourceWallets] = useState<SourceWallets>([]);
	const [destinationPreferredAsset, setDestinationPreferredAsset] = useState<
		SourceWallets[0]["preferred_asset"] | null
	>(null);

	function closeWildfireModal() {
		setIsOpenWildfireModal(false);
	}

	function openWildfireModal(event: MarkerClickHandlerEvent) {
		const { data: wildfireData } = event.sourceTarget.options;
		setIsOpenWildfireModal(true);
		setSelectedWildfire(wildfireData);
		setDestinationPreferredAsset(
			sourceWallets.find(
				(sourceWallet) => sourceWallet.source === wildfireData.sources[0].id,
			)?.preferred_asset ?? null,
		);
	}

	function closeWalletModal() {
		setIsOpenWalletModal(false);
	}

	function openWalletModal() {
		setIsOpenWalletModal(true);
	}

	const handleConnectionAccepted = useCallback(async () => {
		try {
			const key = await window.xBullSDK.getPublicKey();
			const balances = await getAccountBalances(key);
			setPublicKey(key);
			setBalance(balances[0].balance);
			setIsWalletConnected(true);
		} catch (error) {
			console.error(error);
		}
	}, []);

	async function getAccountBalances(publicKey: string): Promise<unknown[]> {
		const account = await server.loadAccount(publicKey);
		return account.balances;
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
			<Navbar
				isWalletConnected={isWalletConnected}
				publicKey={publicKey}
				balance={balance}
				handleOpenWalletModal={openWalletModal}
			/>
			<MapContainer
				center={[31.608, -109.001]}
				zoom={5}
				minZoom={3}
				className="h-[calc(100vh-60px)]" // total viewport height minus navbar height
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{wildfires.map((wildfire) => (
					<WildfireMarker
						onClick={openWildfireModal}
						key={wildfire.id}
						position={{
							lat: wildfire.geometry[0].coordinates[1],
							lng: wildfire.geometry[0].coordinates[0],
						}}
						data={wildfire}
					/>
				))}
			</MapContainer>
			<WildfireModal
				isOpen={isOpenWildfireModal}
				closeModal={closeWildfireModal}
				handleDonate={handleDonate}
				title={selectedWildfire?.title}
				subtitle={`${selectedWildfire?.sources[0]?.id ?? "Unknown source"} ${
					selectedWildfire?.sources[0]?.url ?? "URL not found"
				}`}
				destinationPreferredAsset={destinationPreferredAsset}
			/>
			<WalletModal
				isOpen={isOpenWalletModal}
				closeModal={closeWalletModal}
				onSuccess={handleConnectionAccepted}
			/>
		</main>
	);
}

export default App;
