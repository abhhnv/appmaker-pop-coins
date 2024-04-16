/* eslint-disable prettier/prettier */
// listing block
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useProductListItem, useUser } from '@appmaker-xyz/shopify';
import BeanCoinLogo from '../assets/bean-coin.png';
import { getSettings } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import { getUser } from '@appmaker-xyz/core';


const ListingBlock = (props) => {
    const { attributes, onAction } = props;
    const settings = getSettings();
    const { salePriceValue, regularPriceValue } = useProductListItem(props);
    const [brandData, setBrandData] = useState(null);
    const [coinsData, setCoinsData] = useState();
    const [userEmail, setUserEmail] = useState("");
    const { isLoggedin } = useUser();
    const user = getUser();

    // getting brand data from storage
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
                    console.log("brand data else part")
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


    // getting coins data from the storage
    useEffect(() => {
        async function getCoins() {
            const data = await AsyncStorage.getItem('coisData');
            if (data) {
                console.log({ data });
                setCoinsData(() => data);
            }
            else {
                function getCoins() {
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
                        .then((data) => { setCoinsData(data)})
                        .catch((error) => console.error('Error fetching coins data:', error));
                }
                getCoins();
            }
        }
        getCoins();
    }, [user, user?.email, settings]);

    console.log("-------->coinsData", coinsData);

    return (
        <View style={styles.container}>
            {isLoggedin ?
                <Text>
                    {/* <Text>{coinsData?.coins + " " + "-" + brandData?.redemption_rate}</Text> */}
                    {/* <Text>{user?.email}</Text> */}
                    <Text>{coinsData?.coins + ''}</Text>
                    <Text>static text testing</Text>
                    {brandData?.redemption_rate && coinsData?.avaiable &&
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
        alignItems: 'center',
    },
});

export default ListingBlock;
