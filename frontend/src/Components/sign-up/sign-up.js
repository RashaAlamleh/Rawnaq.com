import React from 'react';
import Form from '../form/form.js';
import Button from '../buttom/buttom.js';
import {auth,createUserProfileDocument} from '../../firebase/firebase.utils.js';
import './sign-up.styles.scss';
// import { connect } from 'react-redux';
// import { Link, Redirect } from 'react-router-dom';

class SignUp extends React.Component{
    constructor(){
        super();
        this.state={
            displayName:'',
            email:'',
            password:'',
            confirmPassword:''
        }
    }
    handleSubmit = async event => {
        event.preventDefault();
    
        const { displayName, email, password, confirmPassword } = this.state;
    
        if (password !== confirmPassword) {
          alert("passwords don't match");
          return;
        }
        try {
            const { user } = await auth.createUserWithEmailAndPassword(
              email,
              password
            );
      
            await createUserProfileDocument(user, { displayName });
      
            this.setState({
              displayName: '',
              email: '',
              password: '',
              confirmPassword: ''
            });
          } catch (error) {
            console.error(error);
          }
        };
      
        handleChange = event => {
          const { name, value } = event.target;
      
          this.setState({ [name]: value });
    }
    



    render(){
        const{displayName,email,password,confirmPassword}=this.state;
      //   if (this.state.redirect) {
      //     return <Redirect to="/signin" />
      // } else {
        return(
            <div className='sign-up'>
                <h2 className='title'>YOU DON'T HAVE A ACCOUNT?</h2>
                <span>Sign Up with your email and password</span>
                <form className='sign-up-form' onSubmit={this.handleSubmit}>
          <Form
            type='text'
            name='displayName'
            value={displayName}
            onChange={this.handleChange}
            label='Display Name'
            required
          />
          <Form
            type='email'
            name='email'
            value={email}
            onChange={this.handleChange}
            label='Email'
            required
          />
          <Form
            type='password'
            name='password'
            value={password}
            onChange={this.handleChange}
            label='Password'
            required
          />
          <Form
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={this.handleChange}
            label='Confirm Password'
            required
          />
          <Button type='submit'>SIGN UP</Button>
        </form>

            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//   return {
//       colors: state.colors
//   }
// }
// export default SignUp;
export default (SignUp);