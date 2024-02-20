/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import PopCoinLogo from '../assets/popcoin-logo.png';
import { useUser, useCart, useDiscount } from '@appmaker-xyz/shopify';
import { logger } from "react-native-logs";
import BeanCoinLogo from '../assets/bean-coin.png';
import CheckBox from '@react-native-community/checkbox';


const CartLoginBlock = (props) => {

  const { attributes, onAction } = props;

  const [isChecked, setChecked] = useState(false);
  const [discountData, setDiscountData] = useState();
  const [coinsData, setCoinsData] = useState();
  const [brandData, setBrandData] = useState();


  const {
    user,
    register,
    login,
    loginViaGoogle,
    loginLoadingStatus,
    isLoggedin,
  } = useUser();

  const { totalQuantity, cartSubTotalAmount, cartTotalPrice, } = useCart();
  const { appliedDiscountCodeItem } = useDiscount(props);

  console.log('subtotal', cartSubTotalAmount);
  console.log({ user, register, login, loginViaGoogle, loginLoadingStatus });
  console.log({ appliedDiscountCodeItem });

  // BRAND DATA
  useEffect(() => {
    fetch(
      'https://prodreplica.mypopcoins.com/api/get-brand?shop=iamcaffeine.myshopify.com',
    )
      .then((res) => res.json())
      .then((data) => setBrandData(data));
  }, []);

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
    // Fetch discount code only if the checkbox is checked and user email is available
    if (isChecked && user?.email && cartSubTotalAmount && brandData) {
      const headers = new Headers();
      headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
      headers.append('Content-Type', 'application/json');

      const requestData = {
        'shop': 'iamcaffeine.myshopify.com',
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
    }
  }, [isChecked, user?.email, cartSubTotalAmount, brandData]);

  useEffect(() => {
    if (isChecked && discountData?.code) {
      // Apply coupon only if it's not already applied
      if (!appliedDiscountCodeItem || appliedDiscountCodeItem.code !== discountData.code) {
        onAction({
          action: 'APPLY_COUPON',
          params: {
            coupon: discountData.code,
          },
        });
      }
    }
    else if (!isChecked && appliedDiscountCodeItem?.code) {
      // Remove coupon if checkbox is unchecked
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: appliedDiscountCodeItem.code,
        },
      });
    }
  }, [isChecked, discountData?.code, appliedDiscountCodeItem?.code]);


  console.log("coinsData?.coins", coinsData?.coins);
  console.log("discountData?.code", discountData?.code);
  console.log("cartSubTotalAmount", cartSubTotalAmount);

  return (
    <View style={styles.container}>
      {isLoggedin ? (
        <>
          {coinsData?.coins !== undefined ? (
            <View style={styles.block}>
              <CheckBox
                // onClick={applyCoupon}
                value={isChecked}
                onValueChange={setChecked}
                style={styles.checkbox}
              />
              {isChecked
                ?
                <Text style={{ fontWeight: '900' }}>Rs. {Math.floor(((brandData?.redemption_rate / 100) * cartSubTotalAmount)) < coinsData?.coins ? Math.floor(((brandData?.redemption_rate / 100) * cartSubTotalAmount)) : coinsData?.coins} | Saved Using</Text>
                :
                <Text style={{ fontWeight: '900' }}>Rs. {Math.floor(((brandData?.redemption_rate / 100) * cartSubTotalAmount)) < coinsData?.coins ? Math.floor(((brandData?.redemption_rate / 100) * cartSubTotalAmount)) : coinsData?.coins} | Save Using</Text>
              }
              <Image style={{ width: 25, height: 25 }} source={BeanCoinLogo} />
            </View>
          )
            : null}
        </>
      ) : null}
      <Text>{discountData?.code}</Text>
      <Text>{cartSubTotalAmount}</Text>
    </View>
  );
};

// cartSubTotalAmount * redemptionRate / 100 

const styles = StyleSheet.create({
  container: {
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 5,
    display: 'flex',
    alignItems: 'flex-end',
  },

  block: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  }
});



export default CartLoginBlock;

// earn on pdp
