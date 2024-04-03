import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useProductDetail } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { useEffect } from 'react';
import { useState } from 'react';
import { getSettings } from '../../config';

const PDPBlock = (props) => {
  const { attributes, onAction } = props;

  const [brandData, setBrandData] = useState(null);
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

  useEffect(() => {
    fetch(settings['shopify-store-name'])
      .then((res) => res.json())
      .then((data) => setBrandData(data));
  }, []);

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
            {Math.trunc((brandData?.issuance_rate / 100) * salePriceValue)}
            &nbsp;
          </Text>
          <Text>worth Rs.&nbsp;</Text>
          <Text>
            {Math.trunc((brandData?.issuance_rate / 100) * salePriceValue)}
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
