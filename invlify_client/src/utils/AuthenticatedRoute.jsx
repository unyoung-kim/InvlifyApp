import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { AuthenticationContext, ConnectedAccContext } from '../contexts';

const AuthenticatedRoute = ({ children, disableConnectCheck = false }) => {
  const { isLoading, isAuthenticated } = useContext(AuthenticationContext);
  const { gmailAuth, qbAuth } = useContext(ConnectedAccContext);

  if (isLoading) {
    return (
      <Box display="grid" sx={{ placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const accountsAuthenticated = gmailAuth && qbAuth;

  if (!accountsAuthenticated && !disableConnectCheck) {
    return <Navigate to="/connect" />;
  }

  return children;
};

export default AuthenticatedRoute;
