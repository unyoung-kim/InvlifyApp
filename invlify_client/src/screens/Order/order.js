import React, { useState, useEffect } from 'react';

import {
  Box,
  ButtonBase,
  Paper,
  Typography,
  Grid,
  Drawer,
  Button,
  CircularProgress,
} from '@mui/material';

import { SideNav } from '../../components/SideNav';
import { OrderCard } from './orderCard';
import { OrderSummaryCard } from './orderSummaryCard';
import { OrdersByDate } from './ordersByDate';
import { OrdersList } from './orderAccordion';

import { firestoreDB, firebaseAuth } from '../../config/firebaseConfig';
import { updateCustomer, updateProducts } from '../../utils';

import {
  collection,
  query,
  orderBy,
  getDoc,
  where,
  Timestamp,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import { OrderListByDate } from './orderListByDate';

const groupOrdersByDate = (orderData) => {
  const groupedOrder = orderData.reduce((result, item) => {
    const date = new Date(item.orderDue.toDate());
    const dateString = date.toDateString();

    if (
      item.status === 'pending' ||
      item.status === 'confirmed' ||
      item.status === 'rejected'
    ) {
      console.log(dateString);
      if (!result[dateString]) {
        result[dateString] = [];
      }
      result[dateString].push(item);
    }

    return result;
  }, {});

  console.log(groupedOrder);

  return groupedOrder;
};

export const Order = () => {
  const [orderData, setOrderData] = useState([]);
  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [groupedOrder, setGroupedOrder] = useState(null)

  useEffect(() => {
    setLoading(true);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    //Set to midnight
    const currentTimestamp = Timestamp.fromDate(currentDate);

    console.log(currentTimestamp);
    //Get Orders
    const userId = firebaseAuth.currentUser?.uid || 'CxFplWyGbrnzbZ3JlYwT'; // For testing only.
    setUserId(userId);

    // const getOrders = async () => {
    const orderRef = collection(firestoreDB, 'users', userId, 'orders');
    // Time stamp of an order that is due i.e. July 11 should be set to Jully 11, 11:59pm
    const orderQuery = query(
      orderRef,
      where('orderDue', '>=', currentTimestamp),
      orderBy('orderDue')
    );

    const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
      try {
        const data = [];
        querySnapshot.forEach((doc) => {
          const docDataWithID = {
            ...doc.data(),
            orderID: doc.id,
          };

          data.push(docDataWithID);
        });
        setOrderData(data);
      } catch (error) {
        console.error('Error processing onSnapshot callback:', error);
      }
    });

    const getProductandCustomer = async () => {
      //Get Product List
      const userRef = await doc(firestoreDB, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
        setProducts(userDoc.data().products);
        setCustomers(userDoc.data().customers);
      } else {
        console.log('No product document!');
      }
    };

    getProductandCustomer();
    setLoading(false);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const getMetadata = async () => {
      const metaDataRef = await doc(firestoreDB, 'user_metadata', userInfo.uid);
      const metaDataSnap = await getDoc(metaDataRef);
      setUserMetadata(metaDataSnap.data());
    };

    if (userInfo) {
      getMetadata();
    }
    setLoading(false);
  }, [userInfo]);

  const groupedOrder = groupOrdersByDate(orderData);

  // Need to filter data based on status (active order ==> status === 'pending')

  if (loading || !userInfo) {
    return (
      <Box display="grid" sx={{ placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
      }}
    >
      <SideNav path="Orders" user={userInfo} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          ml: '250px',
        }}
      >
        {/* <Button
          onClick={() => {
            updateCustomer(userId);
            updateProducts(userId);
          }}
        > 
          Refresh Customer & Product
        </Button> */}

        <Typography variant="h5" sx={{ mx: 3, mt: 3 }}>
          Orders
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '70%', mx: 3 }}>
            {Object.entries(groupedOrder).map(([date, orders], index) => {
              let isTodaysOrder = true;
              if (index > 0) {
                isTodaysOrder = false;
              }
              // let isTodaysOrder = false;

              return (
                <OrderListByDate
                  key={date}
                  date={date}
                  orders={orders}
                  customers={customers}
                  userId={userId}
                  products={products}
                  userMetadata={userMetadata}
                  userInfo={userInfo}
                  isTodaysOrder={isTodaysOrder}
                />
              );
            })}
          </Box>
          <Box sx={{ width: '25%' }}>
            <OrderSummaryCard activeOrders={orderData} products={products} />
          </Box>
        </Box>

        <Box>&nbsp;</Box>
      </Box>
    </Box>
  );
};
