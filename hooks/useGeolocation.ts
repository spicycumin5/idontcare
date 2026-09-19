import { useState } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ loading: false, error: null });

  function requestLocation(): Promise<{ lat: number; lng: number }> {
    setState({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        const error = "Geolocation isn't supported on this device.";
        setState({ loading: false, error });
        reject(new Error(error));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null });
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          const error =
            err.code === err.PERMISSION_DENIED
              ? "Location permission was denied. Try typing a place instead."
              : "Couldn't get your location. Try typing a place instead.";
          setState({ loading: false, error });
          reject(new Error(error));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  return { ...state, requestLocation };
}
