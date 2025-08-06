import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function TestAPIs() {
  const [mapboxStatus, setMapboxStatus] = useState('Not tested');
  const [googleStatus, setGoogleStatus] = useState('Not tested');
  
  // Test Mapbox with hardcoded token (we KNOW this works)
  const testMapbox = () => {
    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZnRkY2FkIiwiYSI6ImNtZTBsZ2w1dTA2ajcyam9oN2ZpejNqdWYifQ.yLDH0BiGgnK_UuXrzEHHVg';
      
      const map = new mapboxgl.Map({
        container: 'mapbox-test',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-74.0060, 40.7128],
        zoom: 20
      });
      
      map.on('load', () => {
        setMapboxStatus('✅ Mapbox working!');
      });
      
      map.on('error', (e) => {
        setMapboxStatus('❌ Mapbox error: ' + e.error.message);
      });
    } catch (error) {
      setMapboxStatus('❌ Mapbox failed: ' + error.message);
    }
  };
  
  // Test Google Places with hardcoded key
  const testGoogle = () => {
    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCzxmWHonrIZ8AtkWpU0FKnkVqdYRDQQ7A&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setGoogleStatus('✅ Google Maps script loaded!');
      };
      
      script.onerror = () => {
        setGoogleStatus('❌ Google Maps script failed to load');
      };
      
      document.body.appendChild(script);
    } catch (error) {
      setGoogleStatus('❌ Google failed: ' + error.message);
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Mapbox Test</h2>
        <button onClick={testMapbox}>Test Mapbox</button>
        <p>Status: {mapboxStatus}</p>
        <div id="mapbox-test" style={{ width: '400px', height: '300px', marginTop: '10px' }}></div>
      </div>
      
      <hr />
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Google Places Test</h2>
        <button onClick={testGoogle}>Test Google</button>
        <p>Status: {googleStatus}</p>
      </div>
    </div>
  );
}