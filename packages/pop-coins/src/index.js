import { appmaker } from '@appmaker-xyz/core';
import { pages } from './pages/index';
import { blocks } from './blocks/index';

export function activate(params) {
  console.log('pop-coins activated with config', params);

  // const deliveryCheckerBlock = {
  //   clientId: 'delivery-checker-block',
  //   name: 'extension-delivery-checker/delivery-checker',
  //   attributes: {},
  // };

  // appmaker.addFilter(
  //   'inapp-page-data-response',
  //   'delivery-checker',
  //   (data, { pageId }) => {
  //     if (pageId === 'cartPageCheckout') {
  //       const index = settings?.block_position || 3; // settings from extension
  //       const deliveryBlockIndex = findBlockIndex(
  //         data.blocks,
  //         deliveryCheckerBlock.clientId,
  //       );
  //       if (deliveryBlockIndex === -1) {
  //         data.blocks.splice(index + 1, 0, deliveryCheckerBlock);
  //       }
  //     }
  //     return data;
  //   },
  // );
}

const PopCoins = {
  id: 'pop-coins',
  activate,
  blocks,
  pages,
};
appmaker.registerPlugin(PopCoins);
export default PopCoins;
