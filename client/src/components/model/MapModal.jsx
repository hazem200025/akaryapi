import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapModal.scss";

function LocationMarker({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function MapModal({ onSelectLocation, onClose }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectLocation = (lat, lng) => {
    setSelectedLocation([lat, lng]);
    onSelectLocation(lat, lng);
  };

  return (
    <div className="mapModal">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>X</button>
        <MapContainer center={[31.0499998, 31.3833318]} zoom={15} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onSelectLocation={handleSelectLocation} />
        </MapContainer>
        {selectedLocation && (
          <div className="locationInfo">
            <p>Selected Latitude: {selectedLocation[0]}</p>
            <p>Selected Longitude: {selectedLocation[1]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapModal;
