import { useContext } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from '@mui/material';

import InventoryIcon from '@mui/icons-material/Inventory';
import EmailIcon from '@mui/icons-material/Email';
// import ShareIcon from '@mui/icons-material/Share';
import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authenticationContext';
import { onLog } from 'firebase/app';

const SideButton = ({ name, renderIcon, route, isSelected }) => {
  const navigate = useNavigate();

  const fontColor = isSelected ? 'white' : '#919AA4';
  const iconColor = isSelected ? '#575BE9' : '#919AA4';

  return (
    <Button
      sx={{
        width: '210px',
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 1,
        alignItems: 'center',
        '&:hover': {
          backgroundColor: '#283242', // Set the desired background color on hover
          // color: '#283242', // Set the desired text color on hover
        },
      }}
      onClick={() => navigate(route)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {renderIcon(iconColor)}
        <Typography
          sx={{ textTransform: 'none', fontSize: 15, fontWeight: 600, ml: 1 }}
          color={fontColor}
          varaint="h2"
        >
          {name}
        </Typography>
      </Box>
    </Button>
  );
};

const LogOutButton = () => {
  const navigate = useNavigate();
  const { onLogout } = useContext(AuthenticationContext);

  return (
    <Button
      sx={{
        width: '210px',
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 1,
        alignItems: 'center',
        '&:hover': {
          backgroundColor: '#283242', // Set the desired background color on hover
          // color: '#283242', // Set the desired text color on hover
        },
      }}
      onClick={() => {
        console.log('Log Out');
        onLogout();
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <LogoutIcon sx={{ color: '#919AA4', fontSize: 20 }} />
        <Typography
          sx={{ textTransform: 'none', fontSize: 15, fontWeight: 600, ml: 1 }}
          color="#919AA4"
          varaint="h2"
        >
          Log Out
        </Typography>
      </Box>
    </Button>
  );
};

export const SideNav = ({ path, user }) => {
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '250px',
        backgroundColor: '#19212F',
        position: 'fixed',
      }}
    >
      <Box
        component="img"
        sx={{
          height: 35,
          width: 65,
          m: 3,
          ml: 4,
        }}
        alt="The house from the offer."
        src="./logo3.png"
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '200px',
            height: '70px',
            borderRadius: '8px',
            backgroundColor: '#283242',
          }}
        >
          <Typography
            color="white"
            variant="subtitle1"
            sx={{
              width: '170px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              p: 2,
            }}
          >
            {user.company}
          </Typography>
        </Box>
        <Box
          sx={{
            my: 3,
            width: '100%',
            height: '1px',
            backgroundColor: '#28303D',
          }}
        ></Box>

        <SideButton
          name="Orders"
          renderIcon={(iconColor) => (
            <EmailIcon sx={{ color: iconColor, fontSize: 20 }} />
          )}
          route="/orders"
          isSelected={path === 'Orders'}
        />
        {/* <SideButton
          name="Inventory"
          renderIcon={(iconColor) => (
            <InventoryIcon sx={{ color: iconColor, fontSize: 20 }} />
          )}
          route="/inventory"
          isSelected={path === 'Inventory'}
        /> */}
        {/* <SideButton
          name="Connect Accounts"
          renderIcon={(iconColor) => (
            <ShareIcon sx={{ color: iconColor, fontSize: 20 }} />
          )}
          route="/connect"
          isSelected={path === 'Connect'}
        /> */}

        <LogOutButton />
      </Box>
    </Box>
  );
};
