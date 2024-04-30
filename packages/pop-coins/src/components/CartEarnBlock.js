/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, CheckBox, Button } from 'react-native';
import { useUser, useCart } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';



const CartEarnBlock = ({ attributes, onAction }) => {
    const settings = getSettings();
    const {
        user,
        register,
        login,
        loginViaGoogle,
        loginLoadingStatus,
        isLoggedin,
    } = useUser();

    const { cart, cartSubTotalAmount, cartTotalPrice } = useCart();
    const [brandData, setBrandData] = useState(null);

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
    }, []);

    console.log("thisissettings", settings);

    return (
        <View style={styles.container}>
            {(
                <View style={styles.block}>
                    {brandData?.issuance_rate ? (
                        <View style={styles.block}>
                            <Text>Earn </Text>
                            <Image style={styles.imgself}
                                source={{ uri: settings['popcoin-logo']?.url }}
                            />
                            <Text>{Math.floor((brandData?.issuance_rate / 100) * cartTotalPrice)}</Text>
                            <Text>&nbsp;worth</Text>
                            <Text> Rs. {Math.floor((brandData?.issuance_rate / 100) * cartTotalPrice)}&nbsp;on this purchase</Text>
                        </View>
                    )
                        : <Text> </Text>
                    }
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 12,
        paddingBottom: 20,
        display: 'flex',
        alignItems: 'flex-start',
    },
    block: {
        fontWeight: 'bold',
        display: 'flex',
        // backgroundColor: 'red',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    imgself: {
        height: 25,
        width: 25,
    },
});

export default CartEarnBlock;
