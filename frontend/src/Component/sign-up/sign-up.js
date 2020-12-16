import React from 'react';
import Form from '../form/form.js';
import Button from '../buttom/buttom.js';
import {auth,createUserProfileDocument} from '../../firebase/firebase.utils.js';
import './sign-up.styles.scss';
import { Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { Link, Redirect } from 'react-router-dom';

class SignUp extends React.Component{
    constructor(){
        super();
        this.state={
          username:'',
            email:'',
            password:'',
            confirmPassword:''
        }
    }
    handleSubmit = async event => {
        event.preventDefault();
    
        const { username, email, password, confirmPassword } = this.state;
    
        if (password !== confirmPassword) {
          alert("passwords don't match");
          return;
        }
        try {
            const { user } = await auth.createUserWithEmailAndPassword(
              email,
              password
            );
      
            await createUserProfileDocument(user, { username });
      
            this.setState({
              username: '',
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
    
    postdata = (event)=>{
      event.preventDefault()
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.state)
      };
      fetch('http://127.0.0.1:8000/accounts/sign_up/', requestOptions)
          .then(response => response.json())
          .then(data => {
              console.log('allpostdata = ',data)
             
              this.setState({ username:"",email:"",password:"",confirmPassword:""})
              // console.log(data)
              
              localStorage.setItem('auth',data.token)
              this.setState({ redirect: "/Signin" });
          });
}


    render(){
        const{username,email,password,confirmPassword}=this.state;
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
            name='username'
            value={username}
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
          <Button onClick={this.postdata} type='submit'>SIGN UP</Button>
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