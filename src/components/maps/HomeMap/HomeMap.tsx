// react
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
// axios
import { CoordinatesType, GetAllPublicListingInfo } from 'api/listing';
// components
import MapEvents from './MapEvents';
import { LocationMarker } from 'components/Icons';
// data
import { timeZoneCityToCountry } from 'data/tz-cities-to-countries';
// helpers
import { currencyFormat } from 'helpers/currencyFormat';
import { geolocation } from 'helpers/geolocation';
import { calcDuration } from 'helpers/handlers';
// styles
import { message } from 'antd';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { search } from 'api/geosearch';

const HomeMap = ({
  locations,
  handleSelectedLocation,
  updateCoordinates,
}: {
  locations: GetAllPublicListingInfo[];
  handleSelectedLocation: (data: GetAllPublicListingInfo) => void;
  updateCoordinates: (cords: CoordinatesType) => void;
}) => {
  const [location, setLocation] = useState<number[] | null>(null);

  useEffect(() => {
    if (Intl) {
      (async () => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzArr = userTimeZone.split('/');
        const userCity = tzArr.at(-1);
        // @ts-ignore
        const userCountry = timeZoneCityToCountry[userCity];
        try {
          const { data } = await search({ q: `${userCity}, ${userCountry}` });
          const coords: { position: any; label: string } = JSON.parse(
            data[0].value
          );
          setLocation([+coords.position[0], +coords.position[1]]);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setLocation([19.42847, -99.12766]);
        }
      })();
      return;
    }

    setLocation([19.42847, -99.12766]);
  }, []);

  if (location === null) return null;

  const handleCurrentLocation = async () => {
    try {
      const { lat, lng } = await geolocation();
      setLocation([lat, lng]);
    } catch (error: any) {
      const content = error.message;
      message.error({
        content,
        duration: Math.max(...[3, calcDuration(content)]),
      });
    }
  };
  return (
    <section className="home-map-container">
      <MapContainer
        center={location as LatLngExpression}
        zoom={6}
        minZoom={4}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents location={location} updateCoordinates={updateCoordinates} />
        {locations.map((data) => (
          <Marker
            key={data.id}
            position={[+data.latitude, +data.longitude]}
            eventHandlers={{
              async click() {
                handleSelectedLocation(data);
              },
            }}
          >
            <Tooltip offset={[-15, -8]} direction="top" permanent>
              <span style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                {currencyFormat(data.price, 'USD')}
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
      <button className="map-current-location" onClick={handleCurrentLocation}>
        <LocationMarker height={30} />
      </button>
    </section>
  );
};

export default React.memo(HomeMap);
