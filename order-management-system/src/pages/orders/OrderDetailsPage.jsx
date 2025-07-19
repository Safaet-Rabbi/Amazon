import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailsPage = () => {
  const { orderId } = useParams();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Order Details - {orderId}
      </h2>
      <div className="card">
        <div className="card-body text-center py-12">
          <p className="text-gray-600">
            Order details will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;