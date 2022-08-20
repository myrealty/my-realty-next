/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(fn: any, time: number) {
  let timeoutId: any;
  return function (...args: any[]) {
    if (typeof window !== 'undefined') {
      timeoutId && clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, time);
    }
  };
}
