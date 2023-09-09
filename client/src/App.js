import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import "./App.css";

const containerStyle = {
  width: '100%',
  height: '400px',
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [diameter, setDiameter] = useState(100); // Initial diameter in meters

  // const apiKey = 'AIzaSyCVw6T2ciSUbgd6aOY32WziaWcsWWOi71Y'; // Replace with your Google Maps API key
  const apiKey = process.env.REACT_APP_API_KEY

  // Initialize the Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  // Function to handle the map click event
  const handleMapClick = (event) => {
    setSelectedLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  // Function to calculate bounds based on the selected location and diameter
  const calculateBounds = () => {
    if (selectedLocation) {
      	
      const earthRadius = 6371; // Earth's radius in km
      const radiusInKm = 1; // Convert meters to km

      const lat = selectedLocation.lat;
      const lng = selectedLocation.lng;

      const latDelta = (radiusInKm / earthRadius) * (180 / Math.PI);
      const lngDelta = (radiusInKm / earthRadius) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);

      const north = lat + latDelta;
      const south = lat - latDelta;
      const east = lng + lngDelta;
      const west = lng - lngDelta;

      return { north, south, east, west };
    }
    return null;
  };

  // Function to generate the image URL based on bounds
  const getImageUrl = () => {
    const bounds = calculateBounds();
    console.log(bounds)
    if (bounds) {
      // Use the bounds to request an aerial image
      const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${selectedLocation.lat},${selectedLocation.lng}&zoom=20&size=800x400&maptype=satellite&sensor=false&key=${process.env.REACT_APP_API_KEY}&bounds=${bounds.south},${bounds.west}|${bounds.north},${bounds.east}`;
      // console.log(imageUrl)
      return imageUrl;
    }
    return null;
  };

  useEffect(() => {
    // Check if the Google Maps API has been loaded successfully
    if (isLoaded) {
      // You can initialize any additional Google Maps functionality here if needed
    } else if (loadError) {
      console.error('Error loading Google Maps API:', loadError);
    }
  }, [isLoaded, loadError]);

  return (
    <div className='App'>
      <h1>Aerial View Image Extractor</h1>
      {isLoaded && (
        <div>
          <label>Select a location on the map:</label>
          hii:{process.env.REACT_APP_API_KEY}
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={100}
            center={{ lat: 36.0544, lng: -112.1401  }} // Initial map center
            onClick={handleMapClick}
          >
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </div>
      )}
      <div className='diameter'>
        <label>Diameter (in meters):</label>
        <input
          type='number'
          value={diameter}
          onChange={(e) => setDiameter(e.target.value)}
        />
      </div>
      {isLoaded && (
        <div className='mainContent'>
          {selectedLocation && (
            <div>
              <h2>Selected Location:</h2>
              <p>Latitude: {selectedLocation.lat}</p>
              <p>Longitude: {selectedLocation.lng}</p>
              <h2>Aerial View Image:</h2>
              <img src={getImageUrl()} alt='Aerial View' />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
