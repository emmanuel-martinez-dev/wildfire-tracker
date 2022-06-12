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

const stellarSdk = window.StellarSdk as typeof import("stellar-sdk");
const server = new stellarSdk.Server("https://horizon-testnet.stellar.org");

function App() {
	const [publicKey, setPublicKey] = useState("");
	const [balance, setBalance] = useState("0");
	const [availableSourceAssets, setAvailableSourceAssets] = useState<string[]>(
		[],
	);
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
	const [approximateAmountDeducted, setApproximateAmountDeducted] = useState<
		string | null
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
			setBalance(
				balances.find((balance) => balance.asset_type === "native")?.balance ??
					"0",
			);
			setAvailableSourceAssets(
				balances
					.sort((a, b) => {
						return a.asset_type === "native" ? -1 : 0;
					})
					.map((balance) => {
						if (balance.asset_type === "native") {
							return "XLM";
						}
						return `${balance.asset_code}-${balance.asset_issuer}`;
					}),
			);
			setIsWalletConnected(true);
		} catch (error) {
			console.error(error);
		}
	}, []);

	async function getAccountBalances(publicKey: string) {
		const account = await server.loadAccount(publicKey);
		return account.balances;
	}

	async function getPaymentStrictReceivePaths({
		destinationAmount,
		destinationAssetCode,
		sourceAssetCode,
		destinationAssetIssuer,
		sourceAssetIssuer,
	}: TransactionData): Promise<InstanceType<typeof stellarSdk.Asset>[]> {
		const sourceAsset = new stellarSdk.Asset(
			sourceAssetCode,
			sourceAssetIssuer,
		);
		const destinationAsset = new stellarSdk.Asset(
			destinationAssetCode,
			destinationAssetIssuer,
		);
		const { records } = await server
			.strictReceivePaths([sourceAsset], destinationAsset, destinationAmount)
			.call();
		// TODO: DO THIS SIDE EFFECT ELSEWHERE
		setApproximateAmountDeducted(records[0].source_amount);
		return records[0]?.path.map((asset) => {
			if (asset.asset_type === "native") {
				return stellarSdk.Asset.native();
			}
			return new stellarSdk.Asset(asset.asset_code, asset.asset_issuer);
		});
	}

	async function handleDonate(transactionData: TransactionData) {
		const {
			destinationAmount,
			destinationAssetCode,
			destinationPublicKey,
			sendMaxAmount,
			sourceAssetCode,
			destinationAssetIssuer,
			sourceAssetIssuer,
		} = transactionData;
		const sourceAccount = await server.loadAccount(publicKey);
		const sourceAsset = new stellarSdk.Asset(
			sourceAssetCode,
			sourceAssetIssuer,
		);
		const destinationAsset = new stellarSdk.Asset(
			destinationAssetCode,
			destinationAssetIssuer,
		);
		const isSameAssetTx =
			stellarSdk.Asset.compare(sourceAsset, destinationAsset) === 0
				? true
				: false;
		if (!isSameAssetTx && approximateAmountDeducted === null) {
			// only for path payment operations, when we still don't have an approximate amount
			// to be deducted, we need to get this before submitting transaction
			await getPaymentStrictReceivePaths(transactionData);
			return;
		}

		const tx = new stellarSdk.TransactionBuilder(sourceAccount, {
			fee: (await server.fetchBaseFee()).toString(),
			networkPassphrase: stellarSdk.Networks.TESTNET,
		})
			.addOperation(
				isSameAssetTx
					? stellarSdk.Operation.payment({
							amount: destinationAmount,
							asset: destinationAsset,
							destination: destinationPublicKey,
					  })
					: stellarSdk.Operation.pathPaymentStrictReceive({
							sendAsset: sourceAsset,
							// TODO: non-null-assertion: test if sendMaxAmount is always defined for different asset operations
							sendMax: sendMaxAmount!,
							destination: destinationPublicKey,
							destAsset: destinationAsset,
							destAmount: destinationAmount,
							path: await getPaymentStrictReceivePaths(transactionData),
					  }),
			)
			.setTimeout(30)
			.build();

		try {
			const xdr = tx.toXDR();
			// check if extension still has permissions
			await window.xBullSDK.connect({
				canRequestPublicKey: true,
				canRequestSign: true,
			});
			const signedXDR = await window.xBullSDK.signXDR(xdr, {
				publicKey,
				network: stellarSdk.Networks.TESTNET,
			});
			const signedTx = new stellarSdk.Transaction(
				signedXDR,
				stellarSdk.Networks.TESTNET,
			);
			await server.submitTransaction(signedTx);
			console.log("Transaction submitted.");

			// transaction passed, update user balances
			const balances = await getAccountBalances(publicKey);
			setBalance(balances[0].balance);
		} catch (error) {
			console.error("Something went wrong:", error);
		}
	}

	const automaticallyConnectWallet = useCallback(
		async (event: MessageEvent<{ type?: "XBULL_INJECTED" }>) => {
			if (event.data.type === "XBULL_INJECTED" && Boolean(window.xBullSDK)) {
				// xBullSDK should be available in the window (global) object
				await handleConnectionAccepted();
			}
		},
		[handleConnectionAccepted],
	);

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

	useEffect(() => {
		window.addEventListener("message", automaticallyConnectWallet, false);
		return () => {
			window.removeEventListener("message", automaticallyConnectWallet, false);
		};
	}, [automaticallyConnectWallet]);

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
				availableSourceAssets={availableSourceAssets}
				approximateAmountDeducted={approximateAmountDeducted}
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
