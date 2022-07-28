export const shimmer = (w: string | number, h: string | number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="rgba(190,190,190,.2)" offset="20%" />
      <stop stop-color="rgba(129,129,129,.24)" offset="50%" />
      <stop stop-color="rgba(190,190,190,.2)" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="rgba(190,190,190,.2)" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
