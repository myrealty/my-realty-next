import API from 'api/index';
import { AxiosResponse } from 'axios';

export interface GetAllPublicListingInfo {
  id: number;
  title: string;
  price: number;
  city: string;
  country: string;
  photo: {
    url: string;
    name: string;
    number: number;
  }[];
}

export interface Location {
  id?: number;
  address: string;
  postcode: string;
  road: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface FloorPlan {
  id?: number;
  living_rooms: number;
  kitchens: number;
  dining_rooms: number;
  rooms: number;
  bathrooms: number;
}

export interface Listing {
  id?: number;
  property_type_group: string;
  property_type: string;
  privacy_type: string;
  title: string;
  description: string;
  price: number;
  is_available?: number;
}

export interface Extra {
  id?: number;
  security_cameras: number;
  weapons: number;
  dangerous_animals: number;
}

export interface Photo {
  id?: number;
  unique_photo_id: string;
  file?: File;
  name: string;
  url: string;
  number?: number;
}

export interface Amenity {
  id?: number;
  name: string;
}

export interface GetListingInfo {
  listing: Listing;
  location: Location;
  floor_plan: FloorPlan;
  extra: Extra;
  photo: Photo[];
  amenity: Amenity[];
}

export const getAllListing = ({
  perPage,
  currentPage,
  q,
  filters,
}: {
  perPage?: number;
  currentPage?: number;
  q?: string;
  filters?: string;
}): Promise<
  AxiosResponse<{
    listings: GetAllPublicListingInfo[];
    total: number;
  }>
> => {
  // let URI = `/listing?page=${currentPage}&per_page=${perPage}`;
  let URI = `/listing/public/all`;

  // if (q.length) URI += `&q=${q}`;

  if (filters?.length) {
    URI += `?${filters}`;
  }

  return API.get(URI);
};

export const getCountAllListing = ({
  query,
}: {
  query: string;
}): Promise<
  AxiosResponse<{
    total: number;
  }>
> => API.get(`/listing/public/all/count?${query}`);

export const getListing = (
  id: number | string
): Promise<AxiosResponse<GetListingInfo>> => API.get(`/listing/public/${id}`);
