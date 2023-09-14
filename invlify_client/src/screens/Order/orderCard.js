import React, { useEffect, useState } from 'react';

import {
  Box,
  ButtonBase,
  Paper,
  Typography,
  Grid,
  Item,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { firestoreDB, firebaseAuth } from '../../config/firebaseConfig';

import { createInvoice } from '../../utils';

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

const totalPrice = (order, products) => {
  const { lines } = order;
  let totalPrice = 0;

  for (const line of lines) {
    if (!products || !products.hasOwnProperty(line.product.name)) {
      continue;
    }

    if (line.id === '-1') {
      continue;
    }
    totalPrice += products[line.product.name].unitPrice * line.quantity;
  }

  return totalPrice;
};

export const OrderCard = ({
  userId,
  order,
  products,
  customers,
  userMetadata,
}) => {
  const { lines } = order;

  const [orderRef, setOrderRef] = useState(null);

  useEffect(() => {
    const getOrderRef = async () => {
      const orderRef = await doc(
        firestoreDB,
        'users',
        userId,
        'orders',
        order.orderID
      );

      setOrderRef(orderRef);
    };

    getOrderRef();
  }, [userId]);

  const handleConfirm = async () => {
    await updateDoc(orderRef, {
      status: 'confirmed',
    });
  };

  const handleReject = async () => {
    await updateDoc(orderRef, {
      status: 'rejected',
    });
  };

  const handleAddLine = async () => {
    const newLine = { id: '-1', quantity: 0 };
    const newOrder = order.lines;

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
    order.lines[index].name = event.target.value;
    updateDoc(orderRef, { lines: order.lines });
  };

  const handleChangeQuantity = async (index, event) => {
    order.lines[index].quantity = Number(event.target.value);
    updateDoc(orderRef, { lines: order.lines });
  };

  if (!customers || !customers.hasOwnProperty(order.customer)) {
    return;
  }

  return (
    <Grid item xs={4} md={4} lg={4}>
      <Paper sx={{ p: 2, borderRadius: '20px' }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '80%' }}>
            <Typography
              variant="subtitle1"
              sx={{
                width: '55%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {customers[order.customer].name}
            </Typography>
            <Typography variant="subtitle2" sx={{ ml: 3, color: '#8B8B92' }}>
              Total: ${totalPrice(order, products)}
            </Typography>
          </Box>
          <Box>
            {/* Confirm Button */}
            <ButtonBase
              sx={{
                mr: 1,
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: '#7986CB', // Define the hover color
                },
              }}
              onClick={() => {
                createInvoice(userMetadata, order, products, userId); // Status updated when invoice created
                // handleConfirm();
              }}
            >
              <CheckCircleOutlineIcon sx={{ color: '#47A21D' }} />
            </ButtonBase>
            {/* Reject Button */}
            <ButtonBase
              sx={{
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: '#7986CB', // Define the hover color
                },
              }}
              onClick={() => {
                handleReject();
              }}
            >
              <CancelOutlinedIcon sx={{ color: '#CB1212' }} />
            </ButtonBase>
          </Box>
        </Box>

        {lines.map((line, index) => {
          let item;
          if (line.id === '-1') {
            item = { name: 'Select a product', unitPrice: 0 };
          } else {
            item = products[line.name];
          }

          if (!products || !products.hasOwnProperty(line.name)) {
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
                value={line.name}
                sx={{ width: '57%', mr: '3%', height: '40px' }}
                onChange={(e) => {
                  handleChangeProduct(index, e);
                }}
              >
                <MenuItem key="-1" value="-1">
                  Select a Product
                </MenuItem>
                {Object.entries(products).map(([key, item]) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>

              <TextField
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

              <Typography
                sx={{ fontSize: 13, width: '17%', textAlign: 'right' }}
              >
                $ {item.unitPrice * line.quantity}
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
      </Paper>
    </Grid>
  );
};
