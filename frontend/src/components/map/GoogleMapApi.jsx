import React from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.5665, // 서울 위도
  lng: 126.9780, // 서울 경도
};

const GoogleMapApi = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.VITE_GOOGLEMAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center}/>
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapApi;
