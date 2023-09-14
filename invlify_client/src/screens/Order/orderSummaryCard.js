import React, { useState, useEffect } from 'react';
import {
  Box,
  ButtonBase,
  Paper,
  Typography,
  Grid,
  Drawer,
} from '@mui/material';

const totalOrders = (activeOrders, products) => {
  const orderSummary = {};

  for (const order of activeOrders) {
    const { lines } = order;
    for (const line of lines) {
      if (!products || !products.hasOwnProperty(line.product)) {
        continue;
      }
      const item = products[line.product];
      if (line.id == '-1') {
        continue;
      }

      const name = item.name;
      const qty = line.quantity;

      if (orderSummary[name]) {
        if (order.status === 'confirmed') {
          orderSummary[name][0] += qty;
        } else if (order.status === 'pending') {
          orderSummary[name][1] += qty;
        }
      } else {
        if (order.status === 'confirmed') {
          orderSummary[name] = [qty, 0];
        } else if (order.status === 'pending') {
          orderSummary[name] = [0, qty];
        }
      }
    }
  }

  return orderSummary;
};

export const OrderSummaryCard = ({ activeOrders, products }) => {
  const [orderSummary, setOrderSummary] = useState({});

  useEffect(() => {
    setOrderSummary(totalOrders(activeOrders, products));
  }, [activeOrders]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        my: 3,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          backgroundColor: '#575BE9',

          borderRadius: '12px 12px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: 'white', textAlign: 'center', py: 2 }}
        >
          ORDER SUMMARY
        </Typography>
      </Paper>
      <Paper
        elevation={5}
        sx={{
          borderRadius: '0 0 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '90%',
            display: 'flex',
            pt: 2,
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="body2"
            sx={{ width: '50%', fontWeight: 500, fontSize: 12 }}
          >
            PRODUCT
          </Typography>

          <Box
            sx={{
              display: 'flex',
              width: '50%',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 10, color: '#65C253' }}
            >
              CONFIRMED
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 10, color: '#363636' }}
            >
              PENDING
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '90%',
            backgroundColor: '#BEBEBE',
            height: '1px',
            mb: 1,
          }}
        ></Box>
        <Box
          sx={{
            display: 'flex',
            p: 2,
            pt: 0.5,
            flexDirection: 'column',
            width: '90%',
          }}
        >
          {Object.entries(orderSummary).map(([itemName, quantity]) => (
            <Box
              key={itemName}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  width: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {itemName}
              </Typography>{' '}
              <Box
                sx={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ ml: 3, fontWeight: 500, color: '#65C253' }}
                >
                  {quantity[0]}
                </Typography>
                <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                  {quantity[1]}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
