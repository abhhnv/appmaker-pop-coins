import CustomBlock from '../components/customBlock';
import CartLoginBlock from '../components/CartLoginBlock';
import EarnBlock from '../components/earnBlock';
import PDPBlock from '../components/PDPBlock';
import ListingBlock from '../components/ListingBlock';
import CartEarnBlock from '../components/CartEarnBlock';

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
  {
    name: 'popcoin/pdp-block',
    View: PDPBlock,
  },
  {
    name: 'popcoin/listing-block',
    View: ListingBlock,
  },
  {
    name: 'popcoin/cart-earn-block',
    View: CartEarnBlock,
  },
];

export { blocks };
