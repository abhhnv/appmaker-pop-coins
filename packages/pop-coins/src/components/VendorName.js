import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProductListItem } from '@appmaker-xyz/shopify';

const VendorName = (props) => {
  const { vendorName } = useProductListItem(props);
  return (
    <View style={styles.container}>
      <Text>Vendor: {vendorName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
});

export default VendorName;
