// src/mocks/handlers.js
import { rest } from "msw";

// Mock Data
const nasaApiResponseData = {
	title: "EONET Events",
	description: "Natural events from EONET.",
	link: "https://eonet.gsfc.nasa.gov/api/v3/events",
	events: [
		{
			id: "EONET_6076",
			title: "Deer Creek Fire",
			description: null,
			link: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_6076",
			closed: null,
			categories: [
				{
					id: "wildfires",
					title: "Wildfires",
				},
			],
			sources: [
				{
					id: "InciWeb",
					url: "http://inciweb.nwcg.gov/incident/8145/",
				},
			],
			geometry: [
				{
					magnitudeValue: null,
					magnitudeUnit: null,
					date: "2022-06-08T19:15:00Z",
					type: "Point",
					coordinates: [-109.001, 31.608],
				},
			],
		},
	],
};

export const handlers = [
	rest.get("https://eonet.gsfc.nasa.gov/api/v3/events", (req, res, ctx) => {
		const category = req.url.searchParams.get("category");
		if (category === "wildfires") {
			return res(ctx.status(200), ctx.json(nasaApiResponseData));
		}
	}),
];
