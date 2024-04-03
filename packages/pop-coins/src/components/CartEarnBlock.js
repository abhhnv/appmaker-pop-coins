/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, CheckBox, Button } from 'react-native';
import { useUser, useCart } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';

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
        fetch(settings['shopify-store-name'])
            .then((res) => res.json())
            .then((data) => setBrandData(data));
    }, []);

    console.log("thisissettings", settings);

    return (
        <View style={styles.container}>
            {isLoggedin && (
                <>
                    <View style={styles.block}>
                        {brandData?.issuance_rate ? (
                            <Text style={styles.block}>
                                <Text>Earn </Text>
                                <Text>{Math.trunc((brandData?.issuance_rate / 100) * cartSubTotalAmount)}</Text>
                                <Image style={{ width: 25, height: 25 }} source={{ uri: settings['popcoin-logo']?.url }} />
                                <Text>worth</Text>
                                <Text> Rs. {Math.trunc((brandData?.issuance_rate / 100) * cartSubTotalAmount)}&nbsp;on this purchase</Text>
                            </Text>
                        )
                            : <Text> </Text>
                        }
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingBottom: 20,
        display: 'flex',
        alignItems: 'flex-start',
    },
});

export default CartEarnBlock;
