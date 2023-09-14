import React from 'react';

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  TextField,
} from '@mui/material';

import { SideNav } from '../../components/SideNav';
import { AddBoxOutlined } from '@mui/icons-material';

export const Inventory = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <SideNav path="Inventory" />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          ml: '250px',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" sx={{ m: 4 }}>
          Inventory
        </Typography>
        <Paper
          elevation={5}
          sx={{ ml: 4, display: 'flex', width: '50%', borderRadius: '10px' }}
        >
          <List
            sx={{
              width: '100%',
              backgroundColor: '#F1F0F0',
              borderRadius: '10px',
            }}
            component="nav"
            aria-label="mailbox folders"
          >
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ flex: 3 }}>PRODUCT</Typography>
              <Typography sx={{ flex: 1 }}>PRICE</Typography>
              <Typography sx={{ flex: 2, textAlign: 'end', pr: 3 }}>
                IN STOCK
              </Typography>
            </ListItem>
            <Divider />

            <ListItem
              sx={{
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ flex: 3 }}>Product</Typography>
              <Typography sx={{ flex: 1 }}>10</Typography>
              <Box
                sx={{ flex: 2, display: 'flex', justifyContent: 'flex-end' }}
              >
                <TextField
                  sx={{ width: '40%', mr: 2, alignSelf: 'center' }}
                  size="small"
                />
              </Box>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Box>
  );
};
