import API from 'api/index';
import { AxiosResponse } from 'axios';

export interface GetAllPublicListingInfo {
  id: number;
  title: string;
  price: number;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  photo: {
    url: string;
    name: string;
    number: number;
  }[];
}

export interface Location {
  id: number;
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
  id: number;
  living_rooms: number;
  kitchens: number;
  dining_rooms: number;
  rooms: number;
  bathrooms: number;
}

export interface Listing {
  id: number;
  property_type_group: string;
  property_type: string;
  privacy_type: string;
  title: string;
  description: string;
  price: number;
  is_available?: number;
}

export interface Extra {
  id: number;
  security_cameras: number;
  weapons: number;
  dangerous_animals: number;
}

export interface Photo {
  id: number;
  unique_photo_id: string;
  file?: File;
  name: string;
  url: string;
  number?: number;
}

export interface Amenity {
  id: number;
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

export interface CoordinatesType {
  swLat: number | null;
  swLng: number | null;
  neLat: number | null;
  neLng: number | null;
}

export const getAllListing = ({
  perPage,
  page,
  filters,
  coordinates,
}: {
  perPage?: number;
  page?: number;
  filters?: string;
  coordinates?: CoordinatesType;
}): Promise<
  AxiosResponse<{
    listings: GetAllPublicListingInfo[];
    total: number;
    totalPages: number;
  }>
> => {
  let URI = `/listing/public/all`;

  if (page && perPage) {
    URI += `?per_page=${perPage}&page=${page}`;
  }

  if (coordinates) {
    const { swLat, neLat, swLng, neLng } = coordinates;
    if (swLat !== null && swLng !== null && neLat !== null && neLng !== null) {
      URI += `?swLat=${swLat}&swLng=${swLng}&neLat=${neLat}&neLng=${neLng}`;
    }
  }

  if (filters?.length) {
    URI += `&${filters}`;
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
> => API.get(`/listing/public/all/count${query.length ? `?${query}` : ''}`);

export const getListing = (
  id: number | string
): Promise<AxiosResponse<GetListingInfo>> => API.get(`/listing/public/${id}`);

export const postContactAgent = ({
  id,
  data,
}: {
  id: number;
  data: { name: string; phone: string; email: string; message: string };
}) => API.post(`/listing/public/contact-agent/${id}`, data);
