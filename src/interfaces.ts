export interface NasaApiResponseData {
	title: string;
	description: string;
	link: string;
	events: {
		id: string;
		title: string;
		description: null;
		link: string;
		closed: null;
		categories: {
			id: string;
			title: string;
		}[];
		sources: {
			id: string;
			url: string;
		}[];
		geometry: {
			magnitudeValue: null;
			magnitudeUnit: null;
			date: string;
			type: string;
			coordinates: number[];
		}[];
	}[];
}

export interface TransactionData {
	sourceAssetCode: string;
	/**
	 * If native, it's not necessary
	 */
	sourceAssetIssuer?: string;
	sendMaxAmount: string;
	destinationPublicKey: string;
	destinationAssetCode: string;
	/**
	 * If native, it's not necessary
	 */
	destinationAssetIssuer?: string;
	destinationAmount: string;
}
