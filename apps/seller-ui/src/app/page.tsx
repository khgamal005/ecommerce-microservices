// app/test/page.tsx
'use client';

import React from 'react';
import useSeller from './hook/useSeller';

const TestPage = () => {
  const { seller, isLoading, error, logout, isLoggingOut, refetch } = useSeller();

  const handleLoginTest = async () => {
    // For testing, you might want to simulate a login
    // This would typically be done through your login form
    console.log('Redirect to login page or show login form');
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading seller data</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
          <button
            onClick={handleLoginTest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mr-2"
          >
            Test Login
          </button>
          <button
            onClick={handleRefresh}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Seller Authentication Test
          </h1>

          {seller ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome, {seller.name}!
              </h2>
              
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> {seller.email}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Role:</span> {seller.role}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">ID:</span> {seller.id}
                </p>
                {seller.shop && (
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Shop:</span> {seller.shop.name}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout Seller'}
                </button>
                
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                No Seller Logged In
              </h2>
              
              <p className="text-gray-600 mb-6">
                Please log in as a seller to test the authentication system.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleLoginTest}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Test Login
                </button>
                
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Check Authentication
                </button>
              </div>
            </div>
          )}

          {/* Debug Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Debug Info:</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
              <p>Logging Out: {isLoggingOut ? 'Yes' : 'No'}</p>
              <p>Has Seller: {seller ? 'Yes' : 'No'}</p>
              <p>Has Error: {error ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;