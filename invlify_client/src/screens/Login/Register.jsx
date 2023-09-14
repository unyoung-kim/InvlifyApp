import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AuthenticationContext } from '../../contexts/authenticationContext';

export const Register = () => {
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const {
    onCreateAccount,
    isLoading,
    error: authErrorMessage,
  } = useContext(AuthenticationContext);

  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setErrorMessage('');

    if (password !== passwordConfirm) {
      setErrorMessage("Your passwords don't match");
      return;
    } else if (!company || !name || !email || !password || !passwordConfirm) {
      setErrorMessage('Please complete all the fields');
      return;
    } else if (!regex.test(email)) {
      setErrorMessage('Please check your email format');
      return;
    }

    try {
      await onCreateAccount(email, password, company, name);
      navigate('/login');
    } catch (error) {}
  };

  return (
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
            <Typography variant="h1" fontSize="2.5rem">
              Register
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Already have an account? &nbsp;
              <Link
                href="/login"
                color="primary"
                underline="hover"
                variant="subtitle2"
              >
                Log in
              </Link>
            </Typography>
          </Stack>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Company"
              name="company"
              type="text"
              onChange={(e) => setCompany(e.target.value)}
            />

            <TextField
              fullWidth
              label="Name"
              name="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              type="password"
            />
          </Stack>

          {(errorMessage || authErrorMessage) && (
            <FormHelperText sx={{ mt: 1, color: 'red' }}>
              {errorMessage || authErrorMessage}
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
              handleCreateAccount();
            }}
          >
            Create Account
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
        />
      )}
    </Box>
  );
};
