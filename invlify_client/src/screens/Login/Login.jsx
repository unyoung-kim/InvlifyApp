import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  FormHelperText,
  Typography,
  CircularProgress,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AuthenticationContext } from '../../contexts/authenticationContext';

export const Login = () => {
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    isAuthenticated,
    onLogin,
    isLoading,
    error: authErrorMessage,
  } = useContext(AuthenticationContext);

  if (isAuthenticated) return <Navigate to="/orders" />;

  return (
    <>
      <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  href="/register"
                  color="primary"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </Stack>

            {authErrorMessage && (
              <FormHelperText sx={{ mt: 1, color: 'red' }}>
                {authErrorMessage}
              </FormHelperText>
            )}

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                onLogin(email, password);
              }}
            >
              Continue
            </Button>

            <Box
              mt={4}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isLoading && <CircularProgress />}
            </Box>

            {/* <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              onClick={() => navigate('/orders')}
            >
              Skip authentication
            </Button> */}

            <Typography>Need help? Contact us at support@lcavr.com</Typography>
          </Box>
        </Box>
        {isMediumScreen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'black',
              width: '50%',
            }}
          >
            Here
          </Box>
        )}
      </Box>
    </>
  );
};
