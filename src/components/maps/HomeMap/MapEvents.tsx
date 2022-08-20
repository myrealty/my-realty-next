import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { CoordinatesType } from 'api/listing';

export default React.memo(function MapEvents({
  location,
  updateCoordinates,
}: {
  location: number[];
  updateCoordinates: (cords: CoordinatesType) => void;
}) {
  const map = useMap();
  const sw = map.getBounds().getSouthWest();
  const ne = map.getBounds().getNorthEast();

  const [bounds, setBounds] = useState({
    swLat: sw.lat,
    swLng: sw.lng,
    neLat: ne.lat,
    neLng: ne.lng,
  });
  const [runLocationEffect, setRunLocationEffect] = useState(false);

  useEffect(() => {
    updateCoordinates(bounds);
    setRunLocationEffect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  useEffect(() => {
    if (!runLocationEffect) return;
    const Map = map.setView(location as LatLngExpression, map.getZoom());
    const sw = Map.getBounds().getSouthWest();
    const ne = Map.getBounds().getNorthEast();
    setBounds({
      swLat: sw.lat,
      swLng: sw.lng,
      neLat: ne.lat,
      neLng: ne.lng,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Events
  useMapEvents({
    dragend() {
      const sw = map.getBounds().getSouthWest();
      const ne = map.getBounds().getNorthEast();
      setBounds({
        swLat: sw.lat,
        swLng: sw.lng,
        neLat: ne.lat,
        neLng: ne.lng,
      });
    },
    zoom() {
      const sw = map.getBounds().getSouthWest();
      const ne = map.getBounds().getNorthEast();
      setBounds({
        swLat: sw.lat,
        swLng: sw.lng,
        neLat: ne.lat,
        neLng: ne.lng,
      });
    },
  });
  return null;
});
