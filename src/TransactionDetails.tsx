import { ChangeEvent, FormEvent, useState } from "react";
import { TransactionData } from "./interfaces";
import { SourceWallets } from "./types";

interface TransactionDetailsProps {
	handleDonate: (transactionData: TransactionData) => void;
	destinationPreferredAsset: SourceWallets[0]["preferred_asset"] | null;
	availableSourceAssets: string[];
}

function TransactionDetails({
	handleDonate,
	destinationPreferredAsset,
	availableSourceAssets,
}: TransactionDetailsProps) {
	const [selectedSourceAsset, setSelectedSourceAsset] = useState("XLM");

	function handleSelectSourceAsset(event: ChangeEvent<HTMLSelectElement>) {
		setSelectedSourceAsset(event.target.value);
	}

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		// TODO: test if input with name "source-asset" exists
		const sourceAsset = formData.get("source-asset") as string;
		const destinationAmount = formData.get(
			"destination-asset-amount",
		) as string;

		const [sourceAssetCode, sourceAssetIssuer] = sourceAsset.split("-");

		handleDonate({
			sourceAssetCode,
			sourceAssetIssuer,
			sendMaxAmount: "1000", // hardcoded: implement slippage?
			destinationPublicKey:
				"GDJQYKVNJS5X5SYKWCW2Z3JIO3QVHZRAYFNYC76WWM2SPITQEKVCYMCC",
			destinationAssetCode: "USDC",
			destinationAssetIssuer:
				"GAEB3HSAWRVILER6T5NMX5VAPTK4PPO2BAL37HR2EOUIK567GJFEO437",
			destinationAmount,
		});
	}

	return (
		<form className="mt-4" onSubmit={onSubmit}>
			<div>
				<label
					htmlFor="source-asset"
					className="block text-sm font-medium text-gray-700"
				>
					Choose Source Asset:
				</label>
				<select
					id="source-asset"
					name="source-asset"
					className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
					onChange={handleSelectSourceAsset}
				>
					{availableSourceAssets.length > 0 ? (
						availableSourceAssets.map((asset) => (
							<option key={asset}>{asset}</option>
						))
					) : (
						<option>No available source assets</option>
					)}
				</select>
			</div>
			<p className="mt-3 text-sm font-medium text-gray-900">
				Destination Preferred Asset:
			</p>
			<p className="mt-1 ml-3 text-sm text-gray-500">
				{`${
					destinationPreferredAsset?.code ||
					"Destination Asset Code not provided"
				}${
					destinationPreferredAsset?.issuer
						? `-${destinationPreferredAsset?.issuer}`
						: ""
				}`}
			</p>
			<div className="mt-3">
				<label
					htmlFor="destination-asset-amount"
					className="block text-sm font-medium text-gray-700"
				>
					Destination Asset Amount:
				</label>
				<div className="mt-1 relative rounded-md shadow-sm">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<span className="text-gray-500 sm:text-sm">$</span>
					</div>
					<input
						type="number"
						name="destination-asset-amount"
						id="destination-asset-amount"
						className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
						step="0.01"
						min="1"
						placeholder="0.00"
						aria-describedby="amount-asset"
						required
					/>
					<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<span className="text-gray-500 sm:text-sm" id="amount-asset">
							{/* we only need Asset code here */}
							{selectedSourceAsset.split("-")[0]}
						</span>
					</div>
				</div>
			</div>
			{/* 
        to check if it's indeed the same asset, use StellarSDK.Asset.compare function instead of strict equality
        https://stellar.github.io/js-stellar-sdk/Asset.html#.compare
       */}
			{selectedSourceAsset !==
			"USDC-GAEB3HSAWRVILER6T5NMX5VAPTK4PPO2BAL37HR2EOUIK567GJFEO437" ? (
				<>
					<p className="mt-3 text-sm font-medium text-gray-900">
						Conversion Rate:
					</p>
					<p className="mt-1 ml-3 text-sm text-gray-500">
						{/* hardcoded: should fetch available path payments once user fills Destination Asset Amount */}
						1 XML = 0.10 USDC
					</p>
					<p className="mt-3 text-sm font-medium text-gray-900">
						You will be approximately deducted:
					</p>
					<p className="mt-1 ml-3 text-sm text-gray-500">
						{/* hardcoded: should fetch available path payments once user fills Destination Asset Amount */}
						100 XLM
					</p>
				</>
			) : null}
			<div className="flex">
				<button
					type="submit"
					className="inline-flex items-center mt-5 ml-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Donate
				</button>
			</div>
		</form>
	);
}

export default TransactionDetails;
