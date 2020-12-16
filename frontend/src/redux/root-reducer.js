import {combineReducers} from 'redux';
import userReducer from './user/user.js';

export default combineReducers({
    user:userReducer
});