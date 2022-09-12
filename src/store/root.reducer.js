import { combineReducers } from '@reduxjs/toolkit';
import entitiesReducer from './entities.reducer';
import authReducer from './auth/auth.slice';
import uiReducer from './ui/ui.slice';

const rootReducer = combineReducers({
	entities: entitiesReducer,
	auth: authReducer,
	ui: uiReducer,
});

export default rootReducer;
