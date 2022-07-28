import dynamic from 'next/dynamic';

export const MapLocationWithNoSSR = dynamic(() => import('./MapLocation'), {
  ssr: false,
});
