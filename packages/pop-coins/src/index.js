import { appmaker } from '@appmaker-xyz/core';
import { insertToSlot } from '@appmaker-xyz/core';
import { pages } from './pages/index';
import { blocks } from './blocks/index';
import PDPBlock from './components/PDPBlock';
import ListingBlock from './components/ListingBlock';
import CartEarnBlock from './components/CartEarnBlock';
import { setSettings } from '../config';
import { getSettings } from '../config';
import AsyncStorage from '@react-native-community/async-storage';
import { getUser } from '@appmaker-xyz/core';

export function activate(params) {
  setSettings(params?.settings);
  insertToSlot('grid-item-below-price', ListingBlock, 0);
  insertToSlot('pdp-below-price', PDPBlock, 0);
  const user = getUser();
  console.log('user-----------------------------------------', user);

  const settings = getSettings();

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
  getBrandData();

  // GET AVAILABLE COINS API
  // function getCoins() {
  //   const headers = new Headers();
  //   headers.append('Authorization', 'Basic em9oOlowaCRQcm9iQDIwMjM=');
  //   headers.append('Content-Type', 'application/json');

  //   const requestData = {
  //     // eslint-disable-next-line prettier/prettier
  //     'shop': settings['shopify-name'],
  //     // eslint-disable-next-line prettier/prettier
  //     'email': user?.email,
  //   };

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: headers,
  //     body: JSON.stringify(requestData),
  //   };

  //   fetch(
  //     'https://prodreplica.mypopcoins.com/api/get/available/coins/email',
  //     requestOptions,
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       AsyncStorage.setItem('coinsData', JSON.stringify(data))
  //         .then(() => console.log('Coins data stored successfully'))
  //         .catch((error) => console.error('Error storing coins data:', error));
  //     })
  //     .catch((error) => console.error('Error fetching coins data:', error));
  // }
  // getCoins();

  const CartLoginBlock = {
    clientId: 'popcoin/cart-custom-block',
    name: 'popcoin/cart-custom-block',
    attributes: {},
  };

  const CartEarnBlock = {
    clientId: 'popcoin/cart-earn-block',
    name: 'popcoin/cart-earn-block',
    attributes: {},
  };

  function findBlockIndex(blocks, name) {
    return blocks.findIndex((block) => block.name === name);
  }

  // cart login block
  appmaker.addFilter(
    'inapp-page-data-response',
    'popcoin/cart-custom-block',
    (data, { pageId }) => {
      if (pageId === 'cartPageCheckout') {
        const index = 6; // settings from extension
        // const index = settings?.block_position || 3; // settings from extension
        const deliveryBlockIndex = findBlockIndex(
          data.blocks,
          CartLoginBlock.clientId,
        );
        if (deliveryBlockIndex === -1) {
          data.blocks.splice(index + 1, 0, CartLoginBlock);
        }
      }
      console.log({ data });
      return data;
    },
  );

  // cart earnblock
  appmaker.addFilter(
    'inapp-page-data-response',
    'popcoin/cart-earn-block',
    (data, { pageId }) => {
      if (pageId === 'cartPageCheckout') {
        const index = 4; // settings from extension
        // const index = settings?.block_position || 3; // settings from extension
        const deliveryBlockIndex = findBlockIndex(
          data.blocks,
          CartEarnBlock.clientId,
        );
        if (deliveryBlockIndex === -1) {
          data.blocks.splice(index + 1, 0, CartEarnBlock);
        }
      }
      return data;
    },
  );
}

const PopCoins = {
  id: 'pop-coins',
  activate,
  blocks,
  // pages,
};
appmaker.registerPlugin(PopCoins);
export default PopCoins;
