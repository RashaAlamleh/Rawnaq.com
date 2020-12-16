import React from 'react';
import SHOP_DATA from './shop.data.js';
import Categories from '../../Component/categories/categories';


class ShopPage extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        collections: SHOP_DATA
      };
    }
  
    render() {
      const { collections } = this.state;
      return( <div className='shop-page'>
          {collections.map(({ id, ...otherCollectionProps }) => (
             <Categories key={id} {...otherCollectionProps} />
           ))}
        </div>
      )
    }
  }
  
  export default ShopPage;