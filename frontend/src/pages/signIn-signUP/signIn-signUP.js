import React from 'react';
import'./signIn-signUP.styles.scss';
import SignIn from '../../Component/sign-in/sign-in';
import SignUp from '../../Component/sign-up/sign-up';

const SignInandUp=()=>(
    <div className='sign-in-and-up'>
        <SignIn/>
        <SignUp/>
        </div>
);
export default SignInandUp;