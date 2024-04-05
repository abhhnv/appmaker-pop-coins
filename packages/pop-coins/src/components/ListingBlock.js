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



    // useEffect(() => {
    //     fetch(settings['shopify-store-name'])
    //         .then((res) => res.json())
    //         .then((data) => setBrandData(data));
    // }, [settings['shopify-store-name']]);

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
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };
        fetchData();
    }, []);

    // GET AVAILABLE COINS API
    useEffect(() => {
        const headers = new Headers();

        headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
        headers.append('Content-Type', 'application/json');

        const requestData = {
            'shop': settings['shopify-name'],
            'email': user?.email,
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData),
        };

        fetch('https://prodreplica.mypopcoins.com/api/get/available/coins/email', requestOptions)
            .then((res) => res.json())
            .then((data) => setCoinsData(data));
    }, [user?.email]);


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
                        <Text>
                            {isLoggedin ?
                                <Text>
                                    {regularPriceValue ?
                                        <Text>
                                            {Math.trunc((brandData.redemption_rate / 100) * regularPriceValue) < coinsData?.coins ? Math.trunc((brandData.redemption_rate / 100) * regularPriceValue) : coinsData?.coins}
                                        </Text>
                                        :
                                        <Text>{Math.trunc((brandData.redemption_rate / 100) * salePriceValue) < coinsData?.coins ? Math.trunc((brandData.redemption_rate / 100) * salePriceValue) : coinsData?.coins}</Text>
                                    }
                                </Text>
                                :

                                <Text>
                                    {regularPriceValue ?
                                        <Text>
                                            {Math.trunc((brandData.redemption_rate / 100) * regularPriceValue)}
                                        </Text>
                                        :
                                        <Text>
                                            {Math.trunc((brandData.redemption_rate / 100) * salePriceValue)}
                                        </Text>
                                    }
                                </Text>
                            }

                        </Text>

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
