import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useProductDetail, useUser } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { useEffect } from 'react';
import { useState } from 'react';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';

const PDPBlock = (props) => {
  const { attributes, onAction } = props;

  const [brandData, setBrandData] = useState(null);
  const [coinsData, setCoinsData] = useState();
  const settings = getSettings();

  const {
    product,
    variantId,
    salePercentage,
    addToCart,
    salePrice,
    regularPrice,
    regularPriceValue,
    salePriceValue,
  } = useProductDetail(props);
  const { isLoggedin, user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve data from AsyncStorage
        const data = await AsyncStorage.getItem('brandData');
        if (data !== null) {
          // Parse the retrieved data
          setBrandData(JSON.parse(data));
        } else {
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
          console.log('asdf===================', user?.email);
        } else {
          console.log('elsepart====================');
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
            .then((data) => {
              setCoinsData(data);
            });
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    fetchCoinsData();
  }, [user?.email, settings]);

  console.log('thisissettingsPDP', settings['shopify-store-name']);
  console.log('brandData', brandData);

  return (
    <View style={styles.container}>
      {brandData ? (
        <Text style={styles.block}>
          <Text>Earn</Text>
          <Image
            style={{ width: 25, height: 25 }}
            source={{ uri: settings['popcoin-logo']?.url }}
          />
          <Text>
            {Math.floor((brandData?.issuance_rate / 100) * salePriceValue)}
            &nbsp;
          </Text>
          <Text>worth Rs.&nbsp;</Text>
          <Text>
            {Math.floor((brandData?.issuance_rate / 100) * salePriceValue)}
            &nbsp;
          </Text>
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    fontWeight: '500',
  },
  block: {
    display: 'flex',
  },
});

export default PDPBlock;
// useProductDetail
