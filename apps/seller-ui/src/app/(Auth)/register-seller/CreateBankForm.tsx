'use client';

import React, { useState } from 'react';
import StripeLogo from 'apps/seller-ui/src/assets/svgs/StripeLogo';

interface CreateShopFormProps {
  sellerId: string;
}

const CreateBankForm: React.FC<CreateShopFormProps> = ({ sellerId }) => {
  console.log(sellerId);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectStripe = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch(`${API_URL}/api/create-stripe-connect-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId }),
      });

      const data = await res.json();


      if (!res.ok) {
        throw new Error(data?.message || 'Failed to create Stripe connect account');
      }

      // If your backend returns a redirect URL for Stripe onboarding:
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      // Otherwise just log or handle returned data
      console.log('Stripe response', data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Withdrawal Method
        </h3>
        <p className="text-gray-600 text-sm">
          Connect your Stripe account to receive payments
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <button
        className={`w-full py-3 px-4 bg-[#635BFF] hover:bg-[#5a52e0] rounded-lg text-white font-medium flex items-center justify-center gap-3 transition-colors duration-200 shadow-md hover:shadow-lg ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={connectStripe}
        disabled={loading}
        type="button"
      >
        <StripeLogo />
        {loading ? 'Connecting...' : 'Connect with Stripe'}
      </button>

      {/* Additional information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Why Stripe?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Secure payment processing</li>
          <li>• Fast transfers to your bank account</li>
          <li>• Industry-leading security</li>
          <li>• Support for multiple currencies</li>
        </ul>
      </div>

      {/* Optional: Skip for now button */}
      <div className="mt-4 text-center">
        <button className="text-gray-500 hover:text-gray-700 text-sm underline" type="button">
          I'll do this later
        </button>
      </div>
    </div>
  );
};

export default CreateBankForm;
