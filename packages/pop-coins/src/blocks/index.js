import CustomBlock from '../components/customBlock';
import CartLoginBlock from '../components/CartLoginBlock';
import EarnBlock from '../components/earnBlock';

const blocks = [
  {
    name: 'popcoin/custom-block',
    View: CustomBlock,
  },
  {
    name: 'popcoin/cart-custom-block',
    View: CartLoginBlock,
  },
  {
    name: 'popcoin/cart-earn-block',
    View: EarnBlock,
  },
];

export { blocks };
