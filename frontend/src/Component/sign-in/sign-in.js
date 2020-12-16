import React from 'react';
import Form from '../form/form.js';
import Button from '../buttom/buttom.js';
import {auth,signInWithGoogle} from '../../firebase/firebase.utils';
import './sign-in.styles.scss';
import { Redirect, Route } from "react-router";


class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  postdata = (event)=>{
            event.preventDefault()
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            };
            fetch('http://127.0.0.1:8000/accounts/login/', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('allpostdata',data)
                   
                    this.setState({ password:"",username:"" })
                    // console.log(data)
                    localStorage.setItem('auth',data.token)
                    
                });
    }



  handleSubmit = async event => {
    event.preventDefault();
    const{username,password}=this.state;

    try{
      await auth.signInWithnameAndPassword(username,password);
      this.setState({ username: '', password: '' });
    }catch(error){
      console.log(error);
    }

    
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
}

  render() {

    const{username,password}=this.state;

    return (
      <div className='sign-in'>
        <h2>I already have an account</h2>
        <span>Sign in with your name and password</span>

        <form className='sign-up-form' onSubmit={this.handleSubmit}>
          <Form
            type='text'
            name='username'
            value={username}
            onChange={this.handleChange}
            label='User Name'
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
                 
          <Button onClick={this.postdata} type='submit'> Sign in </Button>
          {/* <button onClick={this.postdata}>SignIn</button> */}
          <Button onClick={signInWithGoogle} isGoogleSignIn>
              {''}
               WITH Google{''}
               </Button>
        </form>
      </div>
    );
  }
}

export default SignIn;



// import React from 'react';
// import Form from '../form/form.js';

// import './sign-in.styles.scss';

// class SignIn extends React.Component{
//     constructor(props){
//         super(props);

//         this.state={
//             name:"",
//             password:""
//         }
//     }
// handleSubmit=event=>{
//     event.preventDefault();
//     this.setState({name:'',password:''})

// }
// handleChange=event=>{
//     const{value,name}=event.target;
//     this.setState({[name]:value})
// }


//     render(){
//         return(
//             <div className='sign-in'>
//                 <h2>I already have an account</h2>
//                 <span>Sign in with your name and password</span>
//                 <form onSubmit={this.handleSubmit}>
//                  <Form name="name" type="name"  value={this.state.name} handelChange={this.handelChange} label="name" required />
//                  <Form type="password" name="password"  value={this.state.name} handelChange={this.handelChange} label="password" required />
                 
//                  {/* <button onClick={this.postdata}>SignIn</button> */}
//                  <input type="submit" value="Submit"/>
//             </form>

//             </div>
//         )
//     }
// }
// export default SignIn
