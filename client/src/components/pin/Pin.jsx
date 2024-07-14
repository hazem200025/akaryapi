import { Marker, Popup } from "react-leaflet";
import L from 'leaflet'; // Import Leaflet library
import "./pin.scss";
import { Link } from "react-router-dom";

// Import the marker icon image
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define custom marker icon using the imported images
const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customMarkerIcon}>
      <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} غرف النوم</span>
            <b>EGB {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
