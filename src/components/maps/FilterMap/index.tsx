import dynamic from 'next/dynamic';

export const FilterMapWithNoSSR = dynamic(() => import('./FilterMap'), {
  ssr: false,
});
