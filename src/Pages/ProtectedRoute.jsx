import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from './Role';

const ProtectedRoute = ({ element, requiredRoles }) => {
  const role = useRole();
  console.log('Current role in ProtectedRoute:', role); // Debugging line

  return requiredRoles.includes(role) ? element : <Navigate to="/" />;
};

export default ProtectedRoute;

