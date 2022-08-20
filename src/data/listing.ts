import {
  SwimmingPool,
  Jacuzzi,
  Balcony,
  Grill,
  CampFire,
  Billiards,
  Fireplace,
  Table,
  Dumbell,
  Wifi,
  TV,
  Stove,
  LaundryMachine,
  Car,
  ParkingMeter,
  AirConditioner,
  Workplace,
  Shower,
  SmokeDetector,
  FirstAidKit,
  GrapheneCarbon,
  FireExtinguisher,
  Apartment,
  AttachedHouse,
  Castle,
} from 'components/Icons';
import { House } from 'components/Icons/House';

export const propertyTypeGroup = [
  {
    name: 'Apartamentos',
    value: 'apartment',
    Icon: Apartment,
  },
  {
    name: 'Casas',
    value: 'house',
    Icon: House,
  },
  {
    name: 'Vivienda anexa',
    value: 'attached-house',
    Icon: AttachedHouse,
  },
  {
    name: 'Propiedades únicas',
    value: 'unique-property',
    Icon: Castle,
  },
];

export const accommodationType = [
  {
    name: 'Propiedad amoblada',
    value: 'entire-furnished-property',
    description: 'Propiedad entera amoblada.',
  },
  {
    name: 'Propiedad semi-amoblada',
    value: 'entire-semi-furnished-property',
    description: 'Propiedad entera semi-amoblada.',
  },
  {
    name: 'Propiedad sin amoblar',
    value: 'entire-property',
    description: 'Propiedad entera sin amoblar.',
  },
  {
    name: 'Propiedad privada amoblada',
    value: 'private-furnished-property',
    description:
      'Propiedad privada amoblada más otros espacios comunes compartidos.',
  },
  {
    name: 'Propiedad privada semi-amoblada',
    value: 'private-semi-furnished-property',
    description:
      'Propiedad privada semi-amoblada más otros espacios comunes compartidos.',
  },
  {
    name: 'Propiedad privada sin amoblar',
    value: 'private-property',
    description: 'Propiedad privada más otros espacios comunes compartidos.',
  },
];

export const floorPlanData = [
  {
    title: 'Salas',
    name: 'living_rooms',
  },
  {
    title: 'Cocinas',
    name: 'kitchens',
  },
  {
    title: 'Comedores',
    name: 'dining_rooms',
  },
  {
    title: 'Habitaciones',
    name: 'rooms',
  },
  {
    title: 'Baños',
    name: 'bathrooms',
  },
];

export const amenitiesData = [
  {
    value: 'swimming_pool',
    name: 'Piscina',
    Icon: SwimmingPool,
    type: 'amenity',
  },
  {
    value: 'jacuzzi',
    name: 'Jacuzzi',
    Icon: Jacuzzi,
    type: 'amenity',
  },
  {
    value: 'balcony',
    name: 'Terraza',
    Icon: Balcony,
    type: 'amenity',
  },
  {
    value: 'grill',
    name: 'Parrilla',
    Icon: Grill,
    type: 'amenity',
  },
  {
    value: 'campfire',
    name: 'Lugar para hacer fogata',
    Icon: CampFire,
    type: 'amenity',
  },
  {
    value: 'billiards',
    name: 'Mesa de billar',
    Icon: Billiards,
    type: 'amenity',
  },
  {
    value: 'fireplace',
    name: 'Chimenea',
    Icon: Fireplace,
    type: 'amenity',
  },
  {
    value: 'street_food',
    name: 'Zona de comida al aire libre',
    Icon: Table,
    type: 'amenity',
  },
  {
    value: 'gym_equipment',
    name: 'Equipo de ejercicio',
    Icon: Dumbell,
    type: 'amenity',
  },
  {
    value: 'wifi',
    name: 'Wifi',
    Icon: Wifi,
    type: 'service',
  },
  {
    value: 'tv',
    name: 'tv',
    Icon: TV,
    type: 'service',
  },
  {
    value: 'stove',
    name: 'Cocina',
    Icon: Stove,
    type: 'service',
  },
  {
    value: 'washer',
    name: 'Lavadora',
    Icon: LaundryMachine,
    type: 'service',
  },
  {
    value: 'parking',
    name: 'Estacionamiento gratuito',
    Icon: Car,
    type: 'service',
  },
  {
    value: 'paid_parking',
    name: 'Estacionamiento de pago',
    Icon: ParkingMeter,
    type: 'service',
  },
  {
    value: 'air_conditioning',
    name: 'Aire acondicionado',
    Icon: AirConditioner,
    type: 'service',
  },
  {
    value: 'workplace',
    name: 'Zona de trabajo',
    Icon: Workplace,
    type: 'service',
  },
  {
    value: 'outside_shower',
    name: 'Ducha exterior',
    Icon: Shower,
    type: 'service',
  },
  {
    value: 'smoke_detector',
    name: 'Detector de humo',
    Icon: SmokeDetector,
    type: 'security',
  },
  {
    value: 'first_aid_kit',
    name: 'Botiquín de primeros auxilios',
    Icon: FirstAidKit,
    type: 'security',
  },
  {
    value: 'carbon_monoxide',
    name: 'Detector de monóxido de carbono',
    Icon: GrapheneCarbon,
    type: 'security',
  },
  {
    value: 'fire_extinguisher',
    name: 'Extintor de incendios',
    Icon: FireExtinguisher,
    type: 'security',
  },
];

export const translateFloorPlan = {
  living_rooms: 'Salas',
  living_rooms_1: 'Sala',
  kitchens: 'Cocinas',
  kitchens_1: 'Cocina',
  dining_rooms: 'Comedores',
  dining_rooms_1: 'Comedor',
  rooms: 'Habitaciones',
  rooms_1: 'Habitación',
  bathrooms: 'Baños',
  bathrooms_1: 'Baño',
};

export const translateExtra = {
  security_cameras: 'Cámaras de seguridad',
  weapons: 'Armas',
  dangerous_animals: 'Animales peligrosos',
};

export const queryParams = [
  'q',
  'min_price',
  'max_price',
  'accommodation_type',
  'living_rooms',
  'kitchens',
  'dining_rooms',
  'rooms',
  'bathrooms',
  'property_type_group',
  'amenities',
  'country',
];

export const accommodationTypeString = [
  'entire-furnished-property',
  'entire-semi-furnished-property',
  'entire-property',
  'private-furnished-property',
  'private-semi-furnished-property',
  'private-property',
];

export const propertyTypeGroupString = [
  'apartment',
  'house',
  'attached-house',
  'unique-property',
];

export const amenitiesDataString = [
  'swimming_pool',
  'jacuzzi',
  'balcony',
  'grill',
  'campfire',
  'billiards',
  'fireplace',
  'street_food',
  'gym_equipment',
  'wifi',
  'tv',
  'stove',
  'washer',
  'parking',
  'paid_parking',
  'air_conditioning',
  'workplace',
  'outside_shower',
  'smoke_detector',
  'first_aid_kit',
  'carbon_monoxide',
  'fire_extinguisher',
];
