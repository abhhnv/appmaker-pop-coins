import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PopCoinLogo from '../assets/popcoin-logo.png';
import { useUser } from '@appmaker-xyz/shopify';

const CartLoginBlock = ({ attributes, onAction }) => {
  const {
    user,
    register,
    login,
    loginViaGoogle,
    loginLoadingStatus,
    isLoggedin,
  } = useUser();

  console.log({ user, register, login, loginViaGoogle, loginLoadingStatus });
  return (
    <View style={styles.container}>
      {isLoggedin ? (
        <Text>Welcome Logged In User</Text>
      ) : (
        <>
          <Text>
            You are missing out on earning //20// popcoins for this order
          </Text>
          <Text>
            Sign in to get upto 30% off using <Image source={PopCoinLogo} />{' '}
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
});

export default CartLoginBlock;
