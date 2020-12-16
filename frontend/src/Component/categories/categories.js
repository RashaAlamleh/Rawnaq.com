import React from 'react';
import './categories.styles.scss';
import CollectionItem from '../collection-item/collection-item';

const Categories=({title,items})=>(
    <div className='categories-preview'>
        <h1 className='title'>{title.toUpperCase()}</h1>
        <div className='preview'>
            {items
            .filter((item,idx)=>idx<4)
            .map(({id, ...otherItemProps})=>(
                <CollectionItem key={id} {...otherItemProps}/>
            ))}
           

        </div>
    </div>

);
        

export default Categories;