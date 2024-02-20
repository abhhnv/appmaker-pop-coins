import { appmaker } from '@appmaker-xyz/core';
import { insertToSlot } from '@appmaker-xyz/core';
import { pages } from './pages/index';
import { blocks } from './blocks/index';
import PDPBlock from './components/PDPBlock';
import ListingBlock from './components/ListingBlock';
import CartEarnBlock from './components/CartEarnBlock';

export function activate(params) {
  insertToSlot('grid-item-below-price', ListingBlock, 0);
  insertToSlot('pdp-below-price', PDPBlock, 0);

  console.log('pop-coins activated with config', params);

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
