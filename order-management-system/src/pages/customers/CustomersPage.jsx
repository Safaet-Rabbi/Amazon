import React from 'react';
import { Users } from 'lucide-react';

const CustomersPage = () => {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Customers
          </h2>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Management</h3>
          <p className="text-gray-600">
            This page will show all customers with their details, membership levels, and order history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;