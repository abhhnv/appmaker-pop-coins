/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, CheckBox, Button } from 'react-native';
import { useUser, useCart } from '@appmaker-xyz/shopify';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';



const DrawerMenuBlock = ({ attributes, onAction }) => {
    const settings = getSettings();
    const [coinsData, setCoinsData] = useState(null);

    useEffect(() => {
        async function getCoins() {
          const data = await AsyncStorage.getItem('coinsData');
          if (data != null && coinsData === null) {
            setCoinsData(data);
          }
        }
        getCoins();
      }, []);


    return (
        <View style={styles.container}>
           <Text>hello</Text>
           <Text>{JSON.parse(coinsData).coins}</Text>
           <Text>hgfdsasfgfdsa</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        color: 'black',
    },
});

export default DrawerMenuBlock;
