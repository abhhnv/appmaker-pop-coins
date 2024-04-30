import { appmaker } from '@appmaker-xyz/core';
import { useEffect } from 'react';
import { getSettings } from '../../config';
import { useUser } from '@appmaker-xyz/shopify';
import AsyncStorage from '@react-native-community/async-storage';

const RootLevelComponent = (props) => {
  const settings = getSettings();
  const { user } = useUser();

  useEffect(() => {
    function getCoins() {
      const headers = new Headers();
      headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
      headers.append('Content-Type', 'application/json');
      let shopName = settings['shopify-name'];

      console.log({ shopName });
      const requestData = {
        // eslint-disable-next-line prettier/prettier
        'shop': 'iamcaffeine.myshopify.com',
        // eslint-disable-next-line prettier/prettier
        'email': user?.email,
      };

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      };
      console.log({ requestOptions });
      fetch(
        'https://prodreplica.mypopcoins.com/api/get/available/coins/email',
        requestOptions,
      )
        .then((res) => res.json())
        .then((data) => {
          console.log('datahere', data);
          // Store data in AsyncStorage
          AsyncStorage.setItem('coinsData', JSON.stringify(data))
            .then(() => console.log('Coins data stored successfully'))
            .catch((error) =>
              console.error('Error storing coins data:', error),
            );
        })
        .catch((error) => console.error('Error fetching coins data:', error));
    }

    function getBrandData() {
      fetch(settings['shopify-store-name'])
        .then((res) => res.json())
        .then((data) => {
          // Store data in AsyncStorage
          AsyncStorage.setItem('brandData', JSON.stringify(data))
            .then(() => console.log('Data stored successfully'))
            .catch((error) => console.error('Error storing data:', error));
        })
        .catch((error) => console.error('Error fetching data:', error));
    }

    // if (user?.email && settings['shopify-name']) {
    if (user?.email) {
      getCoins();
    }
    getBrandData();
    // }
  }, [settings, user, settings['shopify-name']]);

  return null;
};

appmaker?.addFilter(
  'app-custom-root-components',
  'test-case',
  (currentComponents) => {
    currentComponents?.push(RootLevelComponent);
    return currentComponents;
  },
);
