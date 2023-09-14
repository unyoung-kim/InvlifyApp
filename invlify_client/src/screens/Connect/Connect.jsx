import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, ButtonBase, Paper, Typography, Avatar } from '@mui/material';

import { SideNav } from '../../components/SideNav';
import { ConnectedAccContext } from '../../contexts/connectedAccContext';

export const Connect = () => {
  const { gmailAuth, qbAuth, startGmailAuth, startQbAuth } =
    useContext(ConnectedAccContext);

  const accountsAuthenticated = gmailAuth && qbAuth;

  if (accountsAuthenticated) {
    return <Navigate to="/orders" />;
  }

  return (
    <Box>
      {/* <SideNav path="Connect" /> */}
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        sx={{
          justifyContent: 'center',
          placeItems: 'center',
        }}
        ml="250px"
      >
        <Box
          // elevation={5}
          sx={{
            width: '600px',
            height: '350px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            placeItems: 'center',
            borderRadius: '20px',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 3, color: '#575BE9' }}
          >
            CONNECT YOUR ACCOUNTS
          </Typography>
          <Paper
            elevation={8}
            sx={{
              width: '450px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              mb: 3,
              // border: '1px solid #4E4E4E',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 64, height: 64 }}
                alt="Gmail"
                src="./gmail1.png"
              />
              <Typography sx={{ fontWeight: 450 }}>Gmail</Typography>
            </Box>
            <Box sx={{ mr: 3 }}>
              {gmailAuth ? (
                <Typography sx={{ color: '#2CA01C', mr: 1 }}>
                  Connected!
                </Typography>
              ) : (
                <ButtonBase
                  sx={{ backgroundColor: '#19212F', borderRadius: '7px' }}
                  onClick={() => {
                    startGmailAuth();
                  }}
                >
                  <Typography
                    sx={{ fontSize: '15px', py: 1, px: 2, color: 'white' }}
                  >
                    Connect
                  </Typography>
                </ButtonBase>
              )}
            </Box>
          </Paper>

          <Paper
            elevation={8}
            sx={{
              width: '450px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              mb: 3,
              // border: '1px solid #4E4E4E',
              justifyContent: 'space-between',
            }}
          >
            {' '}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 45, height: 45, ml: 1.5 }}
                alt="Quickbooks"
                src="./quickbooks.png"
              />
              <Typography sx={{ fontWeight: 450, ml: 1.5 }}>
                QuickBooks
              </Typography>
            </Box>
            <Box sx={{ mr: 3 }}>
              {qbAuth ? (
                <Typography sx={{ color: '#2CA01C', mr: 1 }}>
                  Connected!
                </Typography>
              ) : (
                <ButtonBase
                  sx={{ backgroundColor: '#19212F', borderRadius: '7px' }}
                  onClick={() => {
                    startQbAuth();
                  }}
                >
                  <Typography
                    sx={{ fontSize: '15px', py: 1, px: 2, color: 'white' }}
                  >
                    Connect
                  </Typography>
                </ButtonBase>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
