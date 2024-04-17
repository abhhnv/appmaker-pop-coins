/* eslint-disable prettier/prettier */
// listing block
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useProductListItem, useUser } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';


const ListingBlock = (props) => {
    const { attributes, onAction } = props;
    const settings = getSettings();
    const { salePriceValue, regularPriceValue, title } = useProductListItem(props);
    const [brandData, setBrandData] = useState(null);
    const [coinsData, setCoinsData] = useState();
    const [userEmail, setUserEmail] = useState("");
    const { isLoggedin, user } = useUser();

    // getting brand data from storage
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve data from AsyncStorage
                const data = await AsyncStorage.getItem('brandData');
                if (data !== null) {
                    // Parse the retrieved data
                    setBrandData(JSON.parse(data));
                    // console.log('brandData title', JSON.parse(data));
                }
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };
        fetchData();
    }, [settings]);


    // getting coins data from the storage
    useEffect(() => {
        async function getCoinsWrapper() {
            const data = await AsyncStorage.getItem('coinsData');
            if (data !== null) {
                setCoinsData(JSON.parse(data));
                console.log('coinsData', JSON.parse(data));
            }
        }
        if (user?.email) {
            getCoinsWrapper();
        }
    }, [isLoggedin]);

    // console.log("-------->coinsData", coinsData);

    return (
        <View style={styles.container}>
            {isLoggedin ?
                <View>
                    {brandData?.redemption_rate && coinsData?.avaiable &&
                        (
                            <View style={{ display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text>or Rs. </Text>
                                {salePriceValue ?
                                    <Text>{Math.floor(salePriceValue - ((brandData?.redemption_rate / 100) * salePriceValue))}</Text>
                                    :
                                    <Text>{Math.floor(regularPriceValue - ((brandData?.redemption_rate / 100) * regularPriceValue))}</Text>
                                }
                                <Text>&nbsp;+</Text>
                                {/* {Platform === 'ios' ? <Text>Bean Coins</Text> : */}
                                    <Image style={styles.imgself}
                                        source={{ uri: settings['popcoin-logo']?.url }}
                                    />
                                {/* } */}
                                <Text>
                                    {salePriceValue ?
                                        <Text>
                                            <Text>{(salePriceValue - (Math.floor(salePriceValue - ((brandData?.redemption_rate / 100) * salePriceValue)))) < coinsData?.coins ? (salePriceValue - (Math.floor(salePriceValue - ((brandData?.redemption_rate / 100) * salePriceValue)))) : coinsData?.coins}</Text>
                                        </Text>
                                        :
                                        <Text>
                                            <Text>{(regularPriceValue - (Math.floor(regularPriceValue - ((brandData?.redemption_rate / 100) * regularPriceValue)))) < coinsData?.coins ? (regularPriceValue - (Math.floor(regularPriceValue - ((brandData?.redemption_rate / 100) * regularPriceValue)))) : coinsData?.coins}</Text>
                                        </Text>
                                    }
                                </Text>
                            </View>
                        )
                    }
                </View>
                :
                <Text>{' '}</Text>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        color: 'white',
    },
    imgself: {
        height: 25,
        width: 25,
    },
    block: {
    }
});


export default ListingBlock;
