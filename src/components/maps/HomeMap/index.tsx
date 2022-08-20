import dynamic from 'next/dynamic';

export const HomeMapWithNoSSR = dynamic(() => import('./HomeMap'), {
  ssr: false,
});
