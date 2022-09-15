import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root.reducer';
import * as storageService from '../services/storage.service';
import { STATE_KEY } from '../config';

export function setupStore(preloadedState) {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
}

function createStore(initialState) {
	const persistedState = storageService.getItem(STATE_KEY) || {};
	const store = setupStore(initialState || persistedState);

	store.subscribe(() => {
		storageService.setItem(STATE_KEY, store.getState());
	});

	return store;
}

export default createStore;
