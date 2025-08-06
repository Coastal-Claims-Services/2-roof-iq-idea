import { useState } from 'react';

function App() {
  const [address, setAddress] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState('');

  const handleMeasureRoof = () => {
    setSubmittedAddress(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          RoofIQ
        </h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Property Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter property address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleMeasureRoof}
            disabled={!address.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Measure Roof
          </button>
          
          {submittedAddress && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-sm font-medium text-green-800 mb-1">
                Selected Address:
              </h3>
              <p className="text-sm text-green-700">
                {submittedAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;