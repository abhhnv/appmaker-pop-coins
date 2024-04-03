/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import PopCoinLogo from '../assets/popcoin-logo.png';
import { useUser, useCart, useDiscount } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import CheckBox from '@react-native-community/checkbox';
import { getSettings } from '../../config';



const CartLoginBlock = (props) => {

  const { attributes, onAction } = props;
  const settings = getSettings();


  console.log({ props })

  const [isChecked, setChecked] = useState(false);
  const [discountData, setDiscountData] = useState();
  const [coinsData, setCoinsData] = useState();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(false);


  const {
    user,
    register,
    login,
    loginViaGoogle,
    loginLoadingStatus,
    isLoggedin,
  } = useUser();

  const { totalQuantity, cartSubTotalAmount, cartTotalPrice } = useCart();
  const { appliedDiscountCodeItem } = useDiscount(props);

  console.log('cartTotalPrice', cartTotalPrice);
  console.log({ user, register, login, loginViaGoogle, loginLoadingStatus });
  console.log({ appliedDiscountCodeItem });

  // BRAND DATA
  useEffect(() => {
    fetch(settings['shopify-store-name'])
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
    if (isChecked && user?.email && cartTotalPrice) {
      setLoading(true); // Set loading state to false when data fetching is completed
      console.log("===========================hello hello==============================")
      console.log({ isChecked, user, cartTotalPrice });
      const headers = new Headers();
      headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
      headers.append('Content-Type', 'application/json');

      const requestData = {
        'shop': 'iamcaffeine.myshopify.com',
        'email': user?.email,
        'cart': cartTotalPrice,
      };

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      };

      fetch('https://prodreplica.mypopcoins.com/api/get/coins/discount/email', requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setDiscountData(data);
          setLoading(false); // Set loading state to false when data fetching is completed
        });
    }
  }, [isChecked, user?.email, cartTotalPrice]);

  useEffect(() => {
    if (isChecked && discountData?.code) {
      console.log("===========================applyied==============================")
      // Apply coupon only if it's not already applied
      onAction({
        action: 'APPLY_COUPON',
        params: {
          coupon: discountData.code,
        },
      });
    }
    else if (!isChecked && appliedDiscountCodeItem?.code) {
      console.log("===========================removed==============================")
      // Remove coupon if checkbox is unchecked
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: appliedDiscountCodeItem.code,
        },
      });
    }
  }, [isChecked, discountData?.code, appliedDiscountCodeItem?.code]);

  function handleLogin() {
    console.log("login-clicked", props);

    onAction({
      title: 'LOGIN',
      action: {
        action: 'OPEN_LOGIN_PAGE',
      },
    });
  }


  return (
    <View style={styles.container}>
      {!isLoggedin ? (
        <>
          <View>
            <View style={styles.block}>
              <Text>You are missing out on earning {Math.trunc(((brandData?.redemption_rate / 100) * cartTotalPrice)) < coinsData?.coins ? Math.trunc(((brandData?.redemption_rate / 100) * cartTotalPrice)) : coinsData?.coins} BeanCoins</Text>
              <Image style={{ width: 25, height: 25 }}
                source={{ uri: settings['popcoin-logo']?.url }}
              />              <Text>on this order</Text>
            </View>
            <Text onPress={handleLogin}>Sign in to get upto {brandData?.redemption_rate}% off using BeanCoins </Text>
          </View>
        </>
      )
        : <Text></Text>
      }

      {isLoggedin ? (
        <>
          {coinsData?.coins !== undefined ? (
            <View style={styles.block}>
              <CheckBox
                value={isChecked}
                onValueChange={setChecked}
                style={styles.checkbox}
              />
              {isChecked
                ?
                <>
                  {loading ? <Text>Loading...⏳</Text> :
                    <Text style={{ fontWeight: '900' }}>Rs. {Math.trunc(((brandData?.redemption_rate / 100) * cartTotalPrice)) < coinsData?.coins ? Math.trunc(((brandData?.redemption_rate / 100) * cartTotalPrice)) : coinsData?.coins} | Saved Using</Text>
                  }
                </>
                :
                <>
                  {loading ? <Text>Loading...⏳</Text> :
                    <Text style={{ fontWeight: '900' }}>Rs. {Math.trunc(((brandData?.redemption_rate / 100) * cartTotalPrice)) < coinsData?.coins ? Math.trunc(((brandData?.redemption_rate / 100) * cartTotalPrice)) : coinsData?.coins} | Save Using</Text>
                  }
                </>
              }
              <Image style={{ width: 25, height: 25 }}
                source={{ uri: settings['popcoin-logo']?.url }}
              />
            </View>
          )
            : null
          }
        </>
      )
        : null}
    </View>
  );
};

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
  },
  blockLogout: {
    display: 'flex',
  }
});

export default CartLoginBlock;
