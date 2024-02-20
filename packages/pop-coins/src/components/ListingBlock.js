/* eslint-disable prettier/prettier */
// listing block
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useProductListItem } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';


const ListingBlock = (props) => {
    const { attributes, onAction } = props;
    const { salePriceValue, regularPriceValue } = useProductListItem(props);
    const [brandData, setBrandData] = useState();


    useEffect(() => {
        fetch(
            'https://prodreplica.mypopcoins.com/api/get-brand?shop=iamcaffeine.myshopify.com',
        )
            .then((res) => res.json())
            .then((data) => setBrandData(data));
    }, []);

    console.log({ brandData });

    console.log({ salePriceValue, regularPriceValue });
    return (
        <View style={styles.container}>
            {brandData ? (
                <Text style={styles.block}>
                    <Text>or Rs. </Text>
                    <Text>{Math.floor(salePriceValue - ((brandData?.redemption_rate / 100) * salePriceValue))}</Text>
                    <Text>+</Text>
                    <Image style={{ width: 25, height: 25 }} source={BeanCoinLogo} />
                    <Text>{Math.floor((brandData?.redemption_rate / 100) * salePriceValue)}</Text>
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        color: 'white',
    },
    block: {
        display: 'flex',
    },
});

export default ListingBlock;
// useProductListItem

