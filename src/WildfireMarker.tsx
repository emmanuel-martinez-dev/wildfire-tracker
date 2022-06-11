import { LatLngLiteral, LeafletMouseEventHandlerFn } from "leaflet";
import { Marker } from "react-leaflet";
import { NasaApiResponseData } from "./interfaces";

interface WildfireMarkerProps {
	position: LatLngLiteral;
	data: NasaApiResponseData["events"][0];
	onClick: LeafletMouseEventHandlerFn;
}

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
		/>
	);
}

export default WildfireMarker;
