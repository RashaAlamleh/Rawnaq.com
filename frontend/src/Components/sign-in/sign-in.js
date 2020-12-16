import React from 'react';
import Form from '../form/form.js';
import Button from '../buttom/buttom.js';
import {auth,signInWithGoogle} from '../../firebase/firebase.utils';
import './sign-in.styles.scss';

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
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
            fetch('http://127.0.0.1:8000/api/login/', requestOptions)
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
    const{email,password}=this.state;

    try{
      await auth.signInWithEmailAndPassword(email,password);
      this.setState({ email: '', password: '' });
    }catch(error){
      console.log(error);
    }

    
  };

  handleChange = event => {
    const { value, name } = event.target;
    //console.log("a",value )

    this.setState({ [name]: value });

  };

  render() {
    return (
      <div className='sign-in'>
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>

        <form onSubmit={this.handleSubmit}>
          <Form
            name='email'
            type='email'
            handleChange={this.handleChange}
            value={this.state.email}
            label='email'
            required
          />
          <Form
            name='password'
            type='password'
            value={this.state.password}
            handleChange={this.handleChange}
            label='password'
            required
          />
          <div className='buttons'>
          <Button onClick={this.postdata} type='submit'> Sign in </Button>
          {/* <button onClick={this.postdata}>SignIn</button> */}
          <Button onClick={signInWithGoogle} isGoogleSignIn>
              {''}
               WITH Google{''}
               </Button>
               </div>
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
//             email:"",
//             password:""
//         }
//     }
// handleSubmit=event=>{
//     event.preventDefault();
//     this.setState({email:'',password:''})

// }
// handleChange=event=>{
//     const{value,name}=event.target;
//     this.setState({[name]:value})
// }


//     render(){
//         return(
//             <div className='sign-in'>
//                 <h2>I already have an account</h2>
//                 <span>Sign in with your email and password</span>
//                 <form onSubmit={this.handleSubmit}>
//                  <Form name="email" type="email"  value={this.state.email} handelChange={this.handelChange} label="email" required />
//                  <Form type="password" name="password"  value={this.state.email} handelChange={this.handelChange} label="password" required />
                 
//                  {/* <button onClick={this.postdata}>SignIn</button> */}
//                  <input type="submit" value="Submit"/>
//             </form>

//             </div>
//         )
//     }
// }
// export default SignIn
