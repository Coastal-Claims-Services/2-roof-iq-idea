import React from 'react';

function App() {
  console.log('=== APP COMPONENT RENDERING ===');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <h1>RoofIQ App - Debug Mode</h1>
      <p>If you can see this, the app is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;