import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Location } from 'api/listing';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const Map = ({ location }: { location: Location }) => {
  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{
        height: '400px',
        width: '100%',
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.latitude, location.longitude]} />
    </MapContainer>
  );
};

export default Map;
