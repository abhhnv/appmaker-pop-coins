/* eslint-disable prettier/prettier */
// listing block
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useProductListItem, useUser } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';

const ListingBlock = (props) => {
    const { attributes, onAction } = props;
    const settings = getSettings();
    const { salePriceValue, regularPriceValue } = useProductListItem(props);
    const [brandData, setBrandData] = useState(null);
    const [coinsData, setCoinsData] = useState();
    const { isLoggedin, user } = useUser();

    // getting data from storage
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
    }, [settings]);

    useEffect(() => {
        const fetchCoinsData = async () => {
            try {
                // Retrieve data from AsyncStorage
                const data = await AsyncStorage.getItem('coinsData');
                if (data !== null && data !== undefined) {
                    // Parse the retrieved data
                    setCoinsData(JSON.parse(data));
                    console.log("asdf===================", user?.email);
                }
                else {
                    console.log('elsepart====================')
                    const headers = new Headers();
                    headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
                    headers.append('Content-Type', 'application/json');

                    const requestData = {
                        // eslint-disable-next-line prettier/prettier
                        'shop': settings['shopify-name'],
                        // eslint-disable-next-line prettier/prettier
                        'email': user?.email,
                    };

                    const requestOptions = {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(requestData),
                    };

                    fetch(
                        'https://prodreplica.mypopcoins.com/api/get/available/coins/email',
                        requestOptions,
                    )
                        .then((res) => res.json())
                        .then((data) => { setCoinsData(data) });
                }
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };
        fetchCoinsData();
    }, [user?.email, settings]);


    console.log('isLoggedin===================', isLoggedin);
    console.log("coinsdata==========================", coinsData?.coins);

    return (
        <View style={styles.container}>
            {isLoggedin ?
                <Text>
                    {/* <Text>{brandData?.redemption_rate + '--' + coinsData?.coins + '--' + user?.email}</Text> */}
                    {brandData?.redemption_rate && coinsData?.coins &&
                        (
                            <Text style={styles.block}>
                                <Text>
                                    <Text>or Rs. </Text>
                                    {salePriceValue ?
                                        <Text>{Math.floor(salePriceValue - ((brandData?.redemption_rate / 100) * salePriceValue))}</Text>
                                        :
                                        <Text>{Math.floor(regularPriceValue - ((brandData?.redemption_rate / 100) * regularPriceValue))}</Text>
                                    }
                                    <Text>&nbsp;+</Text>
                                    <Image style={{ width: 25, height: 25 }}
                                        source={{ uri: settings['popcoin-logo']?.url }}
                                    />
                                </Text>
                                <Text>
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
                                </Text>
                            </Text>
                        )
                    }
                </Text>
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
    block: {
        display: 'flex',
    },
});

export default ListingBlock;
