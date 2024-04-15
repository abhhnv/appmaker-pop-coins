/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import PopCoinLogo from '../assets/popcoin-logo.png';
import { useUser, useCart, useDiscount } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import CheckBox from '@react-native-community/checkbox';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';




const CartLoginBlock = (props) => {
  const { attributes, onAction } = props;
  const settings = getSettings();
  const { cart } = useCart({ onAction });

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

  const { totalQuantity, cartSubTotalAmount, cartTotalPrice, cartDiscountSavings } = useCart();
  const { appliedDiscountCodeItem, hasAutomaticDiscountApplied, appliedAutomaticDiscountItem, hasCouponApplied, couponsList } = useDiscount(props);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve data from AsyncStorage
        const data = await AsyncStorage.getItem('brandData');
        if (data !== null) {
          // Parse the retrieved data
          setBrandData(JSON.parse(data));
        }
        else {
          fetch(settings['shopify-store-name'])
            .then((res) => res.json())
            .then((retryData) => {
              setBrandData(retryData);
            });
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    fetchData();
  }, [settings]);

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        // Retrieve data from AsyncStorage
        const data = await AsyncStorage.getItem('coinsData');
        if (data !== null && data !== undefined) {
          // Parse the retrieved data
          setCoinsData(JSON.parse(data));
        }
        else {
          const headers = new Headers();
          headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
          headers.append('Content-Type', 'application/json');

          const requestData = {
            // eslint-disable-next-line prettier/prettier
            'shop': settings['shopify-name'],
            // eslint-disable-next-line prettier/prettier
            'email': user?.email,
          };

          const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData),
          };

          fetch(
            'https://prodreplica.mypopcoins.com/api/get/available/coins/email',
            requestOptions,
          )
            .then((res) => res.json())
            .then((data) => { setCoinsData(data) });
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    fetchCoinsData();
  }, [user?.email, settings]);

  // DISCOUNT CODE GENERATION
  useEffect(() => {
    // Fetch discount code only if the checkbox is checked and user email is available
    if (isChecked && user?.email && cartTotalPrice) {
      setLoading(true); // Set loading state to false when data fetching is completed
      const headers = new Headers();
      headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
      headers.append('Content-Type', 'application/json');

      const requestData = {
        'shop': settings['shopify-name'],
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
        }).catch((error) => {
          setLoading(false);
          setChecked(false);
        });
    }
  }, [isChecked, user?.email, cartTotalPrice]);

  useEffect(() => {
    if (isChecked && discountData?.code) {
      // Apply coupon only if it's not already applied
      onAction({
        action: 'APPLY_COUPON',
        params: {
          coupon: discountData.code,
        },
      });
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

  function handleLogin() {
    onAction({
      title: 'LOGIN',
      action: {
        action: 'OPEN_LOGIN_PAGE',
      },
    });
  }

  useEffect(() => {
    if (!isChecked && appliedDiscountCodeItem?.code) {
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: appliedDiscountCodeItem.code,
        },
      });
    }
    if (!isChecked && discountData?.code) {
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: discountData?.code,
        },
      });
    }
  }, [isChecked, appliedDiscountCodeItem?.code, discountData?.code, onAction]);

  const handleCheckbox = (newValue) => {
    setChecked(newValue);
  };

  console.log("cart=============================================", cart?.discountApplications?.edges?.length);


  useEffect(() => {
    if (isChecked === false) {
      if (appliedDiscountCodeItem?.code?.length > 2) {
        onAction({
          action: 'REMOVE_COUPON',
          params: {
            coupon: appliedDiscountCodeItem?.code,
          },
        });
      }
    }
  }, [appliedDiscountCodeItem?.code, isChecked, onAction]);

  return (
    <View style={styles.container}>
      {!isLoggedin ? (
        <View>
          <Text style={styles.textLogin} onPress={handleLogin}>Log in to get upto {brandData?.redemption_rate}% off using Bean Coins </Text>
        </View>
      )
        : <Text>{' '}</Text>
      }

      {isLoggedin ? (
        <View>
          <Text>
            {coinsData?.coins !== undefined ? (
              <View style={styles.block}>
                <CheckBox
                  value={isChecked}
                  onValueChange={(newValue) => handleCheckbox(newValue)}
                  style={styles.checkbox}
                />
                {isChecked
                  ?
                  <View>
                    {loading ? <Text>Loading...⏳</Text> :
                      <Text>
                        <Text style={{ fontWeight: '900' }}>Rs. {Math.floor(((brandData?.redemption_rate / 100) * cartTotalPrice)) < coinsData?.coins ? Math.round(((brandData?.redemption_rate / 100) * cartTotalPrice)) : coinsData?.coins} | Saved Using BeanCoins</Text>
                        <Text>(Cannot be clubbed with other discounts)</Text>
                      </Text>
                    }
                  </View>
                  :
                  <View>
                    {loading ? <Text>Loading...⏳</Text> :
                      <Text>
                        <Text style={{ fontWeight: '900' }}>Rs. {Math.floor(((brandData?.redemption_rate / 100) * cartTotalPrice)) < coinsData?.coins ? Math.round(((brandData?.redemption_rate / 100) * cartTotalPrice)) : coinsData?.coins} | Save Using BeanCoins (Cannot be clubbed with other discounts)</Text>
                        <Text>(Cannot be clubbed with other discounts)</Text>
                      </Text>
                    }
                  </View>
                }
              </View>
            )
              :
              <Text>{' '}</Text>
            }
          </Text>
        </View>
      )
        :
        <Text>{' '}</Text>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    display: 'flex',
    alignItems: 'flex-start',
  },

  block: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    color: 'red',
  },
  blockLogout: {
    display: 'flex',
  },
  textLogin: {
    fontWeight: 'bold',
  },
});

export default CartLoginBlock;
