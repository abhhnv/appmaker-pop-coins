/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, CheckBox, Button } from 'react-native';
import { useUser, useCart } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';


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

    const { cart, cartSubTotalAmount } = useCart();
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
                        <Text style={styles.block}>
                            <Text>Earn </Text>
                            <Image style={{ width: 25, height: 25 }} source={{ uri: settings['popcoin-logo']?.url }} />
                            <Text>{Math.floor((brandData?.issuance_rate / 100) * cartSubTotalAmount)}</Text>
                            <Text>&nbsp;worth</Text>
                            <Text> Rs. {Math.floor((brandData?.issuance_rate / 100) * cartSubTotalAmount)}&nbsp;on this purchase</Text>
                        </Text>
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
    },
});

export default CartEarnBlock;
