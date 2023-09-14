import React, { useState, useEffect } from 'react';

import {
  Box,
  ButtonBase,
  Paper,
  Typography,
  Grid,
  Drawer,
} from '@mui/material';

import { OrderCard } from './orderCard';

import { createInvoice } from '../../utils';

const handleConfirmAll = (userMetadata, orders, products, uid) => {
  for (const order of orders) {
    if (order.status === 'pending') {
      createInvoice(userMetadata, order, products, uid);
    }
  }
};

export const OrdersByDate = ({
  date,
  orders,
  userId,
  products,
  customers,
  userMetadata,
  userInfo,
}) => {
  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', mt: 3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ ml: 3, color: '#515050' }}>
          {date}
        </Typography>
        <Box>
          <ButtonBase
            sx={{
              backgroundColor: '#575BE9',
              px: 2,
              height: 35,
              mr: 10,
              borderRadius: '5px',
            }}
            onClick={() => {
              handleConfirmAll(userMetadata, orders, products, userId);
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Confirm all
            </Typography>
          </ButtonBase>
          {/* <ButtonBase
            sx={{
              backgroundColor: '#575BE9',
              px: 2,
              height: 35,
              borderRadius: '5px',
              mr: 5,
            }}
            onClick={() => {}}
          >
            <Typography
              variant="body2"
              sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Confirm & send all
            </Typography>
          </ButtonBase> */}
        </Box>
      </Box>

      <Box>
        <Grid
          container
          spacing={2}
          columns={{ xs: 4, sm: 8, md: 8, lg: 12 }}
          sx={{ pl: 3, pr: 5, mt: 0.2 }}
        >
          {orders.map((item, index) => {
            return (
              <OrderCard
                userId={userId}
                key={index}
                order={item}
                products={products}
                customers={customers}
                userMetadata={userMetadata}
              />
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
