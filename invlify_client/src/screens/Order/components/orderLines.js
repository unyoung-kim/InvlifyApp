import React, { useState, useEffect } from 'react';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ButtonBase,
  Box,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import {
  collection,
  query,
  orderBy,
  getDoc,
  where,
  Timestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

export const OrderLineItems = ({ lines, products, order, orderRef }) => {
  const handleAddLine = async () => {
    const [[key, value]] = Object.entries(products); //Get first item
    const newLine = { product: key, quantity: 0 };

    await updateDoc(orderRef, {
      lines: arrayUnion(newLine),
    });
  };

  const handleRemoveLine = async (line) => {
    await updateDoc(orderRef, {
      lines: arrayRemove(line),
    });
  };

  const handleChangeProduct = async (index, event) => {
    order.lines[index].product = event.target.value;

    updateDoc(orderRef, { lines: order.lines });
  };

  const handleChangeQuantity = async (index, event) => {
    order.lines[index].quantity = Number(event.target.value);
    updateDoc(orderRef, { lines: order.lines });
  };

  // If order is confirmed or rejected, should not be able to edit the fields
  if (order.status !== 'pending') {
    return (
      <Box sx={{ width: '45%' }}>
        {lines.map((line, index) => {
          if (!products || !products.hasOwnProperty(line.product)) {
            return;
          }

          return (
            <Box
              key={index}
              sx={{
                mb: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TextField
                // size="small"
                sx={{
                  width: '57%',
                  mr: '3%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                value={products[line.product].name}
                inputProps={{
                  style: {
                    height: 30,
                    padding: '0 14px',
                  },
                }}
              />

              <TextField
                inputProps={{
                  style: {
                    height: 30,
                    padding: '0 14px',
                  },
                }}
                sx={{
                  width: '20%',
                  backgroundColor: '#F9F9FF',
                  borderRadius: '8px',
                  textAlign: 'right',
                  fontSize: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                value={line.quantity}
                type="tel"
              />

              <Typography
                sx={{ fontSize: 13, width: '17%', textAlign: 'right' }}
              >
                ${products[line.product].unitPrice * line.quantity}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '45%' }}>
      {lines.map((line, index) => {
        if (!products || !products.hasOwnProperty(line.product)) {
          return;
        }

        return (
          <Box
            key={index}
            sx={{
              mb: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={line.product}
              sx={{
                width: '57%',
                mr: '3%',
                height: '40px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              style={{ height: 30 }}
              onChange={(e) => {
                handleChangeProduct(index, e);
              }}
            >
              {Object.entries(products).map(([key, prod]) => {
                return (
                  <MenuItem key={key} value={key}>
                    {prod.name}
                  </MenuItem>
                );
              })}
            </Select>

            <TextField
              inputProps={{
                style: {
                  height: 30,
                  padding: '0 14px',
                },
              }}
              sx={{
                width: '20%',
                backgroundColor: '#F9F9FF',
                borderRadius: '8px',
                textAlign: 'right',
                fontSize: '2px',
              }}
              value={line.quantity}
              type="tel"
              size="small"
              onChange={(e) => {
                handleChangeQuantity(index, e);
              }}
            />

            <Typography sx={{ fontSize: 13, width: '17%', textAlign: 'right' }}>
              ${products[line.product].unitPrice * line.quantity}
            </Typography>
            <ButtonBase
              sx={{ ml: '3%' }}
              onClick={() => {
                handleRemoveLine(line);
              }}
            >
              <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
            </ButtonBase>
          </Box>
        );
      })}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ButtonBase
          onClick={() => {
            handleAddLine();
          }}
        >
          <AddCircleOutlineIcon sx={{ alignSelf: 'center' }} />
        </ButtonBase>
      </Box>
    </Box>
  );
};
