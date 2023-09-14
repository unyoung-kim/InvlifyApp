import React, { useState, useEffect, createContext, useContext } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { AuthenticationContext } from './authenticationContext';
import {
  getUserMetadata,
  refreshQuickbooksAccessToken,
  watchEmail,
  domainToUse,
  updateCustomer,
  updateProducts,
} from '../utils';

export const ConnectedAccContext = createContext();

export const ConnectedAccContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthenticationContext);

  const [loading, setLoading] = useState(false);
  const [gmailAuth, setGmailAuth] = useState(false);
  const [qbAuth, setQbAuth] = useState(false);

  useEffect(() => {
    const _setAuthStatus = async () => {
      setLoading(true);

      try {
        if (isAuthenticated) {
          const userMetadata = await getUserMetadata(user?.uid);

          // Sync Customer and Product with firebase

          if (userMetadata) {
            const {
              gmailRefreshToken,
              quickbooksAccessToken,
              quickbooksAccessTokenExpiry,
            } = userMetadata;

            //Update Customer and Product to the most recent version
            updateCustomer(user?.uid);
            updateProducts(user?.uid);
            console.log('Refreshed customer and Products');

            // Refresh access token if expired.
            if (Date.now() >= quickbooksAccessTokenExpiry) {
              await refreshQuickbooksAccessToken(user?.uid);
            }

            // Re-watch user's email because watching expires in 5 days.
            if (gmailRefreshToken) {
              await watchEmail(user?.uid);
            }

            // The presence of "gmailRefreshToken" field indicates Gmail is
            // auth'd. Same thing with "quickbooksAccessToken" for QuickBooks.
            setGmailAuth(!!gmailRefreshToken);
            setQbAuth(!!quickbooksAccessToken);
          } else {
            setGmailAuth(false);
            setQbAuth(false);
          }
        }
      } catch (error) {
        console.error('Error setting auth status.', error);
      }

      setLoading(false);
    };

    _setAuthStatus();
  }, [isAuthenticated]);

  const startQbAuth = () => {
    const currentLocationHref = window.location.href;
    const encodedCurrentLocationHref = encodeURIComponent(currentLocationHref);
    window.location.href = `${domainToUse}/auth/quickbooks?uid=${user?.uid}&redirectUrl=${encodedCurrentLocationHref}`;
  };

  const startGmailAuth = () => {
    const currentLocationHref = window.location.href;
    const encodedCurrentLocationHref = encodeURIComponent(currentLocationHref);
    window.location.href = `${domainToUse}/auth/google?uid=${user?.uid}&redirectUrl=${encodedCurrentLocationHref}`;
  };

  if (loading) {
    return (
      <Box display="grid" sx={{ placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ConnectedAccContext.Provider
      value={{ qbAuth, gmailAuth, startQbAuth, startGmailAuth }}
    >
      {children}
    </ConnectedAccContext.Provider>
  );
};
