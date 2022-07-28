export const geolocation = (): Promise<{
  lat: number;
  lng: number;
}> =>
  new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({ lat: coords.latitude, lng: coords.longitude });
        },
        (err) => {
          reject(
            new Error(
              err.code === 1
                ? 'Error: debes permitir el acceso de tu ubicación.'
                : 'Error: debes tener acceso a internet.'
            )
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  });
