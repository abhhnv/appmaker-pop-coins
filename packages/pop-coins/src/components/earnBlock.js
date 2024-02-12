/* eslint-disable prettier/prettier */
// PDP BLOCK
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const EarnBlock = ({ attributes, onAction }) => {
  const { title, appmakerAction } = attributes;
  return (
    <View style={styles.container}>
      <Text>POPCOIN TEST TEXT</Text>
      <Text>this is a subheading</Text>
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
});

export default EarnBlock;
