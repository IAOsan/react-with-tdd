import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root.reducer';
import * as storageService from '../services/storage.service';

export const STATE_KEY = 'reduxState';

export function setupStore(preloadedState) {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
}

function createStore() {
	const persistedState = storageService.getItem(STATE_KEY) || {};
	const store = setupStore(persistedState);

	store.subscribe(() => {
		storageService.setItem(STATE_KEY, store.getState());
	});

	return store;
}

export default createStore;
