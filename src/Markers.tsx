import { Marker, useMapEvent } from "react-leaflet";

function Markers({ position, onClick }) {
	const [long, lat] = position;
	const map = useMapEvent({
		click(e) {
			onClick();
			console.log(e);
			console.log(map);
		},
	});

	return <Marker position={[lat, long]} interactive={false} />;
}

export default Markers;
