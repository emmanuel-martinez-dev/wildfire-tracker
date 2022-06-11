import { LatLngLiteral, LeafletMouseEventHandlerFn } from "leaflet";
import { Marker } from "react-leaflet";
import { NasaApiResponseData } from "./interfaces";

interface MarkersProps {
	position: LatLngLiteral;
	data: NasaApiResponseData["events"][0];
	onClick: LeafletMouseEventHandlerFn;
}

function Markers({ position, data, onClick }: MarkersProps) {
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

export default Markers;
