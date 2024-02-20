/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, CheckBox, Button } from 'react-native';
import { useUser, useCart } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';

const CartEarnBlock = ({ attributes, onAction }) => {
    const {
        user,
        register,
        login,
        loginViaGoogle,
        loginLoadingStatus,
        isLoggedin,
    } = useUser();

    const { cart, cartSubTotalAmount } = useCart();
    const [brandData, setBrandData] = useState();


    useEffect(() => {
        fetch(
            'https://prodreplica.mypopcoins.com/api/get-brand?shop=iamcaffeine.myshopify.com',
        )
            .then((res) => res.json())
            .then((data) => setBrandData(data));
    }, []);

    console.log({brandData});

    return (
        <View style={styles.container}>
            {isLoggedin ? (
                <>
                    <View style={styles.block}>
                        {brandData ? (
                            <Text style={styles.block}>
                                <Text>Earn</Text>
                                <Image style={{ width: 25, height: 25 }} source={BeanCoinLogo} />
                                <Text>{Math.floor((brandData?.issuance_rate / 100) * cartSubTotalAmount)}&nbsp;</Text>
                            </Text>
                        ) : null}
                    </View>
                </>
            ) : null }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingBottom : 20,
        display: 'flex',
        alignItems: 'flex-end',
    },
});

export default CartEarnBlock;
