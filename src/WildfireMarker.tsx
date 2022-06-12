import { LatLngLiteral, LeafletMouseEventHandlerFn, icon } from "leaflet";
import { Marker } from "react-leaflet";
import { NasaApiResponseData } from "./interfaces";

interface WildfireMarkerProps {
	position: LatLngLiteral;
	data: NasaApiResponseData["events"][0];
	onClick: LeafletMouseEventHandlerFn;
}

const myIcon = icon({
	iconUrl: "/fire-marker.svg",
	iconSize: [64, 64],
	iconAnchor: [32, 64],
	popupAnchor: null,
	shadowUrl: null,
	shadowSize: null,
	shadowAnchor: null,
});

function WildfireMarker({ position, data, onClick }: WildfireMarkerProps) {
	return (
		<Marker
			position={position}
			eventHandlers={{
				click: onClick,
			}}
			alt="Marker indicating a wildfire in the area"
			title={data.title}
			data={data}
			icon={myIcon}
		/>
	);
}

export default WildfireMarker;
