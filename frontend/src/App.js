import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Component/Footer/Footer.js';
import HomePage from './pages/homepage/homepage.js';
import ShopPage from './pages/shop/shop.js';
import Header from './Component/header/header';
import SignInandUp from './pages/signIn-signUP/signIn-signUP.js';
import {auth, createUserProfileDocument} from './firebase/firebase.utils';
import {connect} from 'react-redux';
import {setCurrentUser} from './redux/user/user.actions';
import signUP from './Component/sign-up/sign-up';
import SignIn from './Component/sign-in/sign-in';


class App extends React.Component {
unsubscribeFromAuth=null

componentDidMount() {
  const { setCurrentUser } = this.props;

  this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
    if (userAuth) {
      const userRef = await createUserProfileDocument(userAuth);

      userRef.onSnapshot(snapShot => {
        setCurrentUser({
          id: snapShot.id,
          ...snapShot.data()
        });
      });
    }

    setCurrentUser(userAuth);
  });
}

componentWillUnmount(){
  this.unsubscribeFromAuth();
}

  render() {
    return(
      <div>
        <Header />
        <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/shop' component={ShopPage} />
        <Route exact path='/signup' component={signUP} />
        <Route exact path='/SignIn'  render={()=>this.props.currentUser?(<Redirect to='/'/>):(<SignInandUp/>)} />
        <Route exact path='/SignIn' component={SignIn}  />
        </Switch>
        <Footer />
  
  
      </div>
    );
    }
  }

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps,mapDispatchToProps)(App);