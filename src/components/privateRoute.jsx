import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStoreContext } from '../context';

const PrivateRoute = ({ children }) => {
  const { user } = useStoreContext();
  return user && user.uid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;