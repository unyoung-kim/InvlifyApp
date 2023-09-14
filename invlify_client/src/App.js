import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, Typography, Button } from '@mui/material';

import {
  AuthenticationContextProvider,
  AuthenticationContext,
  ConnectedAccContextProvider,
} from './contexts';
import { AuthenticatedRoute } from './utils';
import { createTypography } from './theme/font';

import { Login } from './screens/Login/Login';
import { Inventory } from './screens/Inventory/inventory';
import { Order } from './screens/Order/order';
import { Register } from './screens/Login/Register';
import { Connect } from './screens/Connect/Connect';
import EndUserLicense from './screens/Agreements/EndUserLicense';
import PrivacyPolicy from './screens/Agreements/PrivacyPolicy';

const theme = createTheme({
  palette: {
    primary: {
      main: '#575BE9',
      dark: '#4649BA',
    },
  },
  typography: createTypography,
});

const RootElement = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);

  return isAuthenticated ? <Navigate to="/orders" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthenticationContextProvider>
        <ConnectedAccContextProvider>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<RootElement />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/connect"
                element={
                  <AuthenticatedRoute disableConnectCheck>
                    <Connect />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <AuthenticatedRoute>
                    <Inventory />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <AuthenticatedRoute>
                    <Order />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/agreements/end-user-license"
                element={<EndUserLicense />}
              />
              <Route
                path="/agreements/privacy-policy"
                element={<PrivacyPolicy />}
              />
              <Route
                path="/disconnect/quickbooks"
                element={
                  <Box>
                    <Typography>
                      Click to disconnect your Quickbooks account from Invlify
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() =>
                        window.location.assign('/disconnect/quickbooks/success')
                      }
                    >
                      Disconnect
                    </Button>
                  </Box>
                }
              />
              <Route
                path="/disconnect/quickbooks/success"
                element={<Typography>Success</Typography>}
              />
            </Routes>
          </ThemeProvider>
        </ConnectedAccContextProvider>
      </AuthenticationContextProvider>
    </BrowserRouter>
  );
}

export default App;
