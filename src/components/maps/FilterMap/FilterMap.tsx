import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
// styles
import { message } from 'antd';
// leaflet
import { DragEndEvent, LatLngExpression } from 'leaflet';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvent,
} from 'react-leaflet';
// http request
import { search, reverse } from 'api/geosearch';
// helpers
import { debounce } from 'helpers/debounce';
import { calcDuration } from 'helpers/handlers';
import { geolocation } from 'helpers/geolocation';
import { toBase64 } from 'helpers/toBase64';
import { shimmer } from 'helpers/shimmerEffect';
// components
import InputSearchSelect from 'components/InputSearchSelect';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const FilterMap = ({
  setLocationState,
  locationState,
}: {
  setLocationState: React.Dispatch<
    React.SetStateAction<{
      city?: string;
      state?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    } | null>
  >;
  locationState: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  } | null;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [effectOneTime, setEffectOneTime] = useState<boolean>(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [location, setLocation] = useState<number[] | null>(null);
  const [selectValue, setSelectValue] = useState<string>('');

  useEffect(() => {
    if (locationState === null) {
      setSelectValue('');
      setLocation(null);
    }
  }, [locationState]);

  useEffect(() => {
    if (effectOneTime) return;
    (async () => {
      if (
        locationState &&
        locationState.latitude &&
        locationState.longitude &&
        locationState.country
      ) {
        await handleLocationByCoordinates({
          lat: locationState.latitude,
          lng: locationState.longitude,
        });
        return;
      }

      if (locationState && locationState.country) {
        const { city, state, country } = locationState;
        await handleLocationByCountry({ city, state, country });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState]);

  const handleLocationByCoordinates = useMemo(
    () =>
      async ({ lat, lng }: { lat: number; lng: number }) => {
        setEffectOneTime(false);
        setLoading(false);
        setLocation([lat, lng]);
        try {
          const { data } = await reverse({
            lat,
            lng,
          });
          setSelectValue(data.displayName);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          const content = 'Error: no se puede obtener tu ubicación.';
          message.error({
            content,
            duration: Math.max(...[3, calcDuration(content)]),
          });
        }
      },
    []
  );

  const handleLocationByCountry = useMemo(
    () =>
      async ({
        city,
        state,
        country,
      }: {
        city?: string;
        state?: string;
        country?: string;
      }) => {
        try {
          let q = '';
          if (city) q += `${city},`;
          if (state) q += ` ${state},`;
          if (country) q += ` ${country}`;
          const { data: dataSearch } = await search({ q });
          const { position }: { position: number[]; label: string } =
            JSON.parse(dataSearch[0].value);

          const { data } = await reverse({
            lat: position[0],
            lng: position[1],
          });
          setEffectOneTime(false);
          setLoading(false);
          setLocation([data.lat, data.lng]);
          setSelectValue(data.displayName);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          const content = 'Error: no se puede obtener tu ubicación.';
          message.error({
            content,
            duration: Math.max(...[3, calcDuration(content)]),
          });
        }
      },
    []
  );

  const handleDebounceSearch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q.length) {
          setSelectValue('');
          return;
        }

        setSelectValue(q);

        if (!navigator.onLine) {
          const content = 'Error: debes tener acceso a internet.';
          message.error({
            content,
            duration: Math.max(...[3, calcDuration(content)]),
          });
          return;
        }

        try {
          const { data } = await search({ q });
          setOptions(data);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          const content = 'Error: no se puede obtener tu ubicación.';
          message.error({
            content,
            duration: Math.max(...[3, calcDuration(content)]),
          });
        }
      }, 1500),
    []
  );

  const handleChange = useMemo(
    () => async (data: string) => {
      if (!data) {
        setSelectValue('');
        setOptions([]);
        return;
      }

      if (!navigator.onLine) {
        const content = 'Error: debes tener acceso a internet.';
        message.error({
          content,
          duration: Math.max(...[3, calcDuration(content)]),
        });
        return;
      }

      const latLng: { lat: number; lng: number } = {
        lat: 0,
        lng: 0,
      };

      if (data === 'Usar mi ubicación') {
        try {
          const { lat, lng } = await geolocation();

          latLng.lat = lat;
          latLng.lng = lng;
          setLocation([lat, lng]);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const content = error.message;
          message.error({
            content,
            duration: Math.max(...[3, calcDuration(content)]),
          });
          return;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const coords: { position: any; label: string } = JSON.parse(data);

        latLng.lat = coords.position[0];
        latLng.lng = coords.position[1];
        setLocation([latLng.lat, latLng.lng]);
      }

      try {
        const { data } = await reverse({
          lat: latLng.lat,
          lng: latLng.lng,
        });
        setEffectOneTime(true);
        setSelectValue(data.displayName);
        setLocationState({
          city: data.city || undefined,
          state: data.state || undefined,
          country: data.country,
          latitude: latLng.lat,
          longitude: latLng.lng,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const content = 'Error: no se puede obtener tu ubicación.';
        message.error({
          content,
          duration: Math.max(...[3, calcDuration(content)]),
        });
      }
    },
    [setLocationState]
  );

  const MapEvents = () => {
    const map = useMap();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map.setView(location! as LatLngExpression, map.getZoom());

    // Events
    useMapEvent('click', (e) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
      });
    });
    return null;
  };

  const eventHandlers = useMemo(
    () => ({
      async dragend(e: DragEndEvent) {
        const latLng = e.target.getLatLng();
        try {
          const { data } = await reverse({
            lat: latLng.lat,
            lng: latLng.lng,
          });
          setEffectOneTime(true);
          setLocation([latLng.lat, latLng.lng]);
          setSelectValue(data.displayName);
          setLocationState({
            city: data.city || undefined,
            state: data.state || undefined,
            country: data.country,
            latitude: latLng.lat,
            longitude: latLng.lng,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          const content = 'Error: no se puede obtener tu ubicación.';
          message.error({
            content,
            duration: Math.max(...[3, calcDuration(content)]),
          });
        }
      },
    }),
    [setLocationState]
  );

  return (
    <div style={{ height: '400px', position: 'relative', width: '100%' }}>
      {!loading && (
        <InputSearchSelect
          value={selectValue}
          placeholder="Ingresa una direccción"
          onSearch={handleDebounceSearch}
          onChange={handleChange}
          options={[
            {
              label: 'Usar mi ubicación',
              value: 'Usar mi ubicación',
            },
            ...options,
          ]}
          style={{
            position: 'absolute',
            top: '20%',
            left: '5%',
            width: '90%',
            zIndex: 3000,
          }}
        />
      )}
      {!location ? (
        <Image
          src="/assets/img/staticmap.png"
          alt="staticmap"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer('100%', '100%')
          )}`}
          onLoadingComplete={() => {
            setLoading(false);
          }}
        />
      ) : (
        <MapContainer
          center={location as LatLngExpression}
          zoom={8}
          minZoom={4}
          scrollWheelZoom={false}
          style={{
            height: '100%',
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          <Marker
            position={location as LatLngExpression}
            draggable
            eventHandlers={eventHandlers}
          >
            <Tooltip offset={[-15, -8]} direction="top" permanent>
              Mueveme para mayor precisión
            </Tooltip>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default FilterMap;
