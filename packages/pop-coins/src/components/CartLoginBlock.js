/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, CheckBox, Button } from 'react-native';
import PopCoinLogo from '../assets/popcoin-logo.png';
import { useUser, useCart } from '@appmaker-xyz/shopify';
import { logger } from "react-native-logs";

const CartLoginBlock = ({ attributes, onAction }) => {

  const [isChecked, setChecked] = useState(false);
  const [discountData, setDiscountData] = useState();
  const [coinsData, setCoinsData] = useState();

  const {
    user,
    register,
    login,
    loginViaGoogle,
    loginLoadingStatus,
    isLoggedin,
  } = useUser();

  const { totalQuantity, cartSubTotalAmount, cartTotalPrice, } = useCart();

  console.log('subtotal', cartSubTotalAmount);
  console.log({ user, register, login, loginViaGoogle, loginLoadingStatus });

  // GET AVAILABLE COINS API
  useEffect(() => {
    const headers = new Headers();

    headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
    headers.append('Content-Type', 'application/json');

    const requestData = {
      'shop': 'iamcaffeine.myshopify.com',
      'email': user?.email,
    };

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    };

    fetch('https://prodreplica.mypopcoins.com/api/get/available/coins/email', requestOptions)
      .then((res) => res.json())
      .then((data) => setCoinsData(data));
  }, [user?.email]);

  // DISCOUNT CODE GENERATION

  useEffect(() => {
    const headers = new Headers();

    headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
    headers.append('Content-Type', 'application/json');

    const requestData = {
      'shop': 'test-popcoin.myshopify.com',
      'email': user?.email,
      'cart': cartSubTotalAmount,
    };

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    };

    fetch('https://prodreplica.mypopcoins.com/api/get/coins/discount/email', requestOptions)
      .then((res) => res.json())
      .then((data) => setDiscountData(data));

  }, [user?.email, cartSubTotalAmount]);


  // console.log("coins data", coinsData);
  // console.log("discount code", discountData);
  console.log("actual code", discountData?.code);

  // to remove the coupon when unchecked
  useEffect(() => {
    if (!isChecked) {
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: discountData?.code,
        },
      });
    }
  }, [isChecked, discountData?.code]);


  // to apply the coupon when checked
  useEffect(() => {
    if (discountData?.code != null || discountData?.code != undefined) {
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: discountData?.code,
        },
      });
    }
    if (isChecked) {
      onAction({
        action: 'APPLY_COUPON',
        params: {
          coupon: discountData?.code,
        },
      });
    }
  }, [isChecked, discountData?.code]);

  return (
    <View style={styles.container}>
      {isLoggedin ? (
        <>
          <View style={styles.block}>
            <CheckBox
              // onClick={applyCoupon}
              value={isChecked}
              onValueChange={setChecked}
              style={styles.checkbox}
            />
            <Text style={{ fontWeight: '900' }}>Rs. {coinsData?.coins} | Saved Using BeanCoins</Text>
          </View>
        </>
      ) : (
        <>
          <Text>
            You are missing out on earning //20// popcoins for this order
          </Text>
          <Text>
            Sign in to get upto 30% off using <Image style={{ width: 25, height: 25 }} source={PopCoinLogo} />{' '}
            popcoins
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red', // You can set any color you prefer here
    padding: 10,
    margin: 5,
    color: 'white',
  },

  block: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  }
});



export default CartLoginBlock;
