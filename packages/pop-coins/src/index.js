import { appmaker } from '@appmaker-xyz/core';
import { pages } from './pages/index';
import { blocks } from './blocks/index';

export function activate(params) {
  console.log('pop-coins activated with config', params);

  const CartLoginBlock = {
    clientId: 'popcoin/cart-custom-block',
    name: 'popcoin/cart-custom-block',
    attributes: {},
  };

  function findBlockIndex(blocks, name) {
    return blocks.findIndex((block) => block.name === name);
  }

  appmaker.addFilter(
    'inapp-page-data-response',
    'popcoin/cart-custom-block',
    (data, { pageId }) => {
      if (pageId === 'cartPageCheckout') {
        const index = 1; // settings from extension
        // const index = settings?.block_position || 3; // settings from extension
        const deliveryBlockIndex = findBlockIndex(
          data.blocks,
          CartLoginBlock.clientId,
        );
        if (deliveryBlockIndex === -1) {
          data.blocks.splice(index + 1, 0, CartLoginBlock);
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
