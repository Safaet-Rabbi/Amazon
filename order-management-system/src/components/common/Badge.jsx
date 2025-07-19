import React from 'react';
import { getStatusBadgeClass } from '../../utils/helpers';

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const baseClasses = 'badge';
  const variantClass = variant.startsWith('badge-') ? variant : `badge-${variant}`;
  
  return (
    <span className={`${baseClasses} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const badgeClass = getStatusBadgeClass(status);
  
  return (
    <Badge variant={badgeClass} className={className}>
      {status?.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  );
};

export default Badge;