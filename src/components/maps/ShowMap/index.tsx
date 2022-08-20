import dynamic from 'next/dynamic';

export const ShowMapWithNoSSR = dynamic(() => import('./ShowMap'), {
  ssr: false,
});
