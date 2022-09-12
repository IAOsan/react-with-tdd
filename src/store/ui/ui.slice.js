import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: '[ui]',
	initialState: {
		status: 'idle',
		error: null,
	},
	reducers: {
		error_added(state, { payload }) {
			state.error = payload;
		},
		error_removed(state) {
			state.error = null;
		},
		loading_status(state) {
			state.status = 'loading';
		},
		successful_status(state) {
			state.status = 'success';
		},
		failed_status(state) {
			state.status = 'error';
		},
	},
});

const {
	error_added,
	error_removed,
	loading_status,
	successful_status,
	failed_status,
} = slice.actions;

export default slice.reducer;

export const addError = error_added;

export const removeError = error_removed();

export const loadingStatus = loading_status();

export const successStatus = successful_status();

export const failedStatus = failed_status();
