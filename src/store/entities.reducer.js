import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './users/users.slice';

export default combineReducers({
	users: usersReducer,
});
