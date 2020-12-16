import React from 'react';
import { Link } from 'react-router-dom';
import {ReactComponent as Logo} from '../../assets/aya.svg';
import{auth} from '../../firebase/firebase.utils';
import {connect} from 'react-redux';

import './header.styles.scss';
// import { stat } from 'fs';

const Header =({currentUser})=> (
    <div className='header'>
        <Link className='logoLink' to ="/">
            <Logo className='logo'/>

        </Link>
        <div className='options'>
            <Link className='options' to='/shop'>
                SHOP
            </Link>
            <Link className='option' to='/shop'>
                CONTACT
            </Link>
            <Link className='options' to='/SignUp'>
               signUP
            </Link>
            {
                currentUser?
                <div className='option' onClick={()=>auth.signOut()}>SIGN OUT</div>
                :
                <Link className='option' to='/Signin'>SIGN IN</Link>
            }
            

        </div>

    </div>
);
// const mapStateToProps= state=({
//     currentUser:state.user.currentUser

// })

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
  });


export default connect(mapStateToProps) (Header);