import React from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import './sign-up.styles.css';

class SignUp extends React.Component {
  constructor() {
    super();

    this.state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  checkPassWord = (password) => {
    // if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=.{8,})/.test(password)) {
    //   return true;
    // }
    return true;
  }

  handleSubmit = async event => {
    event.preventDefault();
    // const usernameError = document.querySelector('.username.error');
    // const emailError = document.querySelector('.email.error');
    // const passwordError = document.querySelector('.password.error');
    // usernameError.textContent = '';
    // emailError.textContent = '';
    // passwordError.textContent = '';

    const { password, confirmPassword } = this.state;
    if (password.length < 4) {                                   //*  originaly was 8 char.  *//
      alert("Password should not be less than 4 charecters")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords Don't Match")
      return;
    }

    // sign up the user
    fetch('/user/signup', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("jwt-auth", data.token)
          localStorage.setItem("current-user", data.displayName)
          return true
        } else if (data.message) {
          alert("Email Already Exists")
        } else {
          alert("User Name already Exists")
        }

        console.log('Success:', data);
      })
      .then(() => window.location.reload())
      .catch((error) => {
        console.error('Error:', error);
      });
    this.setState({
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })


  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value })
  }


  render() {
    const { displayName, email, password, confirmPassword } = this.state;
    return (
      <div className='sign-up'>
        <button ><Link to="/">Return To Home Page</Link> </button>
        <form className='sign-up-form' onSubmit={this.handleSubmit}>
          <h2 className='title'>Sign Up</h2>
          <FormInput
            type='text'
            name='displayName'
            value={displayName}
            onChange={this.handleChange}
            placeholder='Display Name'
            required
          />
          <div className="username error" ></div>

          <FormInput
            type='email'
            name='email'
            value={email}
            onChange={this.handleChange}
            placeholder='Email'
            required
          />
          <FormInput
            type='password'
            name='password'
            value={password}
            onChange={this.handleChange}
            placeholder='Password'
            required
          />
          <FormInput
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={this.handleChange}
            placeholder='Confirm Password'
            required
          />
          <CustomButton type='submit'>SIGN UP</CustomButton>
          <p >Already have an account? <Link to="/signin" >Sign In</Link></p>
        </form>
      </div>
    );
  }
}

export default SignUp;
