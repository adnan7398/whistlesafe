import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface GeolocationProps {
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

export default function Geolocation({ onLocationUpdate }: GeolocationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onLocationUpdate(location);
        setIsLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        toast.error('Location access denied. Please enable location services.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={getLocation}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Getting Location...' : 'Get My Location'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
} 