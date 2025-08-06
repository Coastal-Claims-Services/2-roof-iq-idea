import React, { useState } from 'react';

export default function TestApp() {
  const [status, setStatus] = useState('App loaded successfully!');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>RoofIQ Test</h1>
      <p>{status}</p>
      <button onClick={() => setStatus('Button clicked!')}>
        Test Button
      </button>
    </div>
  );
}