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

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { OrderLineItems } from './components/orderLines';

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

import { firestoreDB, firebaseAuth } from '../../config/firebaseConfig';
import { LegendToggle } from '@mui/icons-material';
import { createInvoice } from '../../utils';

const StatusSign = ({ status }) => {
  let bgColor = '#EBEBEB';
  let fontColor = '#363636';
  let statusText = 'Pending';

  if (status === 'confirmed') {
    bgColor = '#E4FFE4';
    fontColor = '#65C253';
    statusText = 'Confirmed';
  } else if (status === 'rejected') {
    bgColor = '#FFEDED';
    fontColor = '#D74C39';
    statusText = 'Rejected';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '5px',
        width: '10%',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          backgroundColor: bgColor,
          padding: '5px',
          px: 1.5,
          borderRadius: '13px',
          fontSize: 10,
          fontWeight: 600,
          color: fontColor,
        }}
      >
        {statusText}
      </Typography>
    </Box>
  );
};

const totalPrice = (order, products) => {
  const { lines } = order;
  let totalPrice = 0;

  for (const line of lines) {
    if (!products || !products.hasOwnProperty(line.product)) {
      continue;
    }

    if (line.id === '-1') {
      continue;
    }
    totalPrice += products[line.product].unitPrice * line.quantity;
  }

  return totalPrice;
};

export const OrderAccordion = ({
  userId,
  order,
  products,
  customers,
  userMetadata,
  isTodaysOrder,
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
  }, []);

  const handleReject = async () => {
    await updateDoc(orderRef, {
      status: 'rejected',
    });
  };

  if (!customers || !customers.hasOwnProperty(order.customer)) {
    return;
  }

  return (
    <Box borderTop={1} borderRight={1} borderLeft={1} borderColor="#E9E9E9">
      <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: '#F9F9FF',
            }}
          >
            <Typography
              sx={{
                width: '25%',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {customers[order.customer].name}
            </Typography>

            <StatusSign status={order.status} />

            <Typography sx={{ width: '35%' }}>&nbsp; ...</Typography>
            <Typography sx={{ fontSize: 14, width: '15%', fontWeight: 500 }}>
              Total: ${totalPrice(order, products)}
            </Typography>
            {order.status === 'pending' ? (
              <Box sx={{ mx: 2, width: '10%' }}>
                <ButtonBase
                  onClick={() => {
                    handleReject();
                  }}
                >
                  <CancelOutlinedIcon sx={{ color: '#CB1212' }} />
                </ButtonBase>
                <ButtonBase
                  sx={{ ml: 1 }}
                  onClick={() => {
                    // CreateInvoice also handles changing Confirm
                    createInvoice(userMetadata, order, products, userId);
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ color: '#47A21D' }} />
                </ButtonBase>
              </Box>
            ) : (
              <Box sx={{ mx: 2, width: '10%' }}></Box>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '31%' }}></Box>
            <OrderLineItems
              lines={lines}
              products={products}
              order={order}
              orderRef={orderRef}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
