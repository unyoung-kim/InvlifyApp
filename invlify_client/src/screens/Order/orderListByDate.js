import React, { useState, useEffect } from 'react';

import {
  Box,
  ButtonBase,
  Paper,
  Typography,
  Grid,
  Drawer,
} from '@mui/material';

import { OrderAccordion } from './orderAccordion';

import { createInvoice } from '../../utils';

export const OrderListByDate = ({
  date,
  orders,
  userId,
  products,
  customers,
  userMetadata,
  userInfo,
  isTodaysOrder,
}) => {
  const handleConfirmAll = (userMetadata, orders, products, uid) => {
    for (const order of orders) {
      console.log(order);
      createInvoice(userMetadata, order, products, uid);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          my: 1,
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: '#515050' }}>
          {date}
        </Typography>

        <ButtonBase
          sx={{
            backgroundColor: '#575BE9',
            px: 2,
            height: 35,
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
      </Box>
      <Paper elevation={5} sx={{ mb: 3 }}>
        {orders.map((item, index) => {
          return (
            <OrderAccordion
              key={item.orderID}
              userId={userId}
              order={item}
              products={products}
              customers={customers}
              userMetadata={userMetadata}
              isTodaysOrder={isTodaysOrder}
            />
          );
        })}
      </Paper>
    </Box>
  );
};
