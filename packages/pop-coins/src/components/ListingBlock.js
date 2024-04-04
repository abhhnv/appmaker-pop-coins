/* eslint-disable prettier/prettier */
// listing block
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useProductListItem, useUser } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';




const ListingBlock = (props) => {
    const { attributes, onAction } = props;
    const settings = getSettings();
    const { salePriceValue, regularPriceValue } = useProductListItem(props);
    const [brandData, setBrandData] = useState(null);
    const { isLoggedin} = useUser();

    useEffect(() => {
        fetch(settings['shopify-store-name'])
            .then((res) => res.json())
            .then((data) => setBrandData(data));
    }, [settings['shopify-store-name']]);

    console.log("brand-", settings['popcoin-logo']?.url);

    return (
        <View style={styles.container}>
            {
               brandData?.redemption_rate && (
                    <Text style={styles.block}>
                        <Text>or Rs. </Text>
                        {regularPriceValue ?
                            <Text>{Math.trunc(regularPriceValue - ((brandData?.redemption_rate / 100) * regularPriceValue))}</Text>
                            :
                            <Text>{Math.trunc(salePriceValue - ((brandData?.redemption_rate / 100) * salePriceValue))}</Text>
                        }
                        <Text>+</Text>
                        <Image style={{ width: 25, height: 25 }}
                            source={{ uri: settings['popcoin-logo']?.url }}
                        />
                        {regularPriceValue ?
                            <Text>{Math.trunc((brandData.redemption_rate / 100) * regularPriceValue)}</Text>
                            :
                            <Text>{Math.trunc((brandData.redemption_rate / 100) * salePriceValue)}</Text>
                        }
                    </Text>
                )
            }
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
