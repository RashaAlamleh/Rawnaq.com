import React,{Component} from 'react';
import MenuItem from '../menu-item/menu-item.component';
import './directory.styles.scss';

class Directory extends React.Component {
    constructor() {
      super();
  
      this.state = {
        sections: [
          {
            title: 'hats',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0viS-61qfbF4khRWJ7sGjztN1_i-dHCAYLQ&usqp=CAU',
            id: 1,
            linkUrl: 'hats'
          },
          {
            title: 'jackets',
            imageUrl: 'https://www.travelfashiongirl.com/wp-content/uploads/2017/12/how-to-pack-winter-jackets-in-a-suitcase-1.jpg',
            id: 2,
            linkUrl: ''
          },
          {
            title: 'shoes',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAw-d17GWKJt505eW4ifUMFWMHLNe6NXMGfQ&usqp=CAU',
            id: 3,
            linkUrl: ''
          },
          {
            title: 'womens',
            imageUrl: 'https://d3ss0gp3e5d7m3.cloudfront.net/assets/images/cheetah-print-sweater@1x.2tZnD.jpg',
            size: 'large',
            id: 4,
            linkUrl: ''
          },
          {
            title: 'mens',
            imageUrl: 'https://ae01.alicdn.com/kf/Ha9f72a433fb74210934283b8515a801aO/New-Summer-Men-s-T-Shirt-2020-Fashion-Basic-T-Shirt-Mens-Clothes-Trend-Slim-Short.jpg',
            size: 'large',
            id: 5,
            linkUrl: ''
           

          }
        ]
      };
    }
  
    render() {
      return (
        <div className='directory-menu'>
          {this.state.sections.map(({id, ...otherSectionProps}) => (
            <MenuItem key={id} {...otherSectionProps} />
          ))}
        </div>
      );
    }
  }
  
  export default Directory;