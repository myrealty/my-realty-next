export const propertyTypeGroup = [
  {
    name: 'Apartamentos',
    value: 'apartment',
    imgURL: '/assets/img/apartment.jpg',
  },
  { name: 'Casas', value: 'house', imgURL: '/assets/img/house.jpg' },
  {
    name: 'Vivienda anexa',
    value: 'attached-house',
    imgURL: '/assets/img/attached-house.jpg',
  },
  {
    name: 'Propiedades únicas',
    value: 'unique-property',
    imgURL: '/assets/img/unique-property.jpg',
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
    imageURL: '/assets/icon/swimming-pool.png',
    type: 'amenity',
  },
  {
    value: 'jacuzzi',
    name: 'Jacuzzi',
    imageURL: '/assets/icon/jacuzzi.png',
    type: 'amenity',
  },
  {
    value: 'balcony',
    name: 'Terraza',
    imageURL: '/assets/icon/balcony.png',
    type: 'amenity',
  },
  {
    value: 'grill',
    name: 'Parrilla',
    imageURL: '/assets/icon/grill.png',
    type: 'amenity',
  },
  {
    value: 'campfire',
    name: 'Lugar para hacer fogata',
    imageURL: '/assets/icon/campfire.png',
    type: 'amenity',
  },
  {
    value: 'billiards',
    name: 'Mesa de billar',
    imageURL: '/assets/icon/billiards.png',
    type: 'amenity',
  },
  {
    value: 'fireplace',
    name: 'Chimenea',
    imageURL: '/assets/icon/fireplace.png',
    type: 'amenity',
  },
  {
    value: 'street_food',
    name: 'Zona de comida al aire libre',
    imageURL: '/assets/icon/street-food.png',
    type: 'amenity',
  },
  {
    value: 'gym_equipment',
    name: 'Equipo de ejercicio',
    imageURL: '/assets/icon/dumbell.png',
    type: 'amenity',
  },
  {
    value: 'wifi',
    name: 'Wifi',
    imageURL: '/assets/icon/wifi.png',
    type: 'service',
  },
  {
    value: 'tv',
    name: 'tv',
    imageURL: '/assets/icon/tv.png',
    type: 'service',
  },
  {
    value: 'stove',
    name: 'Cocina',
    imageURL: '/assets/icon/stove.png',
    type: 'service',
  },
  {
    value: 'washer',
    name: 'Lavadora',
    imageURL: '/assets/icon/laundry-machine.png',
    type: 'service',
  },
  {
    value: 'parking',
    name: 'Estacionamiento gratuito',
    imageURL: '/assets/icon/car.png',
    type: 'service',
  },
  {
    value: 'paid_parking',
    name: 'Estacionamiento de pago',
    imageURL: '/assets/icon/parking-meter.png',
    type: 'service',
  },
  {
    value: 'air_conditioning',
    name: 'Aire acondicionado',
    imageURL: '/assets/icon/air-conditioning.png',
    type: 'service',
  },
  {
    value: 'workplace',
    name: 'Zona de trabajo',
    imageURL: '/assets/icon/workplace.png',
    type: 'service',
  },
  {
    value: 'outside_shower',
    name: 'Ducha exterior',
    imageURL: '/assets/icon/shower.png',
    type: 'service',
  },
  {
    value: 'smoke_detector',
    name: 'Detector de humo',
    imageURL: '/assets/icon/smoke-detector.png',
    type: 'security',
  },
  {
    value: 'first_aid_kit',
    name: 'Botiquín de primeros auxilios',
    imageURL: '/assets/icon/first-aid-kit.png',
    type: 'security',
  },
  {
    value: 'carbon_monoxide',
    name: 'Detector de monóxido de carbono',
    imageURL: '/assets/icon/carbon-monoxide.png',
    type: 'security',
  },
  {
    value: 'fire_extinguisher',
    name: 'Extintor de incendios',
    imageURL: '/assets/icon/fire-extinguisher.png',
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
  'city',
  'state',
  'country',
  'lat',
  'lng',
];

export const accommodationTypeString = [
  'entire-property',
  'entire-furnished-property',
  'entire-semi-furnished-property',
  'private-room',
  'private-furnished-room',
  'private-semi-furnished-room',
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
