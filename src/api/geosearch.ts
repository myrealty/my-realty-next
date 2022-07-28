import { AxiosResponse } from 'axios';
import API from 'api/index';

export const search = ({
  q,
}: {
  q: string;
}): Promise<AxiosResponse<{ label: string; value: string }[]>> =>
  API.get(`/geocode/search?q=${q}`);

export const reverse = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<
  AxiosResponse<{
    displayName: string;
    lat: number;
    lng: number;
    city: string | null;
    state: string | null;
    country: string;
  }>
> => API.get(`/geocode/reverse?lat=${lat}&lng=${lng}`);
