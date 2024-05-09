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
  const [coinsData, setCoinsData] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [alreadyDiscount, setAlreadyDiscount] = useState(false);
  const [isFirst, setFirst] = useState("");
  const [coinDiscount, setCoinDiscount] = useState("");

  const {
    user,
    register,
    login,
    loginViaGoogle,
    loginLoadingStatus,
    isLoggedin,
  } = useUser();

  const { totalQuantity, cartSubTotalAmount, cartTotalPrice, cartDiscountSavings, lineItems, currentCart, cartTotalSavings, cartTotalSavingWithoutDiscount } = useCart();
  const { appliedDiscountCodeItem, hasAutomaticDiscountApplied, appliedAutomaticDiscountItem, hasCouponApplied, couponsList } = useDiscount(props);

  // brand data
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

  // coins data
  // useEffect(() => {
  //   if (user?.email != null) {
  //     const headers = new Headers();
  //     headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
  //     headers.append('Content-Type', 'application/json');

  //     const requestData = {
  //       'shop': settings['shopify-name'],
  //       'email': user?.email,
  //     };

  //     const requestOptions = {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(requestData),
  //     };

  //     fetch('https://prodreplica.mypopcoins.com/api/get/available/coins/email', requestOptions)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setCoinsData(data);
  //       });
  //   }
  // }, [user?.email, user, userEmail, settings]);


  useEffect(() => {
    async function getCoins() {
      const data = await AsyncStorage.getItem('coinsData');
      if (data != null && coinsData === null) {
        setCoinsData(data);
      }
    }
    getCoins();
  }, []);


  // DISCOUNT CODE GENERATION
  useEffect(() => {
    // Fetch discount code only if the checkbox is checked and user email is available
    if (isChecked && user?.email && cartSubTotalAmount) {
      setLoading(true); // Set loading state to false when data fetching is completed
      const headers = new Headers();
      headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
      headers.append('Content-Type', 'application/json');

      const requestData = {
        'shop': settings['shopify-name'],
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
        .then((data) => {
          setDiscountData(data);
          setLoading(false); // Set loading state to false when data fetching is completed
        }).catch((error) => {
          setLoading(false);
          setChecked(false);
        });
    }
  }, [isChecked]);

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
    else if (!isChecked && appliedDiscountCodeItem?.code.includes('PopShop')) {
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
    if (!isChecked && appliedDiscountCodeItem?.code?.includes('PopShop')) {
      onAction({
        action: 'REMOVE_COUPON',
        params: {
          coupon: appliedDiscountCodeItem.code,
        },
      });
    }
    if (!isChecked && discountData?.code?.includes('PopShop')) {
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


  // useEffect(() => {
  //   if (isChecked === false) {
  //     if (appliedDiscountCodeItem?.code?.includes('PopShop') && appliedDiscountCodeItem?.code?.length > 2) {
  //       onAction({
  //         action: 'REMOVE_COUPON',
  //         params: {
  //           coupon: appliedDiscountCodeItem?.code,
  //         },
  //       });
  //     }
  //   }
  // }, [appliedDiscountCodeItem?.code, isChecked, onAction]);


  useEffect(() => {
    function hasDiscount(array) {
      // Iterate through each object in the array
      for (let i = 0; i < array.length; i++) {
        // Check if the current object's 'discountAllocations' array is not empty
        if (array[i].node.discountAllocations.length > 0) {
          // Iterate through each discount allocation
          for (let j = 0; j < array[i].node.discountAllocations.length; j++) {
            // Check if the 'code' key exists and starts with 'popshop'
            if (array[i].node.discountAllocations[j].discountApplication &&
              array[i].node.discountAllocations[j].discountApplication.code &&
              array[i].node.discountAllocations[j].discountApplication.code.toLowerCase().startsWith("popshop")) {
              // If found, consider it as no discount and continue to the next object
              continue;
            } else {
              // If a discount allocation doesn't meet the condition, return true
              setAlreadyDiscount(true);
              return true;
            }
          }
        }
      }
      // If none of the objects have a non-empty 'discountAllocations' array or if all discounts are considered as no discount, return false
      setAlreadyDiscount(false);
      return false;
    }

    hasDiscount(lineItems);
  }, [lineItems]);

  // console.log("lineitems", JSON.stringify(lineItems));
  // console.log({ alreadyDiscount });
  // console.log("lineItems", JSON.stringify(lineItems));
  console.log("currentcart=============", currentCart);

  // cart length logic
  useEffect(() => {
    // if (isChecked === true){
    setChecked(false);
    // }
  }, [totalQuantity]);

  console.log("couponList=======>", couponsList);
  console.log("cartTotalSavings", cartTotalSavings);

  useEffect(() => {
    // let isStatic = cartSubTotalAmount;
    // if (!isChecked){
    // setCoinDiscount(Math.min(coinsData?.coins, parseInt(brandData?.max_discount_per_order), Math.round((parseInt(brandData?.redeem) / 100) * parseInt(isStatic))))
    if (!isChecked) {
      setDiscountData(cartSubTotalAmount);
    }
  }, []);


  console.log("coinsData", JSON.stringify(coinsData));

  return (
    <View style={styles.container}>
      {!isLoggedin ? (
        <View>
          <Text style={styles.textLogin} onPress={handleLogin}>Log in to get upto {brandData?.redemption_rate}% off using Bean Coins </Text>
          <Text>(Cannot be clubbed with other discounts)</Text>
        </View>
      )
        : <Text>{' '}</Text>
      }
      <View>
        {/* <Text>sample text</Text> */}
        {!alreadyDiscount ? (
          <View>
            {isLoggedin ? (
              <View>

                <Text>
                  <Text>{coinsData?.coins + "static"}</Text>

                  {coinsData?.avaiable ? (
                    <View style={styles.block}>
                      <CheckBox
                        value={isChecked}
                        onValueChange={(newValue) => handleCheckbox(newValue)}
                        style={styles.checkbox}
                      />
                      {isChecked
                        ?
                        // checked
                        <View>
                          {loading ? <Text>Loading...⏳</Text> :
                            <Text>
                              {/* <Text style={styles.textLogin}>Saved Rs.&nbsp;{cartTotalSavings}&nbsp;using Bean Coins</Text> */}
                              {/* <Text style={styles.textLogin}>Saved Rs.&nbsp;{Math.min(coinsData?.coins, parseInt(brandData?.max_discount_per_order), Math.round((parseInt(brandData?.redeem) / 100) * parseInt(cartSubTotalAmount)))}&nbsp;using Bean Coins</Text> */}
                              {/* <Text style={styles.textLogin}>Save Rs.&nbsp;{Math.min(coinsData?.coins, parseInt(brandData?.max_discount_per_order), Math.round((parseInt(brandData?.redeem) / 100) * parseInt(cartSubTotalAmount)))}&nbsp;using Bean Coins</Text> */}
                              <Text style={styles.textLogin}>Saved Rs.&nbsp;{Math.round(coinsData?.coins > Math.trunc(cartTotalPrice - cartTotalSavingWithoutDiscount) * (brandData.redeem / 100) ? Math.trunc(cartTotalPrice - cartTotalSavingWithoutDiscount) * (brandData.redeem / 100) : coinsData?.coins)}&nbsp;using Bean Coins</Text>
                            </Text>
                          }
                        </View>
                        :
                        // unchecked
                        <View>
                          {loading ? <Text style={styles.textLogin}>Loading...⏳</Text> :
                            <Text>
                              {/* {cartSubTotalAmount === cartTotalPrice ? */}
                              {/* <Text style={styles.textLogin}>uncheck-Save Rs.&nbsp;{Math.min(coinsData?.coins, parseInt(brandData?.max_discount_per_order), Math.round((parseInt(brandData?.redeem) / 100) * parseInt(cartSubTotalAmount)))}&nbsp;using Bean Coins</Text> */}
                              <Text style={styles.textLogin}>Save Rs.&nbsp;{Math.round(coinsData?.coins > Math.trunc(cartTotalPrice - cartTotalSavingWithoutDiscount) * (brandData.redeem / 100) ? Math.trunc(cartTotalPrice - cartTotalSavingWithoutDiscount) * (brandData.redeem / 100) : coinsData?.coins)}&nbsp;using Bean Coins</Text>
                              {/* :
                                <Text>Loading...⏳</Text>} */}
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
        ) :
          <Text style={styles?.textLogin}>Bean Coins discount cannot be applied with existing coupon!</Text>
        }
      </View>
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
