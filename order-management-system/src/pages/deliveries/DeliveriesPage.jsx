import React from 'react';
import { Truck } from 'lucide-react';

const DeliveriesPage = () => {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Deliveries
          </h2>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Management</h3>
          <p className="text-gray-600">
            This page will show all deliveries with tracking information and status updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveriesPage;