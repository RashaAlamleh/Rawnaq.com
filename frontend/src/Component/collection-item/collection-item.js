import React from 'react';

import './collection-item.styles.scss';

const CollectionItem=({id,name,price,imageUrl})=> (
    <div className='Collection-item'>
        <div
        className='image'
        style={{
            backgroundImage:`url(${imageUrl})`
        }}
        />
            <div className='collection-end'>
    <span className='name'>{name}</span>
    <span className='price'>{price}</span>

            

        </div>
    </div>
);
export default CollectionItem;
