import React from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const TrackingPage = () => {
  const { trackingNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your tracking number to see the current status of your delivery.</p>
        </div>

        <div className="card">
          <div className="card-body text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Tracking</h3>
            <p className="text-gray-600 mb-4">
              {trackingNumber ? `Tracking: ${trackingNumber}` : 'Enter a tracking number to view delivery status'}
            </p>
            {!trackingNumber && (
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter tracking number..."
                />
                <button className="btn-primary w-full mt-4">
                  Track Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;