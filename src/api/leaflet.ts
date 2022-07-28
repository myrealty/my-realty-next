import axios, { AxiosResponse } from 'axios';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

export const search = async (value: string) =>
  provider.search({ query: value });

export const getReverseGeocode = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<AxiosResponse> =>
  axios.get(`${provider.reverseUrl}?lat=${lat}&lon=${lon}&format=json`, {
    responseType: 'text',
  });
